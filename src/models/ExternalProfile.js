/**
 * ExternalProfile model
 */
const { DataTypes } = require('sequelize')

module.exports = (sequelize) => {
  return sequelize.define('ExternalProfile', {
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
    externalId: {
      type: DataTypes.STRING
    },
    uri: {
      type: DataTypes.STRING
    },
    isInactive: {
      type: DataTypes.BOOLEAN
    }
  },
  {
    timestamps: true,
    updatedAt: 'updated',
    createdAt: 'created'
  })
}
