const { DataTypes } = require('sequelize')

module.exports = {
  up: async (query) => {
    await query.removeConstraint('UsersSkills', 'UsersSkills_skillId_fkey')
    await query.removeConstraint('OrganizationSkillsProviders', 'OrganizationSkillsProviders_skillProviderId_fkey')
    await query.dropTable('Skills')
    await query.dropTable('SkillsProviders')
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
    await query.addColumn('Skills', 'skillProviderId', {
      type: DataTypes.UUID,
      references: {
        model: 'SkillsProviders',
        key: 'id'
      },
      onUpdate: 'CASCADE'
    })
    await query.addConstraint('OrganizationSkillsProviders', {
      fields: ['skillProviderId'],
      type: 'foreign key',
      name: 'OrganizationSkillsProviders_skillProviderId_fkey',
      references: {
        table: 'SkillsProviders',
        field: 'id'
      },
      onUpdate: 'CASCADE'
    })
    await query.addConstraint('UsersSkills', {
      fields: ['skillId'],
      type: 'foreign key',
      name: 'UsersSkills_skillId_fkey',
      references: {
        table: 'Skills',
        field: 'id'
      },
      onUpdate: 'CASCADE'
    })
  }
}
