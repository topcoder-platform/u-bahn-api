/**
 * drop tables
 */
const models = require('../../src/models')
const logger = require('../../src/common/logger')

async function main () {
  const keys = Object.keys(models)
  for (let i = 0; i < keys.length; i++) {
    const key = keys[i]
    if (models[key].tableName) {
      try {
        await models.DBHelper.drop(models[key])
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
