/**
 * The application entry point
 */

require('./src/bootstrap')
const config = require('config')
const express = require('express')
const cross = require('cors')
const bodyParser = require('body-parser')
const _ = require('lodash')
const http = require('http')
const swaggerUi = require('swagger-ui-express')
const jsyaml = require('js-yaml')
const fs = require('fs')
const path = require('path')
const logger = require('./src/common/logger')
const errorMiddleware = require('./src/common/error.middleware')
const routes = require('./src/route')
const authenticator = require('tc-core-library-js').middleware.jwtAuthenticator
const errors = require('./src/common/errors')
const app = express()
const httpServer = http.Server(app)
const { checkIfExists } = require('./src/common/helper')
const models = require('./src/models')

app.set('port', config.PORT)
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))
app.use(cross())
const apiRouter = express.Router({})

// load all routes
_.each(routes, (verbs, url) => {
  _.each(verbs, (def, verb) => {
    const actions = []

    const { method } = def
    if (!method) {
      throw new Error(`${verb.toUpperCase()} ${url} method is undefined`)
    }
    let access = []
    // Authentication and Authorization
    if (def.auth) {
      // default access roles
      access = def.access || []
      actions.push((req, res, next) => {
        authenticator(_.pick(config, ['AUTH_SECRET', 'VALID_ISSUERS']))(req, res, next)
      })
      actions.push((req, res, next) => {
        if (!req.authUser) {
          return next(errors.newAuthError('Action is not allowed for invalid token'))
        }
        req.auth = req.authUser
        if (req.authUser.roles) {
          // all access are allowed
          if (_.isEmpty(access)) {
            next()
          } else if (!checkIfExists(access, req.authUser.roles)) {
            res.forbidden = true
            next(errors.newPermissionError('You are not allowed to perform this action'))
          } else {
            next()
          }
        } else if (req.authUser.scopes) {
          if (_.isNil(def.scopes) || _.isEmpty(def.scopes)) {
            next()
          } else if (!checkIfExists(def.scopes, req.authUser.scopes)) {
            next(errors.newPermissionError('You are not allowed to perform this action!'))
          } else {
            next()
          }
        } else if ((_.isArray(def.access) && def.access.length > 0) || (_.isArray(def.scopes) && def.scopes.length > 0)) {
          next(errors.newAuthError('You are not authorized to perform this action'))
        } else {
          next()
        }
      })
    }

    actions.push(async (req, res, next) => {
      try {
        await method(req, res, next)
      } catch (e) {
        next(e)
      }
    })

    logger.info(`Endpoint discovered : [${access}] ${verb.toLocaleUpperCase()} /${config.API_VERSION}${url}`)
    apiRouter[verb](`/${config.API_VERSION}${url}`, actions)
  })
})
app.use('/', apiRouter)
const spec = fs.readFileSync(path.join(__dirname, 'docs/swagger.yaml'), 'utf8')
const swaggerDoc = jsyaml.safeLoad(spec)

app.use('/docs', swaggerUi.serve, swaggerUi.setup(swaggerDoc))

app.use(errorMiddleware())
app.use('*', (req, res) => {
  const pathKey = req.baseUrl.substring(config.API_VERSION.length + 1)
  const route = routes[pathKey]
  if (route) {
    res.status(405).json({ message: 'The requested method is not supported.' })
  } else {
    res.status(404).json({ message: 'The requested resource cannot found.' })
  }
});

(async () => {
  await models.init()
  httpServer.listen(app.get('port'), () => {
    logger.info(`Express server listening on port ${app.get('port')}`)
  })
})()
