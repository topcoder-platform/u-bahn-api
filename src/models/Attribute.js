/**
 * Attribute model
 */
const { DataTypes } = require('sequelize')

module.exports = (sequelize) => {
  const Attribute = sequelize.define('Attribute', {
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
  Attribute.associate = (models) => {
    Attribute.hasMany(models.UsersAttribute, { foreignKey: 'attributeId', type: DataTypes.UUID })
    Attribute.belongsTo(models.AttributeGroup, { foreignKey: 'attributeGroupId', type: DataTypes.UUID })
  }
  return Attribute
}
