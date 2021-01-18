/**
 * Achievement model
 */
const { DataTypes } = require('sequelize')

module.exports = (sequelize) => {
  const Achievement = sequelize.define('Achievement', {
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
    },
    uri: {
      type: DataTypes.STRING
    },
    certifierId: {
      type: DataTypes.STRING
    },
    certifiedDate: {
      type: DataTypes.DATE
    }
  },
  {
    timestamps: true,
    updatedAt: 'updated',
    createdAt: 'created'
  })
  Achievement.associate = (models) => {
    Achievement.belongsTo(models.User, { foreignKey: 'userId', type: DataTypes.UUID })
    Achievement.belongsTo(models.AchievementsProvider, { foreignKey: 'achievementsProviderId', type: DataTypes.UUID })
  }
  return Achievement
}
