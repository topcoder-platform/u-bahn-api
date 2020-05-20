const { RecordObject } = require('./BaseObject')

/**
 * Organization model
 */
class Organization extends RecordObject {
  constructor () {
    super()
    this.name = null
  }
}

Organization.tableName = 'Organization'
Organization.additionalSql = [
  'CREATE INDEX ON Organization (name)'
]
module.exports = Organization
