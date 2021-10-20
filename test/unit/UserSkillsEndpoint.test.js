const _ = require('lodash')
const config = require('config')
const chai = require('chai')
const chaiHttp = require('chai-http')
const chaiAsPromised = require('chai-as-promised')
const service = require('../../src/modules/usersSkill/service')
const sinon = require('sinon')
const app = require('../../app')
const commonData = require('./common/commonData')

chai.use(chaiHttp)
chai.use(chaiAsPromised)
const should = chai.should()
const expect = chai.expect

describe('Unit tests for /users/{userId}/skills', () => {
  afterEach(() => {
    sinon.restore()
  })
  describe('Test GET', () => {
    beforeEach(() => {
      sinon.stub(service, 'search').resolves({
        page: 1,
        perPage: 20,
        total: 1,
        result: [{
          id: 1,
          userId: 1,
          skillId: 1
        }]
      })
    })
    for (const tokenName of ['admin', 'administrator', 'topcoderUser', 'copilot', 'ubahn']) {
      it(`Call GET API with ${tokenName} token successfully`, async () => {
        const response = await chai.request(app).get(`/${config.API_VERSION}/users/test_user/skills`)
          .set('Authorization', 'Bearer ' + commonData[`${tokenName}Token`])
        should.equal(response.status, 200)
        should.equal(response.headers['x-page'], '1')
        should.equal(response.headers['x-per-page'], '20')
        should.equal(response.headers['x-total'], '1')
        should.equal(response.headers['x-total-pages'], '1')
        should.exist(response.headers.link)
        should.equal(response.body.length, 1)
      })
    }
    it('Call GET API with other token', async () => {
      const response = await chai.request(app).get(`/${config.API_VERSION}/users/test_user/skills`)
        .set('Authorization', `Bearer ${commonData.unKnownToken}`)
      should.equal(response.status, 403)
    })
    it('Call GET API without token', async () => {
      const response = await chai.request(app).get(`/${config.API_VERSION}/users/test_user/skills`)
      should.equal(response.status, 403)
    })
  })
  describe('Test HEAD', () => {
    beforeEach(() => {
      sinon.stub(service, 'search').resolves({
        page: 1,
        perPage: 20,
        total: 1,
        result: [{
          id: 1,
          userId: 1,
          skillId: 1
        }]
      })
    })
    for (const tokenName of ['admin', 'administrator', 'topcoderUser', 'copilot', 'ubahn']) {
      it(`Call HEAD API with ${tokenName} token successfully`, async () => {
        const response = await chai.request(app).head(`/${config.API_VERSION}/users/test_user/skills`)
          .set('Authorization', 'Bearer ' + commonData[`${tokenName}Token`])
        should.equal(response.status, 200)
        should.equal(response.headers['x-page'], '1')
        should.equal(response.headers['x-per-page'], '20')
        should.equal(response.headers['x-total'], '1')
        should.equal(response.headers['x-total-pages'], '1')
        should.exist(response.headers.link)
        should.equal(_.isEmpty(response.body), true)
      })
    }
    it('Call HEAD API with other token', async () => {
      const response = await chai.request(app).head(`/${config.API_VERSION}/users/test_user/skills`)
        .set('Authorization', `Bearer ${commonData.unKnownToken}`)
      should.equal(response.status, 403)
    })
    it('Call HEAD API without token', async () => {
      const response = await chai.request(app).head(`/${config.API_VERSION}/users/test_user/skills`)
      should.equal(response.status, 403)
    })
  })
  describe('Test POST', () => {
    const userSkill = {
      userId: 'string',
      skillId: 'string',
      metricValue: 'string',
      certifierId: 'string',
      certifiedDate: '2021-10-11T10:59:12.816Z',
      created: '2021-10-11T10:59:12.816Z',
      updated: '2021-10-11T10:59:12.817Z',
      createdBy: 'string',
      updatedBy: 'string'
    }
    let stubCreate
    beforeEach(() => {
      stubCreate = sinon.stub(service, 'create').resolves(userSkill)
    })
    for (const tokenName of ['admin', 'administrator', 'topcoderUser', 'copilot', 'ubahn']) {
      it(`Call POST API with ${tokenName} token successfully`, async () => {
        const response = await chai.request(app).post(`/${config.API_VERSION}/users/test_user/skills`)
          .set('Authorization', 'Bearer ' + commonData[`${tokenName}Token`])
          .send({ skillId: 'testSkill' })
        should.equal(response.status, 200)
        expect(response.body).to.deep.eq(userSkill)
        should.equal(stubCreate.calledOnce, true)
        expect(stubCreate.getCall(0).args[0]).to.deep.eq({ userId: 'test_user', skillId: 'testSkill' })
      })
    }
    it('Call POST API with other token', async () => {
      const response = await chai.request(app).post(`/${config.API_VERSION}/users/test_user/skills`)
        .set('Authorization', `Bearer ${commonData.unKnownToken}`)
        .send({ skillId: 'testSkill' })
      should.equal(response.status, 403)
    })
    it('Call POST API without token', async () => {
      const response = await chai.request(app).post(`/${config.API_VERSION}/users/test_user/skills`)
        .send({ skillId: 'testSkill' })
      should.equal(response.status, 403)
    })
  })
})
