/**
 * Defines the API routes
 */

const _ = require('lodash')
const path = require('path')
const fs = require('fs')

/**
 * scan folder to find routes
 * @param dir the scan base dir
 */
function searchRoutes (dir) {
  const files = fs.readdirSync(dir)
  let routes = {}
  for (let i = 0; i < files.length; i += 1) {
    const file = files[i]
    const curPath = path.join(dir, file)
    const stats = fs.statSync(curPath)
    if (stats.isDirectory()) {
      routes = _.extend({}, routes, searchRoutes(curPath))
    } else if (file.toLowerCase().indexOf('route.js') >= 0) {
      routes = _.extend({}, routes, require(curPath)); // eslint-disable-line
    }
  }
  return routes
}

module.exports = searchRoutes(path.join(__dirname, '.'))
