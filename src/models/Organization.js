/**
 * Organization model
 */
const { DataTypes } = require('sequelize')

module.exports = (sequelize) => {
  const Organization = sequelize.define('Organization', {
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
    },
    name: {
      type: DataTypes.STRING
    }
  },
  {
    timestamps: true,
    updatedAt: 'updated',
    createdAt: 'created'
  })
  Organization.associate = (models) => {
    Organization.hasMany(models.ExternalProfile, { foreignKey: 'organizationId', type: DataTypes.UUID })
    Organization.hasMany(models.AttributeGroup, { foreignKey: 'organizationId', type: DataTypes.UUID })
    Organization.hasMany(models.OrganizationSkillsProvider, { foreignKey: 'organizationId', type: DataTypes.UUID })
  }
  return Organization
}
