/**
 * the health routes
 */

const Controller = require('./controller')
module.exports = {
  '/health': {
    get: {
      method: Controller.get
    }
  }
}
