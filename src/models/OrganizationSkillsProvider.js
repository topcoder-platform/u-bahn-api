/**
 * OrganizationSkillsProvider model
 */
const { DataTypes } = require('sequelize')

module.exports = (sequelize) => {
  return sequelize.define('OrganizationSkillsProvider', {
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
}
