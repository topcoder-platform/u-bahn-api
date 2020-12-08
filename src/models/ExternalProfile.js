/**
 * ExternalProfile model
 */
const { DataTypes } = require('sequelize')

module.exports = (sequelize) => {
  const ExternalProfile = sequelize.define('ExternalProfile', {
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
    externalId: {
      type: DataTypes.STRING
    },
    uri: {
      type: DataTypes.STRING
    },
    isInactive: {
      type: DataTypes.BOOLEAN
    }
  },
  {
    timestamps: true,
    updatedAt: 'updated',
    createdAt: 'created'
  })
  ExternalProfile.associate = (models) => {
    ExternalProfile.belongsTo(models.User, { foreignKey: 'userId', type: DataTypes.UUID })
    ExternalProfile.belongsTo(models.Organization, { foreignKey: 'organizationId', type: DataTypes.UUID })
  }
  return ExternalProfile
}
