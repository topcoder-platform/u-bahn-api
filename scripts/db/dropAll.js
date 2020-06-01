/**
 * drop tables
 */
const _ = require('lodash')
const models = require('../../src/models')
const logger = require('../../src/common/logger')
const { topResources, modelToESIndexMapping } = require('../constants')
const { getESClient } = require('../../src/common/es-client')

async function main () {
  const client = getESClient()
  const keys = Object.keys(models)
  for (let i = 0; i < keys.length; i++) {
    const key = keys[i]
    if (models[key].tableName) {
      const esResourceName = modelToESIndexMapping[key]
      try {
        await models.DBHelper.drop(models[key])

        if (_.includes(_.keys(topResources), esResourceName)) {
          await client.indices.delete({
            index: topResources[esResourceName].index
          })
        }
      } catch (e) {
        console.error(e)
        logger.warn(`drop table ${key} failed`)
      }
    }
  }
}

(async () => {
  main().catch(err => console.error(err))
})()
