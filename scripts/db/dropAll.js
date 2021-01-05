/**
 * drop tables
 */
const _ = require('lodash')
const sequelize = require('../../src/models/index')
const logger = require('../../src/common/logger')
const {
  topResources,
  organizationResources,
  modelToESIndexMapping
} = require('../constants')
const { getESClient } = require('../../src/common/es-client')

async function main () {
  const client = getESClient()

  // delete es pipelines
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

  // delete data in es
  const keys = Object.keys(sequelize.models)
  for (let i = 0; i < keys.length; i++) {
    const key = keys[i]
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
    } catch (e) {
      console.error(e)
      logger.warn(`deleting data in es for ${key} failed`)
    }
  }

  // delete tables
  try {
    await sequelize.drop()
  } catch (e) {
    console.error(e)
    logger.warn('deleting tables failed')
  }
}

(async () => {
  main().catch(err => console.error(err))
})()
