/**
 * User model
 */
const { DataTypes } = require('sequelize')

module.exports = (sequelize) => {
  const User = sequelize.define('User', {
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
    handle: {
      type: DataTypes.STRING
    },
    firstName: {
      type: DataTypes.STRING
    },
    lastName: {
      type: DataTypes.STRING
    }
  },
  {
    timestamps: true,
    updatedAt: 'updated',
    createdAt: 'created'
  })
  User.associate = (models) => {
    User.hasMany(models.UsersSkill, { foreignKey: 'userId', type: DataTypes.UUID })
    User.hasMany(models.Achievement, { foreignKey: 'userId', type: DataTypes.UUID })
    User.hasMany(models.UsersAttribute, { foreignKey: 'userId', type: DataTypes.UUID })
    User.hasMany(models.ExternalProfile, { foreignKey: 'userId', type: DataTypes.UUID })
    User.hasMany(models.UsersRole, { foreignKey: 'userId', type: DataTypes.UUID })
  }
  return User
}
