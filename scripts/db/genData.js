// TODO - Update BEFORE merge

const _ = require('lodash')
const sequelize = require('../../src/models/index')
const logger = require('../../src/common/logger')
const { getESClient } = require('../../src/common/es-client')
const {
  topResources,
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
  let keys = Object.keys(sequelize.models)

  // Sort the models in the order of insertion (for correct enrichment)
  const temp = Array(keys.length).fill(null)
  keys.forEach(k => {
    if (sequelize.models[k].name) {
      const esResourceName = modelToESIndexMapping[k]
      const index = RESOURCES_IN_ORDER.indexOf(esResourceName)
      temp[index] = k
    }
  })
  keys = _.compact(temp)

  for (let i = 0; i < keys.length; i++) {
    const key = keys[i]
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
