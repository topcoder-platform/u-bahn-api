const { RecordObject } = require('./BaseObject')

/**
 * User model
 */
class User extends RecordObject {
  constructor () {
    super()
    this.handle = null
  }
}

/**
 * User is keywords in database, so use `DUser`
 * @type {string}
 */
User.tableName = 'DUser'
User.additionalSql = [
  'CREATE INDEX ON DUser (handle)'
]
module.exports = User
