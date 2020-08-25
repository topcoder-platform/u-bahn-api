/**
 * the model index
 */

const User = require('./User')
const Role = require('./Role')
const SkillsProvider = require('./SkillsProvider')
const Skill = require('./Skill')
const Organization = require('./Organization')
const UsersRole = require('./UsersRole')
const UsersSkill = require('./UsersSkill')
const ExternalProfile = require('./ExternalProfile')
const AchievementsProvider = require('./AchievementsProvider')
const Achievement = require('./Achievement')
const AttributeGroup = require('./AttributeGroup')
const Attribute = require('./Attribute')
const UserAttribute = require('./UserAttribute')
const OrganizationSkillsProvider = require('./OrganizationSkillsProvider')
const logger = require('../common/logger')
const consts = require('../consts')

const DBHelper = require('./DBHelper')

module.exports = {
  User,
  Role,
  SkillsProvider,
  Organization,
  Skill,
  UsersRole,
  UsersSkill,
  Achievement,
  ExternalProfile,
  AchievementsProvider,
  AttributeGroup,
  Attribute,
  UserAttribute,
  OrganizationSkillsProvider,
  consts,
  DBHelper
}
/**
 * create table
 */
module.exports.init = async () => {
  logger.info('connect to database, check/create tables ...')
  await DBHelper.createTable(User)
  await DBHelper.createTable(Role)
  await DBHelper.createTable(SkillsProvider)
  await DBHelper.createTable(Skill)
  await DBHelper.createTable(Organization)
  await DBHelper.createTable(UsersRole)
  await DBHelper.createTable(UsersSkill)
  await DBHelper.createTable(ExternalProfile)
  await DBHelper.createTable(AchievementsProvider)
  await DBHelper.createTable(Achievement)
  await DBHelper.createTable(AttributeGroup)
  await DBHelper.createTable(Attribute)
  await DBHelper.createTable(UserAttribute)
  await DBHelper.createTable(OrganizationSkillsProvider)

  // Debug code - to remove invalid entries from db
  let data = await DBHelper.find(ExternalProfile, [])
  logger.info(console.log(data, null, 4))
  data = await DBHelper.find(UserAttribute, [])
  logger.info(console.log(data, null, 4))
}
