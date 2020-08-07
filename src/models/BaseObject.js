const _ = require('lodash')

/**
 * Base object
 */
class BaseObject {
  constructor () {
    this.id = null
  }

  /**
   * to json object
   * @returns {*}
   */
  toJSON () {
    return _.omit(this)
  }

  /**
   * set value from obj
   * @param obj the object value
   */
  from (obj) {
    const keys = _.keys(this)
    _.each(keys, key => {
      this[key] = obj[key]
    })
    return this
  }
}

/**
 * base object with created and updated etc .
 */
class RecordObject extends BaseObject {
  constructor () {
    super()
    this.created = null
    this.updated = null
    this.createdBy = null
    this.updatedBy = null
  }
}

module.exports = {
  BaseObject,
  RecordObject
}
