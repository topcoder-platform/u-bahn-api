const { DataTypes } = require('sequelize')

module.exports = (sequelize) => {
  const Skill = sequelize.define('Skill', {
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
    externalId: {
      type: DataTypes.STRING
    },
    uri: {
      type: DataTypes.STRING
    }
  },
  {
    timestamps: true,
    updatedAt: 'updated',
    createdAt: 'created'
  })
  Skill.associate = (models) => {
    Skill.belongsTo(models.SkillsProvider, { foreignKey: 'skillProviderId', type: DataTypes.UUID })
    Skill.hasMany(models.UsersSkill, { foreignKey: 'skillId', type: DataTypes.UUID })
  }
  return Skill
}
