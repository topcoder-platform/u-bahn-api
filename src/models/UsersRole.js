/**
 * UsersRole model
 */
const { DataTypes } = require('sequelize')

module.exports = (sequelize) => {
  const UsersRole = sequelize.define('UsersRole', {
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
  UsersRole.associate = (models) => {
    UsersRole.belongsTo(models.User, { foreignKey: 'userId', type: DataTypes.UUID })
    UsersRole.belongsTo(models.Role, { foreignKey: 'roleId', type: DataTypes.UUID })
  }
  return UsersRole
}
