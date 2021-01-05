const { DataTypes } = require('sequelize')

module.exports = (sequelize) => {
  const SkillsProvider = sequelize.define('SkillsProvider', {
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
  SkillsProvider.associate = (models) => {
    SkillsProvider.hasMany(models.Skill, { foreignKey: 'skillProviderId', type: DataTypes.UUID })
    SkillsProvider.hasMany(models.OrganizationSkillsProvider, { foreignKey: 'skillProviderId', type: DataTypes.UUID })
  }
  return SkillsProvider
}
