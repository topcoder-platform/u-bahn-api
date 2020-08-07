/**
 * the achievement provider controller
 */

const service = require('./service')
const helper = require('../../common/helper')
const methods = helper.getControllerMethods(service)

module.exports = {
  ...methods
}
