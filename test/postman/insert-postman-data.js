const sequelize = require('../../src/models/index')
const logger = require('../../src/common/logger')

const models = sequelize.models

const dataKeys = ['User', 'Organization', 'AchievementsProvider', 'Achievement',
  'AttributeGroup', 'Attribute', 'ExternalProfile', 'SkillsProvider',
  'OrganizationSkillsProvider', 'Role', 'Skill', 'UserAttribute', 'UsersRole', 'UsersSkill']

/**
 * import seed importData
 */
async function main () {
  for (const key of dataKeys) {
    try {
      const records = require(`./importData/${key}.json`)
      await models[key].bulkCreate(records)
      logger.info(`import data for ${key} done, record count: ${records.length}`)
    } catch (e) {
      logger.error(e)
      logger.warn(`import data for ${key} failed`)
      throw e
    }
  }
  logger.info('all done')
  process.exit(0)
}

(async () => {
  main().catch(err => console.error(err))
})()
