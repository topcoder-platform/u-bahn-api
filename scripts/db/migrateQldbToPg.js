const {
  IonTypes
} = require('ion-js')
const QLDB = require('amazon-qldb-driver-nodejs')
const sequelize = require('../../src/models/index')
const logger = require('../../src/common/logger')

const models = sequelize.models

const dataKeys = ['User', 'Organization', 'AchievementsProvider', 'Achievement',
  'AttributeGroup', 'Attribute', 'ExternalProfile', 'SkillsProvider',
  'OrganizationSkillsProvider', 'Role', 'Skill', 'UserAttribute', 'UsersRole', 'UsersSkill']

/**
 * Query all records from db.
 * @param {String} tableName the table name
 * @param {Object} session the db session
 */
async function queryAllRecord (tableName, session) {
  if (tableName === 'User') {
    tableName = 'DUser'
  } else if (tableName === 'UserAttribute') {
    tableName = 'UsersAttribute'
  } else if (tableName === 'UsersRole') {
    tableName = 'UserRole'
  }
  const results = await session.executeStatement(`SELECT * FROM ${tableName}`, [])
  return results.getResultList().map(r => readerToJson(r))
}

/**
 * Reader to json object
 * @param reader the ion.js Reader
 * @returns {{}}
 */
function readerToJson (reader) {
  reader.next()
  reader.stepIn()

  const obj = {}

  const toRealValue = (r, result) => {
    let nextT = reader.next()

    const setValue = (key, value) => {
      if (key) {
        result[key] = value
      } else {
        result.push(value)
      }
      return value
    }

    while (nextT) {
      const name = r.fieldName()
      switch (nextT) {
        case IonTypes.STRING:
          setValue(name, r.stringValue())
          break
        case IonTypes.TIMESTAMP:
          setValue(name, r.timestampValue().getDate())
          break
        case IonTypes.NULL:
          setValue(name, null)
          break
        case IonTypes.INT:
          setValue(name, r.numberValue())
          break
        case IonTypes.LIST:
          r.stepIn()
          toRealValue(r, setValue(name, []))
          r.stepOut()
          break
        case IonTypes.BOOL:
          setValue(name, r.booleanValue())
          break
      }
      nextT = reader.next()
    }
  }

  toRealValue(reader, obj)
  return obj
}

/**
 * import test data
 */
async function main () {
  const qldbInstance = new QLDB.PooledQldbDriver(process.env.QLDB_NAME, {
    region: process.env.AWS_REGION,
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY
  })
  const session = await qldbInstance.getSession()
  for (const key of dataKeys) {
    try {
      const records = await queryAllRecord(key, session)
      await models[key].bulkCreate(records)
      logger.info(`import data for ${key} done, record count: ${records.length}`)
    } catch (e) {
      logger.error(e)
      logger.warn(`import data for ${key} failed`)
    }
  }
  session.close()
  logger.info('all done')
  process.exit(0)
}

(async () => {
  main().catch(err => console.error(err))
})()
