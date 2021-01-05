const errors = require('../../common/errors')
const sequelize = require('../../models/index')

async function get () {
  // Check DB Connection by authenticating
  try {
    await sequelize.authenticate()
  } catch (e) {
    throw errors.serviceUnavailableError(`DB is unavailable, ${e.message}`)
  }

  return { checksRun: 1 }
}

module.exports = { get }
