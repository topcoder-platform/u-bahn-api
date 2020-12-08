const { DataTypes } = require('sequelize')

module.exports = {
  up: async (query) => {
    await query.addColumn('Skills', 'skillProviderId', {
      type: DataTypes.UUID,
      references: {
        model: 'SkillsProviders',
        key: 'id'
      },
      onUpdate: 'CASCADE',
      onDelete: 'SET NULL'
    })
    await query.addColumn('OrganizationSkillsProviders', 'skillProviderId', {
      type: DataTypes.UUID,
      references: {
        model: 'SkillsProviders',
        key: 'id'
      },
      onUpdate: 'CASCADE',
      onDelete: 'SET NULL'
    })
    await query.addColumn('UsersSkills', 'userId', {
      type: DataTypes.UUID,
      references: {
        model: 'Users',
        key: 'id'
      },
      onUpdate: 'CASCADE',
      onDelete: 'SET NULL'
    })
    await query.addColumn('Achievements', 'userId', {
      type: DataTypes.UUID,
      references: {
        model: 'Users',
        key: 'id'
      },
      onUpdate: 'CASCADE',
      onDelete: 'SET NULL'
    })
    await query.addColumn('UserAttributes', 'userId', {
      type: DataTypes.UUID,
      references: {
        model: 'Users',
        key: 'id'
      },
      onUpdate: 'CASCADE',
      onDelete: 'SET NULL'
    })
    await query.addColumn('ExternalProfiles', 'userId', {
      type: DataTypes.UUID,
      references: {
        model: 'Users',
        key: 'id'
      },
      onUpdate: 'CASCADE',
      onDelete: 'SET NULL'
    })
    await query.addColumn('UsersRoles', 'userId', {
      type: DataTypes.UUID,
      references: {
        model: 'Users',
        key: 'id'
      },
      onUpdate: 'CASCADE',
      onDelete: 'SET NULL'
    })
    await query.addColumn('ExternalProfiles', 'organizationId', {
      type: DataTypes.UUID,
      references: {
        model: 'Organizations',
        key: 'id'
      },
      onUpdate: 'CASCADE',
      onDelete: 'SET NULL'
    })
    await query.addColumn('AttributeGroups', 'organizationId', {
      type: DataTypes.UUID,
      references: {
        model: 'Organizations',
        key: 'id'
      },
      onUpdate: 'CASCADE',
      onDelete: 'SET NULL'
    })
    await query.addColumn('OrganizationSkillsProviders', 'organizationId', {
      type: DataTypes.UUID,
      references: {
        model: 'Organizations',
        key: 'id'
      },
      onUpdate: 'CASCADE',
      onDelete: 'SET NULL'
    })
    await query.addColumn('UsersSkills', 'skillId', {
      type: DataTypes.UUID,
      references: {
        model: 'Skills',
        key: 'id'
      },
      onUpdate: 'CASCADE',
      onDelete: 'SET NULL'
    })
    await query.addColumn('UsersRoles', 'roleId', {
      type: DataTypes.UUID,
      references: {
        model: 'Roles',
        key: 'id'
      },
      onUpdate: 'CASCADE',
      onDelete: 'SET NULL'
    })
    await query.addColumn('Achievements', 'achievementsProviderId', {
      type: DataTypes.UUID,
      references: {
        model: 'AchievementsProviders',
        key: 'id'
      },
      onUpdate: 'CASCADE',
      onDelete: 'SET NULL'
    })
    await query.addColumn('UserAttributes', 'attributeId', {
      type: DataTypes.UUID,
      references: {
        model: 'Attributes',
        key: 'id'
      },
      onUpdate: 'CASCADE',
      onDelete: 'SET NULL'
    })
    await query.addColumn('Attributes', 'attributeGroupId', {
      type: DataTypes.UUID,
      references: {
        model: 'AttributeGroups',
        key: 'id'
      },
      onUpdate: 'CASCADE',
      onDelete: 'SET NULL'
    })
  },
  down: async (query) => {
    await query.removeColumn('Skills', 'skillProviderId')
    await query.removeColumn('OrganizationSkillsProviders', 'skillProviderId')
    await query.removeColumn('UsersSkills', 'userId')
    await query.removeColumn('Achievements', 'userId')
    await query.removeColumn('UserAttributes', 'userId')
    await query.removeColumn('ExternalProfiles', 'userId')
    await query.removeColumn('UsersRoles', 'userId')
    await query.removeColumn('ExternalProfiles', 'organizationId')
    await query.removeColumn('AttributeGroups', 'organizationId')
    await query.removeColumn('OrganizationSkillsProviders', 'organizationId')
    await query.removeColumn('UsersSkills', 'skillId')
    await query.removeColumn('UsersRoles', 'roleId')
    await query.removeColumn('Achievements', 'achievementsProviderId')
    await query.removeColumn('UserAttributes', 'attributeId')
    await query.removeColumn('Attributes', 'attributeGroupId')
  }
}
