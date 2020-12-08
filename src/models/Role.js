/**
 * Role model
 */
const { DataTypes } = require('sequelize')

module.exports = (sequelize) => {
  const Role = sequelize.define('Role', {
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
  Role.associate = (models) => {
    Role.hasMany(models.UsersRole, { foreignKey: 'roleId', type: DataTypes.UUID })
  }
  return Role
}
