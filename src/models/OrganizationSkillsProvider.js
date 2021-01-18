/**
 * OrganizationSkillsProvider model
 */
const { DataTypes } = require('sequelize')

module.exports = (sequelize) => {
  const OrganizationSkillsProvider = sequelize.define('OrganizationSkillsProvider', {
    id: {
      primaryKey: true,
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4
    },
    createdBy: {
      type: DataTypes.STRING
    },
    updatedBy: {
      type: DataTypes.STRING
    }
  },
  {
    timestamps: true,
    updatedAt: 'updated',
    createdAt: 'created'
  })
  OrganizationSkillsProvider.associate = (models) => {
    OrganizationSkillsProvider.belongsTo(models.SkillsProvider, { foreignKey: 'skillProviderId', type: DataTypes.UUID })
    OrganizationSkillsProvider.belongsTo(models.Organization, { foreignKey: 'organizationId', type: DataTypes.UUID })
  }
  return OrganizationSkillsProvider
}
