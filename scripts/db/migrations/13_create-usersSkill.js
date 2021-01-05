const { DataTypes } = require('sequelize')

module.exports = {
  up: async (query) => {
    await query.createTable('UsersSkills', {
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
      metricValue: {
        type: DataTypes.STRING
      },
      certifierId: {
        type: DataTypes.STRING
      },
      certifiedDate: {
        type: DataTypes.DATE
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
    await query.dropTable('UsersSkills')
  }
}
