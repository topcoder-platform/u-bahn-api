const config = require('config')
const AWS = require('aws-sdk')
const elasticsearch = require('elasticsearch')

AWS.config.region = config.AWS_REGION

// Elasticsearch client
let esClient

/**
 * Get ES Client
 * @return {Object} Elasticsearch Client Instance
 */
function getESClient () {
  if (esClient) {
    return esClient
  }
  const host = config.ES.HOST
  const apiVersion = config.ES.API_VERSION

  if (!esClient) {
    // AWS ES configuration is different from other providers
    if (/.*amazonaws.*/.test(host)) {
      esClient = new elasticsearch.Client({
        apiVersion,
        host,
        connectionClass: require('http-aws-es') // eslint-disable-line global-require
      })
    } else {
      esClient = new elasticsearch.Client({
        apiVersion,
        host
      })
    }
  }
  return esClient
}

module.exports = {
  getESClient
}
