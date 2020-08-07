const { RecordObject } = require('./BaseObject')

/**
 * users skill model
 */
class UsersSkill extends RecordObject {
  constructor () {
    super()
    this.skillId = null
    this.metricValue = null
    this.certifierId = null
    this.certifiedDate = null
    this.userId = null
  }
}

UsersSkill.tableName = 'UsersSkill'
module.exports = UsersSkill
