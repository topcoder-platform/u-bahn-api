const {
  Decimal,
  IonTypes,
  Timestamp
} = require('ion-js')

const errors = require('./errors')
const appConst = require('../consts')
const _ = require('lodash')
const { getServiceMethods } = require('./service-helper')
const { getControllerMethods, getSubControllerMethods } = require('./controller-helper')

/**
 * convert json object to ion.js writer
 * @param value the json object
 * @param ionWriter the writer
 */
function writeValueAsIon (value, ionWriter) {
  switch (typeof value) {
    case 'string':
      ionWriter.writeString(value)
      break
    case 'boolean':
      ionWriter.writeBoolean(value)
      break
    case 'number':
      ionWriter.writeInt(value)
      break
    case 'object':
      if (Array.isArray(value)) {
        // Object is an array.
        ionWriter.stepIn(IonTypes.LIST)

        for (const element of value) {
          writeValueAsIon(element, ionWriter)
        }

        ionWriter.stepOut()
      } else if (value instanceof Date) {
        // Object is a Date.
        ionWriter.writeTimestamp(Timestamp.parse(value.toISOString()))
      } else if (value instanceof Decimal) {
        // Object is a Decimal.
        ionWriter.writeDecimal(value)
      } else if (value === null) {
        ionWriter.writeNull(IonTypes.NULL)
      } else {
        // Object is a struct.
        ionWriter.stepIn(IonTypes.STRUCT)

        for (const key of Object.keys(value)) {
          ionWriter.writeFieldName(key)
          writeValueAsIon(value[key], ionWriter)
        }
        ionWriter.stepOut()
      }
      break
    default:
      throw errors.newBadRequestError(`Cannot convert to Ion for type: ${(typeof value)}.`)
  }
}

/**
 * Reader to json object
 * @param reader the ion.js Reader
 * @returns {{}}
 */
function readerToJson (reader) {
  reader.next()
  reader.stepIn()

  const obj = {}

  const toRealValue = (r, result) => {
    let nextT = reader.next()

    const setValue = (key, value) => {
      if (key) {
        result[key] = value
      } else {
        result.push(value)
      }
      return value
    }

    while (nextT) {
      const name = r.fieldName()
      switch (nextT) {
        case IonTypes.STRING:
          setValue(name, r.stringValue())
          break
        case IonTypes.TIMESTAMP:
          setValue(name, r.timestampValue().getDate())
          break
        case IonTypes.NULL:
          setValue(name, null)
          break
        case IonTypes.INT:
          setValue(name, r.numberValue())
          break
        case IonTypes.LIST:
          r.stepIn()
          toRealValue(r, setValue(name, []))
          r.stepOut()
          break
      }
      nextT = reader.next()
    }
  }

  toRealValue(reader, obj)
  return obj
}

/**
 * get auth user handle or id
 * @param authUser the user
 */
function getAuthUser (authUser) {
  return authUser.handle || authUser.sub
}

/**
 * Checks if the source matches the term.
 *
 * @param {Array} source the array in which to search for the term
 * @param {Array | String} term the term to search
 */
function checkIfExists (source, term) {
  let terms

  if (!_.isArray(source)) {
    throw new Error('Source argument should be an array')
  }

  source = source.map(s => s.toLowerCase())

  if (_.isString(term)) {
    terms = term.split(' ')
  } else if (_.isArray(term)) {
    terms = term.map(t => t.toLowerCase())
  } else {
    throw new Error('Term argument should be either a string or an array')
  }

  for (let i = 0; i < terms.length; i++) {
    if (source.includes(terms[i])) {
      return true
    }
  }

  return false
}

/**
 * no paging in database, so only inject X-Total
 * @param res the response
 * @param meta the metadata
 */
function injectSearchMeta (res, meta) {
  res.header({ 'X-Total': meta.total })
}

/**
 * some user can only access devices that they created. admin role user can access all devices
 * @param auth the auth object
 * @param recordObj the record object
 */
function permissionCheck (auth, recordObj) {
  if (auth && auth.roles && !checkIfExists(auth.roles, [appConst.UserRoles.admin]) &&
    recordObj.createdBy !== getAuthUser(auth)) {
    throw errors.newPermissionError('You are not allowed to perform this action')
  }
}

module.exports = {
  writeValueAsIon,
  readerToJson,
  getAuthUser,
  permissionCheck,
  checkIfExists,
  injectSearchMeta,
  getControllerMethods,
  getSubControllerMethods,
  getServiceMethods
}
