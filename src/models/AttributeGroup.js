const { RecordObject } = require('./BaseObject')

/**
 * AttributeGroup model
 */
class AttributeGroup extends RecordObject {
  constructor () {
    super()
    this.organizationId = null
    this.name = null
  }
}

AttributeGroup.tableName = 'AttributeGroup'
AttributeGroup.additionalSql = [
  'CREATE INDEX ON AttributeGroup (name)'
]
module.exports = AttributeGroup
