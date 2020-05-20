const { RecordObject } = require('./BaseObject')

/**
 * Attribute model
 */
class Attribute extends RecordObject {
  constructor () {
    super()
    this.attributeGroupId = null
    this.name = null
  }
}

Attribute.tableName = 'Attribute'
Attribute.additionalSql = [
  'CREATE INDEX ON Attribute (name)'
]
module.exports = Attribute
