/**
 * UserAttribute skill model
 */
const { DataTypes } = require('sequelize')

module.exports = (sequelize) => {
  const UserAttribute = sequelize.define('UserAttribute', {
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
  UserAttribute.associate = (models) => {
    UserAttribute.belongsTo(models.User, { foreignKey: 'userId', type: DataTypes.UUID })
    UserAttribute.belongsTo(models.Attribute, { foreignKey: 'attributeId', type: DataTypes.UUID })
  }
  return UserAttribute
}
