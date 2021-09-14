# # U-Bahn API

You can start the local pgsql and es by running `docker-compose up` from `docker-pgsql-es` folder. You should create a `.env` file and correctly set it.

## E2E testing with Postman

You should be able to find the tests result from the command window of running `npm run test:newman` for each test case.

Below is a sample output result of finding users by a normal user.

```
Ubahn-api

Iteration 1/9

❏ users / search users
↳ search users with various parameters by user
  GET http://127.0.0.1:3001/api/1.0/users?page=1&perPage=10&enrich=true [200 OK, 2.28KB, 31ms]
  ✓  Status code is 200

Iteration 2/9

↳ search users with various parameters by user
  GET http://127.0.0.1:3001/api/1.0/users?page=1&perPage=1 [200 OK, 822B, 11ms]
  ✓  Status code is 200

Iteration 3/9

↳ search users with various parameters by user
  GET http://127.0.0.1:3001/api/1.0/users?page=1&perPage=1&handle=POSTMANE2E-lazybaer [200 OK, 424B, 10ms]
  ✓  Status code is 200

Iteration 4/9

↳ search users with various parameters by user
  GET http://127.0.0.1:3001/api/1.0/users?roleId=977d66bb-112f-49b1-8b20-2ef7a17f4943 [200 OK, 425B, 9ms]
  ✓  Status code is 200

Iteration 5/9

↳ search users with various parameters by user
  GET http://127.0.0.1:3001/api/1.0/users?enrich=true&externalProfile.externalId=8547899 [200 OK, 425B, 10ms]
  ✓  Status code is 200

Iteration 6/9

↳ search users with various parameters by user
  GET http://127.0.0.1:3001/api/1.0/users?enrich=true&externalProfile.organizationId=36ed815b-3da1-49f1-a043-aaed0a4e81ad [200 OK, 2.39KB, 11ms]
  ✓  Status code is 200

Iteration 7/9

↳ search users with various parameters by user
  GET http://127.0.0.1:3001/api/1.0/users?page=1&perPage=10&enrich=true&handle=POSTMANE2E-tc-Admin&roleId=977d66bb-112f-49b1-8b20-2ef7a17f4943&externalProfile.externalId=8547899&externalProfile.organizationId=36ed815b-3da1-49f1-a043-aaed0a4e81ad [200 OK, 425B, 14ms]
  ✓  Status code is 200

Iteration 8/9

↳ search users with various parameters by user
  GET http://127.0.0.1:3001/api/1.0/users?handle=POSTMANE2E-Sylvan_Gorczany [200 OK, 425B, 12ms]
  ✓  Status code is 200

Iteration 9/9

↳ search users with various parameters by user
  GET http://127.0.0.1:3001/api/1.0/users?handle=POSTMANE2E-Dana_Paucek6 [200 OK, 425B, 11ms]
  ✓  Status code is 200

┌─────────────────────────┬──────────────────┬─────────────────┐
│                         │         executed │          failed │
├─────────────────────────┼──────────────────┼─────────────────┤
│              iterations │                9 │               0 │
├─────────────────────────┼──────────────────┼─────────────────┤
│                requests │                9 │               0 │
├─────────────────────────┼──────────────────┼─────────────────┤
│            test-scripts │                9 │               0 │
├─────────────────────────┼──────────────────┼─────────────────┤
│      prerequest-scripts │                9 │               0 │
├─────────────────────────┼──────────────────┼─────────────────┤
│              assertions │                9 │               0 │
├─────────────────────────┴──────────────────┴─────────────────┤
│ total run duration: 479ms                                    │
├──────────────────────────────────────────────────────────────┤
│ total data received: 3.66KB (approx)                         │
├──────────────────────────────────────────────────────────────┤
│ average response time: 13ms [min: 9ms, max: 31ms, s.d.: 6ms] │
└──────────────────────────────────────────────────────────────┘
```

Then you can run `npm run test:newman:clear` to delete all testing data by above postman tests.  

If 'socket hang up' appears while running the `npm run test:newman`. You can increase the `WAIT_TIME` from the `default/test.js`.
Then run `npm run test:newman:clear`, `npm run insert-postman-data` and `npm run migrate-db-to-es` before calling `npm run test:newman` again.