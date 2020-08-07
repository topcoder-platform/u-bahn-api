const { RecordObject } = require('./BaseObject')

/**
 * Role model
 */
class Role extends RecordObject {
  constructor () {
    super()
    this.name = null
  }
}

Role.tableName = 'Role'
Role.additionalSql = [
  'CREATE INDEX ON Role (name)'
]
module.exports = Role
