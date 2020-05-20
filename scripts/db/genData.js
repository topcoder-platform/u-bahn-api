const models = require('../../src/models')
const logger = require('../../src/common/logger')

/**
 * import test data
 * @return {Promise<void>}
 */
async function main () {
  await models.init()
  const keys = Object.keys(models)
  for (let i = 0; i < keys.length; i++) {
    const key = keys[i]
    if (models[key].tableName) {
      try {
        const data = require(`./data/${key}.json`)
        await models.DBHelper.clear(models[key])
        for (let i = 0; i < data.length; i++) {
          await models.DBHelper.save(models[key], new models[key]().from(data[i]), true)
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
