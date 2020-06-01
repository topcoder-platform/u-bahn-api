const _ = require('lodash')
const models = require('../../src/models')
const logger = require('../../src/common/logger')
const { getESClient } = require('../../src/common/es-client')
const { topResources, userResources, modelToESIndexMapping } = require('../constants')

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
  }
}

/**
 * import test data
 * @return {Promise<void>}
 */
async function main () {
  await models.init()

  let keys = Object.keys(models)
  keys = _.orderBy(keys, k => {
    const esResourceName = modelToESIndexMapping[k]

    // Create parent data first
    if (_.includes(_.keys(topResources), esResourceName)) {
      return -1
    }

    return 1
  })

  for (let i = 0; i < keys.length; i++) {
    const key = keys[i]
    if (models[key].tableName) {
      try {
        const data = require(`./data/${key}.json`)
        await models.DBHelper.clear(models[key])
        for (let i = 0; i < data.length; i++) {
          await models.DBHelper.save(models[key], new models[key]().from(data[i]), true)
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
