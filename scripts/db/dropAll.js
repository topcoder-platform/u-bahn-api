/**
 * drop tables
 */
const _ = require('lodash')
const models = require('../../src/models')
const logger = require('../../src/common/logger')
const {
  topResources,
  organizationResources,
  modelToESIndexMapping
} = require('../constants')
const { getESClient } = require('../../src/common/es-client')

async function main () {
  const client = getESClient()

  try {
    logger.info('Deleting all pipelines...')
    await client.ingest.deletePipeline({
      id: topResources.user.pipeline.id
    })
    await client.ingest.deletePipeline({
      id: topResources.skillprovider.pipeline.id
    })
    await client.ingest.deletePipeline({
      id: topResources.attributegroup.pipeline.id
    })
    logger.info('Successfully deleted')
  } catch (e) {
    console.error(e)
    logger.warn('Delete all ingest pipelines failed')
  }

  const keys = Object.keys(models)
  for (let i = 0; i < keys.length; i++) {
    const key = keys[i]
    if (models[key].tableName) {
      const esResourceName = modelToESIndexMapping[key]
      try {
        if (_.includes(_.keys(topResources), esResourceName)) {
          if (topResources[esResourceName].enrich) {
            logger.info(`Deleting enrich policy for ${esResourceName}`)
            await client.enrich.deletePolicy({
              name: topResources[esResourceName].enrich.policyName
            })
            logger.info(`Successfully deleted enrich policy for ${esResourceName}`)
          }
          logger.info(`Deleting index for ${esResourceName}`)
          await client.indices.delete({
            index: topResources[esResourceName].index
          })
          logger.info(`Successfully deleted enrich policy for ${esResourceName}`)
        } else if (_.includes(_.keys(organizationResources), esResourceName)) {
          logger.info('Deleting enrich policy for organization')
          await client.enrich.deletePolicy({
            name: organizationResources[esResourceName].enrich.policyName
          })
          logger.info('Successfully deleted enrich policy for organization')
        }

        logger.info(`Deleting data in QLDB for ${esResourceName}`)
        await models.DBHelper.clear(models[key])
        logger.info(`Successfully deleted data in QLDB for ${esResourceName}`)
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
