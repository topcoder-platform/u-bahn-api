/**
 * the health routes
 */

const Controller = require('./controller')
module.exports = {
  '/ubahnapi/health': {
    get: {
      method: Controller.get
    }
  }
}
