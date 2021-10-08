const { DataTypes } = require('sequelize')

module.exports = {
  up: async (query) => {
    await query.removeColumn('UsersSkills', 'skillId')
    await query.removeColumn('OrganizationSkillsProviders', 'skillProviderId')
    await query.addColumn('OrganizationSkillsProviders', 'skillProviderId', {
      type: DataTypes.UUID
    })
    await query.addColumn('UsersSkills', 'skillId', {
      type: DataTypes.UUID
    })
    await query.dropTable('SkillsProviders')
    await query.dropTable('Skills')
  },
  down: async (query) => {
    await query.createTable('Skills', {
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
      },
      created: {
        type: DataTypes.DATE,
        allowNull: false
      },
      updated: {
        type: DataTypes.DATE
      }
    })
    await query.createTable('SkillsProviders', {
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
    await query.removeColumn('UsersSkills', 'skillId')
    await query.removeColumn('OrganizationSkillsProviders', 'skillProviderId')
    await query.addColumn('Skills', 'skillProviderId', {
      type: DataTypes.UUID,
      references: {
        model: 'SkillsProviders',
        key: 'id'
      },
      onUpdate: 'CASCADE'
    })
    await query.addColumn('OrganizationSkillsProviders', 'skillProviderId', {
      type: DataTypes.UUID,
      references: {
        model: 'SkillsProviders',
        key: 'id'
      },
      onUpdate: 'CASCADE'
    })
    await query.addColumn('UsersSkills', 'skillId', {
      type: DataTypes.UUID,
      references: {
        model: 'Skills',
        key: 'id'
      },
      onUpdate: 'CASCADE'
    })
  }
}
