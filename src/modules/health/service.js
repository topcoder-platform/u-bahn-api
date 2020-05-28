const errors = require('../../common/errors')
const models = require('../../models')

async function get () {
  // Check QLDB Connection by retrieving a session
  try {
    const session = await models.DBHelper.getSession()

    session.close()
  } catch (e) {
    throw errors.serviceUnavailableError(`QLDB is unavailable, ${e.message}`)
  }

  return { checksRun: 1 }
}

module.exports = { get }
