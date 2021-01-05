/**
 * Organization model
 */
const { DataTypes } = require('sequelize')

module.exports = {
  up: async (query) => {
    await query.createTable('Organizations', {
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
      created: {
        type: DataTypes.DATE,
        allowNull: false
      },
      updated: {
        type: DataTypes.DATE
      }
    })
  },
  down: async (query) => {
    await query.dropTable('Organizations')
  }
}
