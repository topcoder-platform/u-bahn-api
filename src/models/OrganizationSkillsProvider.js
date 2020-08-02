const { RecordObject } = require('./BaseObject')

/**
 * OrganizationSkillsProvider model
 */
class OrganizationSkillsProvider extends RecordObject {
  constructor () {
    super()
    this.organizationId = null
    this.skillProviderId = null
  }
}

OrganizationSkillsProvider.tableName = 'OrganizationSkillsProvider'

module.exports = OrganizationSkillsProvider
