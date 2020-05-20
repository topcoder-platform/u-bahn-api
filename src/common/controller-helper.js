const _ = require('lodash')

/**
 * get common controller service
 * @param service the service
 * @return {{patch: patch, search: search, get: get, create: create, update: update, remove: remove}} the common controller methods
 */
function getControllerMethods (service) {
  const { injectSearchMeta } = require('./helper')

  /**
   * create entity by request data
   * @param req the http request
   * @param res the http response
   */
  async function create (req, res) {
    res.json(await service.create(req.body, req.auth))
  }

  /**
   * patch entity by id
   * @param req the http request
   * @param res the http response
   */
  async function patch (req, res) {
    res.json(await service.patch(req.params.id, req.body, req.auth))
  }

  /**
   * get entity by id
   * @param req the http request
   * @param res the http response
   */
  async function get (req, res) {
    res.json(await service.get(req.params.id, req.auth))
  }

  /**
   * search entities by request query
   * @param req the http request
   * @param res the http response
   */
  async function search (req, res) {
    const { items, meta } = await service.search(req.query, req.auth)
    injectSearchMeta(res, meta)
    res.json(items)
  }

  /**
   * remove entity by id
   * @param req the http request
   * @param res the http response
   */
  async function remove (req, res) {
    await service.remove(req.params.id, req.auth)
    res.status(204).end()
  }

  return {
    create,
    search,
    remove,
    get,
    patch
  }
}

/**
 * get sub controller common methods like usersSkill,usersRole
 * @param service
 * @return {{patch: patch, search: search, get: get, create: create, remove: remove}}
 */
function getSubControllerMethods (service) {
  const { injectSearchMeta } = require('./helper')

  /**
   * create entity by request data
   * @param req the http request
   * @param res the http response
   */
  async function create (req, res) {
    res.json(await service.create(_.extend(req.body, req.params), req.auth))
  }

  /**
   * patch entity by id
   * @param req the http request
   * @param res the http response
   */
  async function patch (req, res) {
    res.json(await service.patch(req.params.id, _.extend({}, _.omit(req.params, 'id'), req.body),
      req.auth, _.omit(req.params, 'id')))
  }

  /**
   * get entity by id
   * @param req the http request
   * @param res the http response
   */
  async function get (req, res) {
    res.json(await service.get(req.params.id, req.auth, _.omit(req.params, 'id')))
  }

  /**
   * search entities by request query
   * @param req the http request
   * @param res the http response
   */
  async function search (req, res) {
    const { items, meta } = await service.search(_.extend(req.query, req.params), req.auth)
    injectSearchMeta(res, meta)
    res.json(items)
  }

  /**
   * remove entity by id
   * @param req the http request
   * @param res the http response
   */
  async function remove (req, res) {
    await service.remove(req.params.id, req.auth, _.omit(req.params, 'id'))
    res.status(204).end()
  }

  return {
    create,
    search,
    remove,
    get,
    patch
  }
}

module.exports = { getControllerMethods, getSubControllerMethods }
