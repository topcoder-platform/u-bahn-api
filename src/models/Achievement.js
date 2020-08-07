const { RecordObject } = require('./BaseObject')

/**
 * Achievement model
 */
class Achievement extends RecordObject {
  constructor () {
    super()
    this.achievementsProviderId = null
    this.name = null
    this.uri = null
    this.certifierId = null
    this.certifiedDate = null
    this.userId = null
  }
}

Achievement.tableName = 'Achievement'
module.exports = Achievement
