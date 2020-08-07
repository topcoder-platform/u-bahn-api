const { RecordObject } = require('./BaseObject')

/**
 * Skill model
 */
class Skill extends RecordObject {
  constructor () {
    super()
    this.skillProviderId = null
    this.name = null
    this.externalId = null
    this.uri = null
  }
}

Skill.tableName = 'Skill'
module.exports = Skill
