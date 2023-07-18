/**
 * This service provides operations to clean up the environment for running automated tests.
 */

const logger = require('../../common/logger')
const config = require('config')
const serviceHelper = require('../../common/service-helper')

const sequelize = require('../../models/index')
const { Op } = require('sequelize')
const models = sequelize.models
const UsersSkill = models.UsersSkill
const UsersRole = models.UsersRole
const UserAttribute = models.UserAttribute
const Skill = models.Skill
const Role = models.Role
const OrganizationSkillsProvider = models.OrganizationSkillsProvider
const SkillsProvider = models.SkillsProvider
const ExternalProfile = models.ExternalProfile
const Attribute = models.Attribute
const AttributeGroup = models.AttributeGroup
const Organization = models.Organization
const Achievement = models.Achievement
const AchievementsProvider = models.AchievementsProvider
const User = models.User
const searchTerm = { [Op.like]: config.AUTOMATED_TESTING_NAME_PREFIX + '%' }

logger.info('Clear the Postman test data.')

/**
 * Delete the Resource from the ES by the given id
 * @param id the resource id
 * @returns {Promise<void>}
 */
const deleteFromESById = async (id, resource) => {
  await serviceHelper.deleteRecordFromEs(id, undefined, resource)
}

/**
 * Delete the records from the table and ES which matches the filter.
 * @param model the model
 * @param modelName the name of the model
 * @param field the field name
 * @param t the transaction
 * @returns {Promise<void>}
 */
const deleteFromTable = async (model, modelName, field, t) => {
  const filter = {}
  filter[field] = searchTerm
  const records = await model.findAll({
    where: filter
  })
  for (const r of records) {
    const id = r.id
    logger.info(`Delete ${modelName} with ID ${id} from DB and ES`)
    await model.destroy({ where: { id: id } }, { transaction: t })
    await deleteFromESById(id, serviceHelper.getResource(modelName))
  }
}

/**
 * Delete the record from the table and ES by the given field.
 * @param model the model
 * @param modelName the model name
 * @param fieldName the field name
 * @param fieldValue the field value
 * @param t the transaction
 * @returns {Promise<void>}
 */
const deleteByField = async (model, modelName, fieldName, fieldValue, t) => {
  const filter = {}
  filter[fieldName] = { [Op.eq]: fieldValue }
  const records = await model.findAll({
    where: filter
  })
  for (const r of records) {
    const id = r.id
    logger.info(`Delete ${modelName} with ID ${id} from DB and ES`)
    await model.destroy({ where: { id: id } }, { transaction: t })
    await deleteFromESById(id, serviceHelper.getResource(modelName))
  }
}

/**
 * Clear the postman test data. The main function of this class.
 * @returns {Promise<void>}
 */
const cleanUpTestData = async () => {
  logger.info('clear the test data from postman test!')
  await sequelize.transaction(async (t) => {
    // check User and its related records
    let records = await User.findAll({ where: { handle: searchTerm } })
    for (const r of records) {
      const userId = r.id
      await deleteByField(UsersSkill, 'UsersSkill', 'userId', userId, t)
      await deleteByField(UsersRole, 'UsersRole', 'userId', userId, t)
      await deleteByField(UserAttribute, 'UserAttribute', 'userId', userId, t)
      await deleteByField(Achievement, 'Achievement', 'userId', userId, t)
      await deleteByField(ExternalProfile, 'ExternalProfile', 'userId', userId, t)
      await deleteByField(User, 'User', 'id', userId, t)
    }
    // delete all from AchievementsProvider
    await deleteFromTable(AchievementsProvider, 'AchievementsProvider', 'name', t)
    // delete all from Attribute
    await deleteFromTable(Attribute, 'Attribute', 'name', t)
    // delete all from AttributeGroup
    await deleteFromTable(AttributeGroup, 'AttributeGroup', 'name', t)
    // check SkillsProvider and its related records
    records = await SkillsProvider.findAll({ where: { name: searchTerm } })
    for (const r of records) {
      const skillProviderId = r.id
      await deleteByField(OrganizationSkillsProvider, 'OrganizationSkillsProvider', 'skillProviderId', skillProviderId, t)
      await deleteByField(Skill, 'Skill', 'skillProviderId', skillProviderId, t)
      await deleteByField(SkillsProvider, 'SkillsProvider', 'id', skillProviderId, t)
    }
    // delete all from Organization
    await deleteFromTable(Organization, 'Organization', 'name', t)
    // delete all from Role
    await deleteFromTable(Role, 'Role', 'name', t)
  })
}

module.exports = {
  cleanUpTestData
}

logger.buildService(module.exports)
