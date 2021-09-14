/**
 * Clear the postman test data. All data created by postman e2e tests will be cleared.
 */
const logger = require('../../src/common/logger')
const config = require('config')
const envHelper = require('./envHelper')

logger.info('Clear the Postman test data.')

/**
 * Clear the postman test data. The main function of this class.
 * @returns {Promise<void>}
 */
const clearTestData = async () => {
  await envHelper.postRequest(`${config.API_BASE_URL}/ubahn/internal/jobs/clean`)
}

clearTestData().then(() => {
  logger.info('Completed!')
  process.exit()
}).catch((e) => {
  logger.logFullError(e)
  process.exit(1)
})

module.exports = {
  clearTestData
}
