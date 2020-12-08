const { DataTypes } = require('sequelize')

module.exports = (sequelize) => {
  return sequelize.define('Skill', {
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
    externalId: {
      type: DataTypes.STRING
    },
    uri: {
      type: DataTypes.STRING
    }
  },
  {
    timestamps: true,
    updatedAt: 'updated',
    createdAt: 'created'
  })
}
