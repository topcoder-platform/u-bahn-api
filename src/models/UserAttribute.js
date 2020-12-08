/**
 * UsersAttribute skill model
 */
const { DataTypes } = require('sequelize')

module.exports = (sequelize) => {
  const UsersAttribute = sequelize.define('UsersAttribute', {
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
    value: {
      type: DataTypes.STRING
    }
  },
  {
    timestamps: true,
    updatedAt: 'updated',
    createdAt: 'created'
  })
  UsersAttribute.associate = (models) => {
    UsersAttribute.belongsTo(models.User, { foreignKey: 'userId', type: DataTypes.UUID })
    UsersAttribute.belongsTo(models.Attribute, { foreignKey: 'attributeId', type: DataTypes.UUID })
  }
  return UsersAttribute
}
