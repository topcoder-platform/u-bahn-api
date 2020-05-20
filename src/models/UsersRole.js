const { RecordObject } = require('./BaseObject')

/**
 * UserRole model
 */
class UsersRole extends RecordObject {
  constructor () {
    super()
    this.userId = null
    this.roleId = null
  }
}

UsersRole.tableName = 'UserRole'

module.exports = UsersRole
