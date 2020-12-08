const { DataTypes } = require('sequelize')

module.exports = (sequelize) => {
  const UsersSkill = sequelize.define('UsersSkill', {
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
    metricValue: {
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
  UsersSkill.associate = (models) => {
    UsersSkill.belongsTo(models.User, { foreignKey: 'userId', type: DataTypes.UUID })
    UsersSkill.belongsTo(models.Skill, { foreignKey: 'skillId', type: DataTypes.UUID })
  }
  return UsersSkill
}
