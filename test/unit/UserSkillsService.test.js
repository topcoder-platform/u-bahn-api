/* eslint-disable no-unused-expressions */

const _ = require('lodash')
const chai = require('chai')
const chaiAsPromised = require('chai-as-promised')
const sinon = require('sinon')
const sequelize = require('../../src/models/index')
const service = require('../../src/modules/usersSkill/service')
const helper = require('../../src/common/helper')
const serviceHelper = require('../../src/common/service-helper')
const dbHelper = require('../../src/common/db-helper')
const errors = require('../../src/common/errors')

chai.use(chaiAsPromised)
const expect = chai.expect

describe('user skills service test', () => {
  beforeEach(() => {
    sinon.stub(sequelize, 'transaction').callsFake(f => f())
  })
  afterEach(() => {
    sinon.restore()
  })

  describe('Create user skills', () => {
    it('Create user skills successfully', async () => {
      const entity = { userId: 'userId', skillId: 'skillId' }
      const newEntity = _.assign({ createdBy: 'test' }, entity)
      sinon.stub(dbHelper, 'get').resolves({})
      sinon.stub(dbHelper, 'makeSureUnique').resolves({})
      const stubDBCreate = sinon.stub(dbHelper, 'create').resolves({ toJSON: () => newEntity })
      const stubEsInsert = sinon.stub(serviceHelper, 'createRecordInEs').resolves({})
      const result = await service.create(entity, {})
      expect(result).to.deep.eql(newEntity)
      expect(stubDBCreate.calledOnce).to.be.true
      expect(stubEsInsert.calledOnce).to.be.true
      expect(stubDBCreate.getCall(0).args[1]).to.deep.eq(entity)
      expect(stubEsInsert.getCall(0).args[1]).to.deep.eq(newEntity)
    })
    it('Throw error when require parameters absence', async () => {
      await expect(service.create({ userId: 'userId' })).to.be.rejectedWith('"entity.skillId" is required')
      await expect(service.create({ skillId: 'skillId' })).to.be.rejectedWith('"entity.userId" is required')
    })
    it('Throw error when user id does not exist', async () => {
      const error = errors.newEntityNotFoundError('cannot find user where id:userId')
      sinon.stub(dbHelper, 'get').rejects(error)
      await expect(service.create({ userId: 'userId', skillId: 'skillId' })).to.eventually.rejectedWith(error)
    })
    it('Throw error when a record with same user id and skill id exist', async () => {
      const error = errors.newConflictError('usersSkill already exists with userId:userId,skillId:skillId')
      sinon.stub(dbHelper, 'get').resolves({})
      sinon.stub(dbHelper, 'makeSureUnique').rejects(error)
      await expect(service.create({ userId: 'userId', skillId: 'skillId' })).to.eventually.rejectedWith(error)
    })
    it('Throw error and does not publish error event when insert into db error', async () => {
      const error = new Error('db error')
      sinon.stub(dbHelper, 'get').resolves({})
      sinon.stub(dbHelper, 'makeSureUnique').resolves({})
      const stubPublishError = sinon.stub(helper, 'publishError')
      sinon.stub(dbHelper, 'create').rejects(error)
      await expect(service.create({ userId: 'userId', skillId: 'skillId' })).to.eventually.rejectedWith(error)
      expect(stubPublishError.called).to.be.false
    })
    it('Throw error and publish error event when insert into es error', async () => {
      const error = new Error('es error')
      const entity = { userId: 'userId', skillId: 'skillId' }
      const newEntity = _.assign({ createdBy: 'test' }, entity)
      sinon.stub(dbHelper, 'get').resolves({})
      sinon.stub(dbHelper, 'makeSureUnique').resolves({})
      const stubPublishError = sinon.stub(helper, 'publishError').resolves({})
      const stubDBCreate = sinon.stub(dbHelper, 'create').resolves({ toJSON: () => newEntity })
      sinon.stub(serviceHelper, 'createRecordInEs').rejects(error)
      await expect(service.create({ userId: 'userId', skillId: 'skillId' })).to.eventually.rejectedWith(error)
      expect(stubPublishError.called).to.be.true
      expect(stubDBCreate.called).to.be.true
    })
  })
  describe('Search user skills', () => {
    it('Throw error when require parameters absence', async () => {
      await expect(service.search({ })).to.be.rejectedWith(errors.BadRequestError)
    })
    it('Throw error when user id does not exist', async () => {
      const error = errors.newEntityNotFoundError('cannot find user where id:userId')
      sinon.stub(dbHelper, 'get').rejects(error)
      await expect(service.search({ userId: 'userId' })).to.eventually.rejectedWith(error)
    })
    it('Search user skills from es successfully', async () => {
      const entity = { userId: 'userId', skillId: 'skillId' }
      const newEntity = _.assign({ createdBy: 'test' }, entity)
      sinon.stub(dbHelper, 'get').resolves({})
      const searchEs = sinon.stub(serviceHelper, 'searchRecordInEs').resolves([newEntity])
      const searchDb = sinon.stub(dbHelper, 'find')
      const result = await service.search({ userId: 'userId' }, {})
      expect(result).to.deep.eql([newEntity])
      expect(searchEs.calledOnce).to.be.true
      expect(searchDb.called).to.be.false
    })
    it('Search user skills from db when es throw errors', async () => {
      const entity = { userId: 'userId', skillId: 'skillId' }
      const newEntity = _.assign({ createdBy: 'test' }, entity)
      sinon.stub(dbHelper, 'get').resolves({})
      const searchEs = sinon.stub(serviceHelper, 'searchRecordInEs').resolves(null)
      const searchDb = sinon.stub(dbHelper, 'find').resolves([newEntity])
      const result = await service.search({ userId: 'userId' }, {})
      expect(result).to.deep.eql({ fromDb: true, result: [newEntity], total: 1 })
      expect(searchEs.calledOnce).to.be.true
      expect(searchDb.called).to.be.true
    })
  })
})
