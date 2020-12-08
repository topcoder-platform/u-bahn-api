const dataKeys = ['User', 'Organization', 'AchievementsProvider', 'Achievement',
  'AttributeGroup', 'Attribute', 'ExternalProfile', 'SkillsProvider',
  'OrganizationSkillsProvider', 'Role', 'Skill', 'UserAttribute', 'UsersRole', 'UsersSkill']

module.exports = {
  up: async (query) => {
    for (const key of dataKeys) {
      await query.bulkInsert(`${key}s`, require(`../data/${key}.json`))
    }
  },
  down: async (query) => {
    for (const key of dataKeys) {
      await query.bulkDelete(`${key}s`, null, {})
    }
  }
}
