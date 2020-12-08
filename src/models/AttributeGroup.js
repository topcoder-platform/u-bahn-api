/**
 * AttributeGroup model
 */
const { DataTypes } = require('sequelize')

module.exports = (sequelize) => {
  const AttributeGroup = sequelize.define('AttributeGroup', {
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
  AttributeGroup.associate = (models) => {
    AttributeGroup.belongsTo(models.Organization, { foreignKey: 'organizationId', type: DataTypes.UUID })
    AttributeGroup.hasMany(models.Attribute, { foreignKey: 'attributeGroupId', type: DataTypes.UUID })
  }
  return AttributeGroup
}
