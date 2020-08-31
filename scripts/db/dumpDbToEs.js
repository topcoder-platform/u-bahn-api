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

async function cleanupES () {
  const client = getESClient()

  await client.indices.delete({
    index: '_all'
  })

  console.log('Existing indices have been deleted!')
}

async function insertIntoES (modelName, body) {
  const esResourceName = modelToESIndexMapping[modelName]

  if (!esResourceName) {
    logger.error(`Cannot insert data into model ${modelName}. No equivalent elasticsearch index found`)

    return
  }

  const client = getESClient()

  if (_.includes(_.keys(topResources), esResourceName)) {
    await client.create({
      index: topResources[esResourceName].index,
      type: topResources[esResourceName].type,
      id: body.id,
      body,
      refresh: 'true'
    })
  } else if (_.includes(_.keys(userResources), esResourceName)) {
    const userResource = userResources[esResourceName]

    const user = await client.getSource({
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
      await client.update({
        index: topResources.user.index,
        type: topResources.user.type,
        id: body.userId,
        body: { doc: user },
        refresh: 'true'
      })
    }
  } else if (_.includes(_.keys(organizationResources), esResourceName)) {
    const orgResource = organizationResources[esResourceName]

    const organization = await client.getSource({
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
      await client.update({
        index: topResources.organization.index,
        type: topResources.organization.type,
        id: body.organizationId,
        body: { doc: organization },
        refresh: 'true'
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
  keys = _.orderBy(keys, k => {
    const esResourceName = modelToESIndexMapping[k]

    // Create parent data first
    if (_.includes(_.keys(topResources), esResourceName)) {
      return -1
    }

    return 1
  })

  await cleanupES()

  for (let i = 0; i < keys.length; i++) {
    const key = keys[i]
    if (models[key].tableName) {
      try {
        const data = await models.DBHelper.find(models[key], [])
        for (let i = 0; i < data.length; i++) {
          await insertIntoES(key, data[i])
        }
        logger.info('import data for ' + key + ' done')
      } catch (e) {
        logger.error(e)
        logger.warn('import data for ' + key + ' failed')
      }
    }
  }
  logger.info('all done')
  process.exit(0)
}

(async () => {
  main().catch(err => console.error(err))
})()
