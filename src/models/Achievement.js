/**
 * Achievement model
 */
const { DataTypes } = require('sequelize')

module.exports = (sequelize) => {
  return sequelize.define('Achievement', {
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
    uri: {
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
}
