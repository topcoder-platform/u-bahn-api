const config = require('config')
const AWS = require('aws-sdk')
const elasticsearch = require('elasticsearch')

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
  const hosts = config.ES.HOST
  const apiVersion = config.ES.API_VERSION

  if (!esClient) {
    // AWS ES configuration is different from other providers
    if (/.*amazonaws.*/.test(hosts)) {
      esClient = new elasticsearch.Client({
        apiVersion,
        hosts,
        connectionClass: require('http-aws-es'), // eslint-disable-line global-require
        amazonES: {
          region: config.get('esConfig.AWS_REGION'),
          credentials: new AWS.EnvironmentCredentials('AWS')
        }
      })
    } else {
      esClient = new elasticsearch.Client({
        apiVersion,
        hosts
      })
    }
  }
  return esClient
}

module.exports = {
  getESClient
}
