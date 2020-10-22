const _ = require('lodash')
const models = require('../../src/models')
const logger = require('../../src/common/logger')
const { getESClient } = require('../../src/common/es-client')
const {
  topResources,
  userResources,
  organizationResources,
  modelToESIndexMapping
} = require('../constants')

// Declares the ordering of the resource data insertion, to ensure that enrichment happens correctly
const RESOURCES_IN_ORDER = [
  'skillprovider',
  'role',
  'achievementprovider',
  'attributegroup',
  'skill',
  'attribute',
  'organization',
  'organizationskillprovider',
  'user',
  'userskill',
  'achievement',
  'userrole',
  'externalprofile',
  'userattribute'
]

const client = getESClient()

const RESOURCE_NOT_FOUND = 'resource_not_found_exception'
const INDEX_NOT_FOUND = 'index_not_found_exception'

/**
 * Cleans up the data in elasticsearch
 * @param {Array} keys Array of models
 */
async function cleanupES (keys) {
  const client = getESClient()
  try {
    await client.ingest.deletePipeline({
      id: topResources.user.pipeline.id
    })
  } catch (e) {
    if (e.meta && e.meta.body.error.type !== RESOURCE_NOT_FOUND) {
      throw e
    }
  }

  try {
    await client.ingest.deletePipeline({
      id: topResources.skillprovider.pipeline.id
    })
  } catch (e) {
    if (e.meta && e.meta.body.error.type !== RESOURCE_NOT_FOUND) {
      throw e
    }
  }

  try {
    await client.ingest.deletePipeline({
      id: topResources.attributegroup.pipeline.id
    })
  } catch (e) {
    if (e.meta && e.meta.body.error.type !== RESOURCE_NOT_FOUND) {
      throw e
    }
  }

  try {
    for (let i = 0; i < keys.length; i++) {
      const key = keys[i]
      if (models[key].tableName) {
        const esResourceName = modelToESIndexMapping[key]
        if (_.includes(_.keys(topResources), esResourceName)) {
          if (topResources[esResourceName].enrich) {
            try {
              await client.enrich.deletePolicy({
                name: topResources[esResourceName].enrich.policyName
              })
            } catch (e) {
              if (e.meta && e.meta.body.error.type !== RESOURCE_NOT_FOUND) {
                throw e
              }
            }
          }

          try {
            await client.indices.delete({
              index: topResources[esResourceName].index
            })
          } catch (e) {
            if (e.meta && e.meta.body.error.type !== INDEX_NOT_FOUND) {
              throw e
            }
          }
        } else if (_.includes(_.keys(organizationResources), esResourceName)) {
          try {
            await client.enrich.deletePolicy({
              name: organizationResources[esResourceName].enrich.policyName
            })
          } catch (e) {
            if (e.meta && e.meta.body.error.type !== RESOURCE_NOT_FOUND) {
              throw e
            }
          }
        }
      }
    }
  } catch (e) {
    console.log(JSON.stringify(e))
    throw e
  }
  console.log('Existing data in elasticsearch has been deleted!')
}

async function insertIntoES (modelName, body) {
  const esResourceName = modelToESIndexMapping[modelName]

  if (!esResourceName) {
    logger.error(`Cannot insert data into model ${modelName}. No equivalent elasticsearch index found`)

    return
  }

  if (_.includes(_.keys(topResources), esResourceName)) {
    await client.index({
      index: topResources[esResourceName].index,
      type: topResources[esResourceName].type,
      id: body.id,
      body,
      pipeline: topResources[esResourceName].ingest ? topResources[esResourceName].ingest.pipeline.id : undefined,
      refresh: 'wait_for'
    })
  } else if (_.includes(_.keys(userResources), esResourceName)) {
    const userResource = userResources[esResourceName]

    const { body: user } = await client.getSource({
      index: topResources.user.index,
      type: topResources.user.type,
      id: body.userId
    })

    if (userResource.nested === true && userResource.mappingCreated !== true) {
      await client.indices.putMapping({
        index: topResources.user.index,
        type: topResources.user.type,
        include_type_name: true,
        body: {
          properties: {
            [userResource.propertyName]: {
              type: 'nested'
            }
          }
        }
      })
      userResource.mappingCreated = true
    }

    const relateId = body[userResource.relateKey]

    if (!user[userResource.propertyName]) {
      user[userResource.propertyName] = []
    }

    if (_.some(user[userResource.propertyName], [userResource.relateKey, relateId])) {
      logger.error(`Can't create existing ${esResourceName} with the ${userResource.relateKey}: ${relateId}, userId: ${body.userId}`)
    } else {
      user[userResource.propertyName].push(body)
      await client.index({
        index: topResources.user.index,
        type: topResources.user.type,
        id: body.userId,
        body: user,
        pipeline: topResources.user.pipeline.id,
        refresh: 'wait_for'
      })
    }
  } else if (_.includes(_.keys(organizationResources), esResourceName)) {
    const orgResource = organizationResources[esResourceName]

    const { body: organization } = await client.getSource({
      index: topResources.organization.index,
      type: topResources.organization.type,
      id: body.organizationId
    })

    const relateId = body[orgResource.relateKey]

    if (!organization[orgResource.propertyName]) {
      organization[orgResource.propertyName] = []
    }

    if (_.some(organization[orgResource.propertyName], [orgResource.relateKey, relateId])) {
      logger.error(`Can't create existing ${esResourceName} with the ${orgResource.relateKey}: ${relateId}, organizationId: ${body.organizationId}`)
    } else {
      organization[orgResource.propertyName].push(body)
      await client.index({
        index: topResources.organization.index,
        type: topResources.organization.type,
        id: body.organizationId,
        body: organization,
        refresh: 'wait_for'
      })
    }
  }
}

/**
 * Creates and executes the enrich policy for the provided model
 * @param {String} modelName The model name
 */
async function createAndExecuteEnrichPolicy (modelName) {
  const esResourceName = modelToESIndexMapping[modelName]

  if (_.includes(_.keys(topResources), esResourceName) && topResources[esResourceName].enrich) {
    await client.enrich.putPolicy({
      name: topResources[esResourceName].enrich.policyName,
      body: {
        match: {
          indices: topResources[esResourceName].index,
          match_field: topResources[esResourceName].enrich.matchField,
          enrich_fields: topResources[esResourceName].enrich.enrichFields
        }
      }
    })
    await client.enrich.executePolicy({ name: topResources[esResourceName].enrich.policyName })
  } else if (_.includes(_.keys(organizationResources), esResourceName)) {
    // For organization, execute enrich policy AFTER the sub documents on the org (namely orgskillprovider) is in
    // This is because external profile on user is enriched with org, and it needs to have the orgskillprovider details in it
    await client.enrich.putPolicy({
      name: organizationResources[esResourceName].enrich.policyName,
      body: {
        match: {
          indices: topResources.organization.index,
          match_field: organizationResources[esResourceName].enrich.matchField,
          enrich_fields: organizationResources[esResourceName].enrich.enrichFields
        }
      }
    })
    await client.enrich.executePolicy({ name: organizationResources[esResourceName].enrich.policyName })
  }
}

/**
 * Creates the ingest pipeline using the enrich policy
 * @param {String} modelName The model name
 */
async function createEnrichProcessor (modelName) {
  const esResourceName = modelToESIndexMapping[modelName]

  if (_.includes(_.keys(topResources), esResourceName) && topResources[esResourceName].pipeline) {
    if (topResources[esResourceName].pipeline.processors) {
      const processors = []

      for (let i = 0; i < topResources[esResourceName].pipeline.processors.length; i++) {
        const ep = topResources[esResourceName].pipeline.processors[i]
        processors.push({
          foreach: {
            field: ep.referenceField,
            ignore_missing: true,
            processor: {
              enrich: {
                policy_name: ep.enrichPolicyName,
                ignore_missing: true,
                field: ep.field,
                target_field: ep.targetField,
                max_matches: ep.maxMatches
              }
            }
          }
        })
      }

      await client.ingest.putPipeline({
        id: topResources[esResourceName].pipeline.id,
        body: {
          processors
        }
      })
    } else {
      await client.ingest.putPipeline({
        id: topResources[esResourceName].pipeline.id,
        body: {
          processors: [{
            enrich: {
              policy_name: topResources[esResourceName].enrich.policyName,
              field: topResources[esResourceName].pipeline.field,
              target_field: topResources[esResourceName].pipeline.targetField,
              max_matches: topResources[esResourceName].pipeline.maxMatches
            }
          }]
        }
      })
    }
  }
}

/**
 * import test data
 * @return {Promise<void>}
 */
async function main () {
  let keys = Object.keys(models)

  // Sort the models in the order of insertion (for correct enrichment)
  const temp = Array(keys.length).fill(null)
  keys.forEach(k => {
    if (models[k].tableName) {
      const esResourceName = modelToESIndexMapping[k]
      const index = RESOURCES_IN_ORDER.indexOf(esResourceName)
      temp[index] = k
    }
  })
  keys = _.compact(temp)

  await cleanupES(keys)

  for (let i = 0; i < keys.length; i++) {
    const key = keys[i]
    try {
      const data = await models.DBHelper.find(models[key], [])

      for (let i = 0; i < data.length; i++) {
        logger.info(`Inserting data ${i + 1} of ${data.length}`)
        await insertIntoES(key, data[i])
      }
      logger.info('import data for ' + key + ' done')
    } catch (e) {
      logger.error(e)
      logger.warn('import data for ' + key + ' failed')
      continue
    }

    try {
      await createAndExecuteEnrichPolicy(key)
      logger.info('create and execute enrich policy for ' + key + ' done')
    } catch (e) {
      logger.error(e)
      logger.warn('create and execute enrich policy for ' + key + ' failed')
    }

    try {
      await createEnrichProcessor(key)
      logger.info('create enrich processor (pipeline) for ' + key + ' done')
    } catch (e) {
      logger.error(e)
      logger.warn('create enrich processor (pipeline) for ' + key + ' failed')
    }
  }
  logger.info('all done')
  process.exit(0)
}

(async () => {
  main().catch(err => console.error(err))
})()
