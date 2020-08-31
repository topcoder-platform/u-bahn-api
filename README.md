# U-Bahn API

## Install software

- node 12.x
- npm 6.x
- docker
- elasticsearch 6.x

## Configuration

Configuration for the application is at config/default.js and config/production.js. The following parameters can be set in config files or in env variables:

- LOG_LEVEL: the log level
- PORT: the server port
- AUTH_SECRET: TC Authentication secret
- VALID_ISSUERS: valid issuers for TC authentication
- PAGE_SIZE: the default pagination limit
- MAX_PAGE_SIZE: the maximum pagination size
- API_VERSION: the API version
- AWS_ACCESS_KEY_ID: The AWS access key
- AWS_SECRET_ACCESS_KEY: The AWS secret key
- AWS_REGION: The Amazon region to use when connecting.
- DATABASE: The QLDB ledger name
- AUTH0_URL: Auth0 URL, used to get TC M2M token
- AUTH0_AUDIENCE: Auth0 audience, used to get TC M2M token
- TOKEN_CACHE_TIME: Auth0 token cache time, used to get TC M2M token
- AUTH0_CLIENT_ID: Auth0 client id, used to get TC M2M token
- AUTH0_CLIENT_SECRET: Auth0 client secret, used to get TC M2M token
- AUTH0_PROXY_SERVER_URL: Proxy Auth0 URL, used to get TC M2M token
- GROUP_API_URL: Topcoder Group API URL
- BUSAPI_URL: Topcoder Bus API URL
- KAFKA_ERROR_TOPIC: The error topic at which bus api will publish any errors
- KAFKA_MESSAGE_ORIGINATOR: The originator value for the kafka messages
- UBAHN_CREATE_TOPIC: Kafka topic for create message
- UBAHN_UPDATE_TOPIC: Kafka topic for update message
- UBAHN_DELETE_TOPIC: Kafka topic for delete message
- UBAHN_AGGREGATE_TOPIC: Kafka topic that is used to combine all create, update and delete message(s)
- ES.HOST: Elasticsearch host
- ES.API_VERSION: Elasticsearch API version
- ES.DOCUMENTS: Elasticsearch index, type and id mapping for resources.

For `ES.DOCUMENTS` configuration, you will find multiple other configurations below it. Each has default values that you can override using the environment variables

## Local deployment

Setup your Elasticsearch instance and ensure that it is up and running.

1. Visit [this link](https://console.aws.amazon.com/qldb/home?region=us-east-1#gettingStarted), login and create one **ledger** databases named `ubahn-db`
2. Visit [this link](https://console.aws.amazon.com/iam/home?region=us-east-1#/security_credentials) to download your "Access keys"
3. Follow *Configuration* section to update config values, like database, aws key/secret etc ..
4. Goto *UBahn-api*, run `npm i` and `npm run lint`
5. Import mock data, `node scripts/db/genData.js`, this will create tables and gen some data for test (if you need this)
6. Startup server `node app.js` or `npm run start`

## Working with mock data

You can use the scripts `npm run insert-data` (and `npm run delete-data`) to insert mock data (and delete mock data respectively). The data is inserted into QLDB and Elasticsearch. You need to setup the configurations beforehand and also start the elasticsearch instance before you run these scripts

## Local Deployment with Docker

Make sure all config values are right(aws key and secret), and you can run on local successful, then run below commands

1. Navigate to the directory `docker`

2. Rename the file `sample.api.env` to `api.env`

3. Set the required AUTH0 configurations, AWS credentials and ElasticSearch host in the file `api.env`

4. Once that is done, run the following command

    ```bash
    docker-compose up
    ```

5. When you are running the application for the first time, It will take some time initially to download the image and install the dependencies

## API endpoints verification

1. open postman
2. import *docs/UBahn_API.postman_collection.json* , *UBahn_ENV.postman_environment.json* and then check endpoints

## Test token

you can use below token to test role and permissions

### 01 Topcoder User

- payload

  ```json
  {
    "roles": [
      "Topcoder User"
    ],
    "iss": "https://api.topcoder.com",
    "handle": "tc-user",
    "exp": 1685571460,
    "userId": "23166766",
    "iat": 1585570860,
    "email": "tc-user@gmail.com",
    "jti": "0f1ef1d3-2b33-4900-bb43-48f2285f9627"
  }
  ```

- token

  ```text
  eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJyb2xlcyI6WyJUb3Bjb2RlciBVc2VyIl0sImlzcyI6Imh0dHBzOi8vYXBpLnRvcGNvZGVyLmNvbSIsImhhbmRsZSI6InRjLXVzZXIiLCJleHAiOjE2ODU1NzE0NjAsInVzZXJJZCI6IjIzMTY2NzY2IiwiaWF0IjoxNTg1NTcwODYwLCJlbWFpbCI6InRjLXVzZXJAZ21haWwuY29tIiwianRpIjoiMGYxZWYxZDMtMmIzMy00OTAwLWJiNDMtNDhmMjI4NWY5NjI3In0.eBhXqSBe8zMRg2nBeGeZDgKiJdAYs0zOMzGfJCjWfcs
  ```

#### 02 Copilot

- payload

  ```json
  {
    "roles": [
      "Topcoder User","Copilot"
    ],
    "iss": "https://api.topcoder.com",
    "handle": "tc-Copilot",
    "exp": 1685571460,
    "userId": "23166767",
    "iat": 1585570860,
    "email": "tc-Copilot@gmail.com",
    "jti": "0f1ef1d3-2b33-4900-bb43-48f2285f9628"
  }
  ```

- token

  ```json
  eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJyb2xlcyI6WyJUb3Bjb2RlciBVc2VyIiwiQ29waWxvdCJdLCJpc3MiOiJodHRwczovL2FwaS50b3Bjb2Rlci5jb20iLCJoYW5kbGUiOiJ0Yy1Db3BpbG90IiwiZXhwIjoxNjg1NTcxNDYwLCJ1c2VySWQiOiIyMzE2Njc2NyIsImlhdCI6MTU4NTU3MDg2MCwiZW1haWwiOiJ0Yy1Db3BpbG90QGdtYWlsLmNvbSIsImp0aSI6IjBmMWVmMWQzLTJiMzMtNDkwMC1iYjQzLTQ4ZjIyODVmOTYyOCJ9.gP5JqJGCnOjO_gYs2r3-AQt5x8YIym15m3t43603cgc
  ```

#### 03 Admin

- payload

  ```json
  {
    "roles": [
      "Topcoder User","Copilot","Admin"
    ],
    "iss": "https://api.topcoder.com",
    "handle": "tc-Admin",
    "exp": 1685571460,
    "userId": "23166768",
    "iat": 1585570860,
    "email": "tc-Admin@gmail.com",
    "jti": "0f1ef1d3-2b33-4900-bb43-48f2285f9630"
  }
  ```

- token

  ```json
  eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJyb2xlcyI6WyJUb3Bjb2RlciBVc2VyIiwiQ29waWxvdCIsIkFkbWluIl0sImlzcyI6Imh0dHBzOi8vYXBpLnRvcGNvZGVyLmNvbSIsImhhbmRsZSI6InRjLUFkbWluIiwiZXhwIjoxNjg1NTcxNDYwLCJ1c2VySWQiOiIyMzE2Njc2OCIsImlhdCI6MTU4NTU3MDg2MCwiZW1haWwiOiJ0Yy1BZG1pbkBnbWFpbC5jb20iLCJqdGkiOiIwZjFlZjFkMy0yYjMzLTQ5MDAtYmI0My00OGYyMjg1Zjk2MzAifQ.eR97kePT0Gu-t7vUE0Ed8A88Dnmtgebyml2jrRyxhOk
  ```

#### M2M token 01

- payload, this token missing `all:usersSkill`, so all endpoints in usersSkill group will return 403

  ```json
  {
    "scopes": "all:user all:role all:skill all:usersRole all:organization all:skillsProvider",
    "iss": "https://api.topcoder.com",
    "handle":"tc-mm-01",
    "exp": 1685571460,
    "iat": 1585570860,
    "jti": "0f1ef1d3-2b33-4900-bb43-48f2285f9630"
  }
  ```

- token

  ```json
  eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJzY29wZXMiOiJhbGw6dXNlciBhbGw6cm9sZSBhbGw6c2tpbGwgYWxsOnVzZXJzUm9sZSBhbGw6b3JnYW5pemF0aW9uIGFsbDpza2lsbHNQcm92aWRlciIsImlzcyI6Imh0dHBzOi8vYXBpLnRvcGNvZGVyLmNvbSIsImhhbmRsZSI6InRjLW1tLTAxIiwiZXhwIjoxNjg1NTcxNDYwLCJpYXQiOjE1ODU1NzA4NjAsImp0aSI6IjBmMWVmMWQzLTJiMzMtNDkwMC1iYjQzLTQ4ZjIyODVmOTYzMCJ9.BlDIYsCTcHTib9XhpyzpO-KkMTTMy0egq_7qlLWRmoM
  ```

#### M2M token 02

- payload, this token contains scope, can request all endpoints

  ```json
  {
    "scopes": "all:user all:role all:skill all:usersRole all:organization all:skillsProvider all:usersSkill all:externalProfile all:achievementsProvider all:achievement all:attributeGroup all:attribute all:userAttribute",
    "iss": "https://api.topcoder.com",
    "handle": "tc-mm-02",
    "exp": 1685571460,
    "iat": 1585570860,
    "jti": "0f1ef1d3-2b33-4900-bb43-48f2285f9630"
  }
  ```

- token

  ```json
  eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJzY29wZXMiOiJhbGw6dXNlciBhbGw6cm9sZSBhbGw6c2tpbGwgYWxsOnVzZXJzUm9sZSBhbGw6b3JnYW5pemF0aW9uIGFsbDpza2lsbHNQcm92aWRlciBhbGw6dXNlcnNTa2lsbCBhbGw6ZXh0ZXJuYWxQcm9maWxlIGFsbDphY2hpZXZlbWVudHNQcm92aWRlciBhbGw6YWNoaWV2ZW1lbnQgYWxsOmF0dHJpYnV0ZUdyb3VwIGFsbDphdHRyaWJ1dGUgYWxsOnVzZXJBdHRyaWJ1dGUiLCJpc3MiOiJodHRwczovL2FwaS50b3Bjb2Rlci5jb20iLCJoYW5kbGUiOiJ0Yy1tbS0wMiIsImV4cCI6MTY4NTU3MTQ2MCwiaWF0IjoxNTg1NTcwODYwLCJqdGkiOiIwZjFlZjFkMy0yYjMzLTQ5MDAtYmI0My00OGYyMjg1Zjk2MzAifQ.8XJahLdv9mkgkL7EsOwsf8uKg4J9u-1UM73pvZ9n3JY
  ```
