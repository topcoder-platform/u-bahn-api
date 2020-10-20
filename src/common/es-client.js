const config = require('config')
const AWS = require('aws-sdk')
const elasticsearch = require('@elastic/elasticsearch')
const createAwsElasticsearchConnector = require('aws-elasticsearch-connector')

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
  if (!esClient) {
    // AWS ES configuration is different from other providers
    if (/.*amazonaws.*/.test(host)) {
      esClient = new elasticsearch.Client({
        ...createAwsElasticsearchConnector(AWS.config),
        node: host
      })
    } else {
      esClient = new elasticsearch.Client({
        node: host
      })
    }
  }
  return esClient
}

module.exports = {
  getESClient
}
