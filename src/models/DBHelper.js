const { readerToJson, writeValueAsIon } = require('../common/helper')

const QLDB = require('amazon-qldb-driver-nodejs')
const config = require('config')
const _ = require('lodash')
const logger = require('../common/logger')
const uuid = require('uuid')
const errors = require('../common/errors')

/**
 * the database instance
 */
const qldbInstance = new QLDB.PooledQldbDriver(config.DATABASE, {
  accessKeyId: config.AWS_ACCESS_KEY_ID,
  secretAccessKey: config.AWS_SECRET_ACCESS_KEY,
  region: config.AWS_REGION
})

/**
 * Database helper
 */
class DBHelper {
  /**
   * get db connection session
   * @returns {Promise}
   */
  static async getSession () {
    return qldbInstance.getSession()
  }

  /**
   * get model by id
   * @param Model the model
   * @param id the id
   * @param attributes the attributes
   * @returns {Promise<{}>}
   */
  static async get (Model, id, attributes) {
    const session = await this.getSession()
    try {
      const tn = Model.tableName
      const sql = `SELECT ${_.isNil(attributes) || _.isEmpty(attributes) ? '*' : attributes.join(',')} FROM ${tn} WHERE id = '${id}'`
      const result = await session.executeStatement(sql, [])
      if (result.getResultList().length <= 0) {
        throw errors.newEntityNotFoundError(`cannot find ${tn} where id = ${id}`)
      }
      return new Model().from(readerToJson(result.getResultList()[0]))
    } finally {
      session.close()
    }
  }

  /**
   * delete item by id
   * @param model the model
   * @param id the id
   * @param queries the db queries
   * @returns {Promise<void>}
   */
  static async delete (model, id, queries = []) {
    const session = await this.getSession()
    try {
      const tn = model.tableName
      if (id) {
        queries.push(`id = '${id}'`)
      }
      if (queries.length <= 0) {
        throw errors.newBadRequestError('delete rows without queries is not allowed')
      }
      const sql = `DELETE FROM ${tn} where ${queries.join(' AND ')}`
      logger.debug(sql)
      await session.executeStatement(sql, [])
    } finally {
      session.close()
    }
  }

  /**
   * find items by queries
   * @param Model the model
   * @param queries the sql queries
   * @returns {Promise<{}[]>}
   */
  static async find (Model, queries) {
    const session = await this.getSession()
    try {
      const tn = Model.tableName
      let sql = `SELECT * FROM ${tn}`
      if (queries.length > 0 && queries[0].toLowerCase().indexOf('select') === 0) {
        sql = queries.shift()
      }
      const where = queries.length <= 0 ? '' : ('WHERE ' + queries.join(' AND '))
      sql = `${sql} ${where}`
      logger.debug(sql)
      const results = await session.executeStatement(sql, [])
      return results.getResultList().map(r => new Model().from(readerToJson(r)))
    } finally {
      session.close()
    }
  }

  /**
   * save/insert item to database
   * @param model the model
   * @param entity the entity
   * @param create is create
   * @returns {Promise<void>}
   */
  static async save (model, entity, create) {
    const session = await this.getSession()
    try {
      const tn = model.tableName
      const documentsWriter = QLDB.createQldbWriter()
      if (entity.id && !create) {
        const statement = `UPDATE ${tn} AS p SET p = ? WHERE p.id = '${entity.id}'`
        writeValueAsIon(entity.toJSON(), documentsWriter)
        await session.executeStatement(statement, [documentsWriter])
      } else {
        entity.id = entity.id || uuid.v4()
        const statement = `INSERT INTO ${tn} ?`
        writeValueAsIon(entity.toJSON(), documentsWriter)
        await session.executeStatement(statement, [documentsWriter])
      }
    } finally {
      session.close()
    }
    return entity
  }

  /**
   * create table if not exist
   * @param model the model
   * @returns {Promise<void>}
   */
  static async createTable (model) {
    const session = await this.getSession()
    try {
      const tables = await session.getTableNames()
      const tn = model.tableName
      if (!_.includes(tables, tn)) {
        await session.executeStatement(`create table ${tn}`, [])
        logger.info(`table ${tn} created ...`)
        const additional = [`create index on ${tn} (id)`].concat(model.additionalSql || [])
        for (let i = 0; i < additional.length; i++) {
          logger.debug(additional[i])
          await session.executeStatement(additional[i])
        }
      } else {
        logger.info('exists, skip create table ' + tn)
      }
    } finally {
      session.close()
    }
  }

  /**
   * clear table
   * @param model the model
   * @returns {Promise<void>}
   */
  static async clear (model) {
    const session = await qldbInstance.getSession()
    try {
      const transaction = await session.startTransaction()
      await transaction.executeInline('DELETE FROM ' + model.tableName, [])
      await transaction.commit()
      logger.info(`${model.tableName} clean`)
    } finally {
      session.close()
    }
  }

  /**
   * drop table
   * @param model the model
   * @returns {Promise<void>}
   */
  static async drop (model) {
    const session = await qldbInstance.getSession()
    try {
      const transaction = await session.startTransaction()
      await transaction.executeInline('drop table ' + model.tableName, [])
      await transaction.commit()
      logger.info(`table ${model.tableName} dropped`)
    } finally {
      session.close()
    }
  }
}

module.exports = DBHelper
