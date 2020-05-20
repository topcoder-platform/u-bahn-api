const { RecordObject } = require('./BaseObject')

/**
 * ExternalProfile model
 */
class ExternalProfile extends RecordObject {
  constructor () {
    super()
    this.userId = null
    this.organizationId = null
    this.uri = null
  }
}

ExternalProfile.tableName = 'ExternalProfile'

module.exports = ExternalProfile
