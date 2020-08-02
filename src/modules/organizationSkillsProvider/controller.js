/**
 * the organization skills provider controller
 */

const service = require('./service')
const _ = require('lodash')
const { injectSearchMeta } = require('../../common/helper')

/**
 * create entity by request data
 * @param req the http request
 * @param res the http response
 */
async function create (req, res) {
  res.json(await service.create(_.extend(req.body, req.params), req.auth))
}

/**
 * get entity by id
 * @param req the http request
 * @param res the http response
 */
async function get (req, res) {
  res.json(await service.get(req.params.organizationId, req.params.skillProviderId, req.auth))
}

/**
 * search entities by request query
 * @param req the http request
 * @param res the http response
 */
async function search (req, res) {
  const result = await service.search(_.extend(req.query, req.params), req.auth)
  injectSearchMeta(req, res, result)
  res.send(result.result)
}

/**
 * remove entity by id
 * @param req the http request
 * @param res the http response
 */
async function remove (req, res) {
  await service.remove(req.params.organizationId, req.params.skillProviderId, req.auth)
  res.status(204).end()
}

module.exports = {
  create,
  search,
  remove,
  get
}
