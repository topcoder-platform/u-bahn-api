/**
 * the model index
 */
const { Sequelize } = require('sequelize')
const config = require('config')
const fs = require('fs')
const path = require('path')
const logger = require('../common/logger')

/**
 * the database instance
 */
const sequelize = new Sequelize(
  `postgresql://${config.DB_USERNAME}:${config.DB_PASSWORD}@${config.DB_HOST}:${config.DB_PORT}/${config.DB_NAME}`
)

const db = {}

fs
  .readdirSync(__dirname)
  .filter(file => (file.indexOf('.') !== 0) && (file !== 'index.js'))
  .forEach((file) => {
    const model = require(path.join(__dirname, file))(sequelize)
    db[model.name] = model
  })

Object.keys(db).forEach((modelName) => {
  if ('associate' in db[modelName]) {
    db[modelName].associate(db)
  }
})

module.exports = sequelize

/**
 * create table
 */
module.exports.init = async () => {
  logger.info('connect to database, check/create tables ...')
  // authenticate db
  await sequelize.authenticate()
  logger.info(`Connected to db ${config.DB_NAME} successfully`)
}
