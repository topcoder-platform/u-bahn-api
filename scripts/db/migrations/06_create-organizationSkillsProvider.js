/**
 * OrganizationSkillsProvider model
 */
const { DataTypes } = require('sequelize')

module.exports = {
  up: async (query) => {
    await query.createTable('OrganizationSkillsProviders', {
      id: {
        primaryKey: true,
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4
      },
      skillProviderId: {
        type: DataTypes.UUID
      },
      createdBy: {
        type: DataTypes.STRING
      },
      updatedBy: {
        type: DataTypes.STRING
      },
      created: {
        type: DataTypes.DATE,
        allowNull: false
      },
      updated: {
        type: DataTypes.DATE
      }
    })
  },
  down: async (query) => {
    await query.dropTable('OrganizationSkillsProviders')
  }
}
