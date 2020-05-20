/**
 * the users skill services
 */

const joi = require('@hapi/joi').extend(require('@hapi/joi-date'))
const models = require('../../models/index')
const helper = require('../../common/helper')
const methods = helper.getServiceMethods(
  models.UsersSkill,
  {
    userId: joi.string().required(),
    skillId: joi.string().required(),
    metricValue: joi.string().required(),
    certifierId: joi.string().required(),
    certifiedDate: joi.date().format('iso').required()
  },
  {
    userId: joi.string(),
    skillId: joi.string(),
    metricValue: joi.string(),
    certifierId: joi.string(),
    certifiedDate: joi.date()
  },
  {
    userId: joi.string().required(),
    skillName: joi.string()
  },
  async (query) => {
    const dbQueries = ['SELECT * FROM Skill, UsersSkill', `UsersSkill.userId = '${query.userId}'`, 'UsersSkill.skillId = Skill.id']
    if (query.skillName) {
      dbQueries.push(`Skill.name like '%${query.skillName}%'`)
    }
    return dbQueries
  }, [['userId', 'skillId']])

module.exports = {
  ...methods
}
