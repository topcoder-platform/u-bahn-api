const _ = require('lodash')
const ion = require('ion-js')
const AWS = require('aws-sdk')
const QLDB = require('amazon-qldb-driver-nodejs')
const logger = require('../../src/common/logger')

// Create S3 service object
const s3 = new AWS.S3({
  apiVersion: '2006-03-01',
  region: process.env.AWS_REGION,
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY
})

/**
 * Get the statement table.
 * @param {String} statement the execute statement
 */
function getTable (statement) {
  if (statement.startsWith('create index on') || statement.startsWith('CREATE INDEX ON')) {
    return statement.substring(16, statement.indexOf(' ', 16))
  }
  if (statement.startsWith('create table')) {
    return statement.substring(13)
  }
}

/**
 * import data from s3 to qldb.
 */
async function main () {
  const qldbInstance = new QLDB.QldbDriver(process.env.QLDB_NAME, {
    region: process.env.AWS_REGION,
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY
  })
  const tables = await qldbInstance.getTableNames()
  const bucket = process.env.BUCKET_NAME

  try {
    const list = await s3.listObjects({ Bucket: bucket }).promise()
    // get all data file key
    const keys = _(list.Contents).map('Key').filter(key => _.endsWith(key, '.ion'))
      .sortBy(key => _.parseInt(_.split(_.split(key, '.')[1], '-')[0])).value()
    for (const key of keys) {
      // get data of each file
      const data = await s3.getObject({ Bucket: bucket, Key: key }).promise()
      const contents = ion.loadAll(data.Body)
      for (const content of contents) {
        if (!content.transactionInfo) {
          continue
        }
        // get content of each transaction
        const statement = content.transactionInfo.statements.get(0).statement.stringValue()
        // process create statement
        if (statement.startsWith('create') || statement.startsWith('CREATE')) {
          if (!_.includes(tables, getTable(statement))) {
            logger.info(`start executing: ${statement}`)
            await qldbInstance.executeLambda(t => t.execute(statement))
          } else {
            logger.info(`exists, skip ${statement}`)
          }
        }
        // process insert and update statement
        if (statement.startsWith('INSERT') || statement.startsWith('UPDATE')) {
          logger.info(`start executing: ${statement}`)
          try {
            await qldbInstance.executeLambda(t => t.execute(statement, content.revisions.get(0).data))
          } catch (e) {
            logger.error(e)
            logger.warn(`execute ${statement} failed`)
          }
        }
        // process delete statement
        if (statement.startsWith('DELETE')) {
          logger.info(`start executing: ${statement}`)
          try {
            await qldbInstance.executeLambda(t => t.execute(statement))
          } catch (e) {
            logger.error(e)
            logger.warn(`execute ${statement} failed`)
          }
        }
      }
    }
  } finally {
    qldbInstance.close()
  }
}

(async () => {
  main().catch(err => console.error(err))
})()
