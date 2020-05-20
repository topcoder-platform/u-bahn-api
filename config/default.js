/**
 * the default config
 */

module.exports = {
  LOG_LEVEL: process.env.LOG_LEVEL || 'debug',
  PORT: process.env.PORT || 3001,
  AUTH_SECRET: process.env.AUTH_SECRET || 'CLIENT_SECRET',
  VALID_ISSUERS: process.env.VALID_ISSUERS ? process.env.VALID_ISSUERS.replace(/\\"/g, '')
    : '["https://topcoder-dev.auth0.com/", "https://api.topcoder.com"]',
  API_VERSION: 'api/1.0',

  AWS_KEY: process.env.AWS_KEY,
  AWS_SECRET: process.env.AWS_SECRET,
  AWS_REGION: process.env.AWS_REGION || 'us-east-1',
  DATABASE: process.env.DATABASE || 'ubahn-db'
}
