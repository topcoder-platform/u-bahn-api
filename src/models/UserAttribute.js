const { RecordObject } = require('./BaseObject')

/**
 * UsersAttribute skill model
 */
class UsersAttribute extends RecordObject {
  constructor () {
    super()
    this.attributeId = null
    this.value = null
    this.userId = null
  }
}

UsersAttribute.tableName = 'UsersAttribute'
module.exports = UsersAttribute
