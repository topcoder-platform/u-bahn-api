// TODO - Update BEFORE merge

const _ = require('lodash')
const pgtools = require('pgtools')
const config = require('config')
const errors = require('../common/errors')
const logger = require('../common/logger')
const appConst = require('../consts')
const helper = require('../common/helper')

/**
 * create db
 * @returns {Promise<void>}
 */
async function createDb () {
  const dbConfig = {
    user: config.DB_USERNAME,
    password: config.DB_PASSWORD,
    port: config.DB_PORT,
    host: config.DB_HOST
  }

  pgtools.createdb(dbConfig, config.DB_NAME, (err, res) => {
    if (err) {
      if (err.name === 'duplicate_database') {
        logger.info(`db ${config.DB_NAME} already exists`)
      } else {
        throw err
      }
    } else {
      logger.info(`Created db ${config.DB_NAME} successfully`)
    }
  })
}

/**
 * search objects
 * @param model the sequelize model object
 * @param query search query
 * @param auth the user auth object
 * @param inlcude what models to include
 * @returns {Promise<void>}
 */
async function find (model, query, auth = null, include = null) {
  // for non-admin users, this endpoint will only return entities that the user has created.
  if (
    auth &&
    auth.roles &&
    !helper.checkIfExists(auth.roles, appConst.AdminUser) &&
    !helper.checkIfExists(auth.roles, [appConst.UserRoles.ubahn])
  ) {
    query.createdBy = helper.getAuthUser(auth)
  }

  // set pagination params
  const options = {}
  if (!query.perPage) {
    query.perPage = config.PER_PAGE
  }
  if (query.page) {
    options.offset = (query.page - 1) * query.perPage
  }
  options.limit = query.perPage
  delete query.perPage
  delete query.page

  // set filter params
  options.where = query

  // set model inlcudes
  if (include) {
    options.include = include
  }

  // execute query
  return model.findAll(options)
}

/**
 * get object by pk
 * @param model the sequelize model object
 * @param pk object pk (primary key)
 * @param params the path params (use if id is null)
 * @returns {Promise<void>}
 */
async function get (model, pk, params) {
  let instance
  if (pk) {
    instance = await model.findByPk(pk)
  }
  if (params) {
    const instances = await model.findAll({ where: params })
    if (instances.length === 0) {
      throw errors.newEntityNotFoundError(`cannot find ${model.name} where ${_.map(params, (v, k) => `${k}:${v}`).join(', ')}`)
    }
    return instances[0]
  }

  if (!instance) {
    throw errors.newEntityNotFoundError(`cannot find ${model.name} where id = ${pk}`)
  }
  return instance
}

/**
 * create object
 * @param model the sequelize model object
 * @param entity entity to create
 * @param auth the user auth object
 * @returns {Promise<void>}
 */
async function create (model, entity, auth) {
  if (auth) {
    entity.createdBy = helper.getAuthUser(auth)
  }
  return model.create(entity)
}

/**
 * delete object by pk
 * @param model the sequelize model object
 * @param pk the primary key
 * @returns {Promise<void>}
 */
async function remove (model, pk, params) {
  const instance = await get(model, pk, params)
  return instance.destroy()
}

/**
 * update object by pk
 * @param model the sequelize model object
 * @param pk the primary key
 * @param entity entity to create
 * @param auth the auth object
 * @param auth the path params
 * @returns {Promise<void>}
 */
async function update (model, pk, entity, auth, params) {
  // insure that object exists
  const instance = await get(model, pk, params)
  entity.updatedBy = helper.getAuthUser(auth)
  return instance.update(entity)
}

/**
 * make sure unique
 * @param model the db model
 * @param entity the entity
 * @param uniqueFields the uniqueFields
 * @param pathParams the path params
 */
async function makeSureUnique (model, entity, uniqueFields, pathParams = {}) {
  if (_.isNil(uniqueFields) || _.isEmpty(uniqueFields)) {
    return
  }
  for (let i = 0; i < uniqueFields.length; i++) {
    const params = {}
    _.each(uniqueFields[i], f => {
      if (entity[f] && entity[f] !== pathParams[f]) {
        params[f] = entity[f]
      }
    })
    if (Object.keys(params).length === 0) {
      return
    }

    const items = await find(model, params)
    if (items.length <= 0) {
      continue
    }

    if ((items.length > 0 && !entity.id) ||
      (items[0].id !== entity.id)
    ) {
      throw errors.newConflictError(`${model.name} already exists with ${_.map(params, (v, k) => `${k}:${v}`).join(', ')}`)
    }
  }
}

module.exports = {
  createDb,
  find,
  create,
  update,
  get,
  remove,
  makeSureUnique
}
