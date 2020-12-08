/**
 * the model index
 */
const { Sequelize } = require('sequelize')
const config = require('config')
const logger = require('../common/logger')
const dBHelper = require('../common/db-helper')

/**
 * the database instance
 */
const sequelize = new Sequelize(
  `postgresql://${config.DB_USERNAME}:${config.DB_PASSWORD}@${config.DB_HOST}:${config.DB_PORT}/${config.DB_NAME}`
)

const modelDefiners = [
  require('./Skill'),
  require('./SkillsProvider'),
  require('./UsersSkill'),
  require('./User'),
  require('./Organization'),
  require('./Achievement'),
  require('./AchievementsProvider'),
  require('./AttributeGroup'),
  require('./Attribute'),
  require('./UserAttribute'),
  require('./OrganizationSkillsProvider'),
  require('./ExternalProfile'),
  require('./Role'),
  require('./UsersRole')
]

// We define all models according to their files.
for (const modelDefiner of modelDefiners) {
  modelDefiner(sequelize)
}

// Add relationships
dBHelper.addRelationships(sequelize)

module.exports = sequelize

/**
 * create table
 */
module.exports.init = async () => {
  logger.info('connect to database, check/create tables ...')

  // create db
  await dBHelper.createDb()

  // authenticate db
  await sequelize.authenticate()
  logger.info(`Connected to db ${config.DB_NAME} successfully`)

  // sync db (create tables)
  await sequelize.sync()
  logger.info(`db ${config.DB_NAME} synced successfully`)
}
