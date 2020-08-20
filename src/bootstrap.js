/**
 * add logger and joi to services
 */

const config = require('config')
const fs = require('fs')
const path = require('path')
const logger = require('./common/logger')
const joi = require('joi')

joi.id = () => joi.number().integer().min(1)
joi.pageSize = () => joi.number().integer().min(1).max(config.get('MAX_PAGE_SIZE'))

/**
 * add logger and joi schema to service
 * @param dir
 */
function buildServices (dir) {
  const files = fs.readdirSync(dir)
  files.forEach((file) => {
    const curPath = path.join(dir, file)
    const stats = fs.statSync(curPath)
    if (stats.isDirectory()) {
      buildServices(curPath)
    } else if (file.toLowerCase().indexOf('service.js') >= 0) {
      let serviceName = curPath.split('modules')[1]
      serviceName = serviceName.substr(1, serviceName.length - 4)
      logger.info(`add decorators for service --> ${serviceName}`)
      logger.buildService(serviceName, require(curPath)); // eslint-disable-line
    }
  })
}

buildServices(path.join(__dirname, 'modules'))
