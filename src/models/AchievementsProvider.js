/**
 * AchievementsProvider model
 */
const { DataTypes } = require('sequelize')

module.exports = (sequelize) => {
  const AchievementsProvider = sequelize.define('AchievementsProvider', {
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
  AchievementsProvider.associate = (models) => {
    AchievementsProvider.hasMany(models.Achievement, { foreignKey: 'achievementsProviderId', type: DataTypes.UUID })
  }
  return AchievementsProvider
}
