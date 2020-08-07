const { RecordObject } = require('./BaseObject')

/**
 * ExternalProfile model
 */
class ExternalProfile extends RecordObject {
  constructor () {
    super()
    this.userId = null
    this.organizationId = null
    this.externalId = null
    this.uri = null
    this.isInactive = null
  }
}

ExternalProfile.tableName = 'ExternalProfile'

module.exports = ExternalProfile
