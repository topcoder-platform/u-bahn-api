const { RecordObject } = require('./BaseObject')

/**
 * SkillsProvider model
 */
class SkillsProvider extends RecordObject {
  constructor () {
    super()
    this.name = null
  }
}

SkillsProvider.tableName = 'SkillsProvider'
module.exports = SkillsProvider
