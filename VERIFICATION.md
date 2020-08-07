## Verification
The verification needs data in ES, there are two ways to populate data to ES.

Please install and run [kibana](https://www.elastic.co/downloads/past-releases/kibana-6-8-0), validate data in ES during the testing, I found this is very useful for developing and testing.
The data in ES is confusing, please validate data in ES before making a decision success or failure.

#### Using u-bahn-api service
Start the `u-bahn-api` service and create data with postman.
As you create data, verify data is read from ES using resource GET methods from postman.
When create a resource, the postman sets the Id of corresponding resource, so be carefully after create resource

According to the [forum](https://apps.topcoder.com/forums/?module=Thread&threadID=956692&start=0), 
the u-bahn topics isn't set up in TC bus api, so the posting message to bus API doesn't work currently.
Fix TC bus api to accept u-bahn topics, please use this approach, this is the easiest way.


#### Using u-bahn-es-processor

Publish messages to [u-bahn-es-processor](https://github.com/topcoder-platform/u-bahn-es-processor) through kafka. 
This is very hard and error prune, but if this is the only way, use this approach.

Follow the instructions in the README file in the `u-bahm-es-processor`, start kafka server, start elasticsearch, initialize Elasticsearch, start `u-bahn-es-processor` app

1. start kafka-console-producer to write messages to `u-bahn.action.create`
topic:
  `docker exec -it ubahn-data-processor-es_kafka /opt/kafka/bin/kafka-console-producer.sh --broker-list localhost:9092 --topic u-bahn.action.create`
3. write message:
  `{"topic":"u-bahn.action.create","originator":"u-bahn-api","timestamp":"2019-07-08T00:00:00.000Z","mime-type":"application/json","payload":{"resource":"user","id":"391a3656-9a01-47d4-8c6d-64b68c44f212","handle":"user"}}`
4. Watch the app console, It will show message successfully handled.
5. Get the user from the postman by GET /users or /users/391a3656-9a01-47d4-8c6d-64b68c44f212.

6. write message:
  `{"topic":"u-bahn.action.create","originator":"u-bahn-api","timestamp":"2019-07-08T00:00:00.000Z","mime-type":"application/json","payload":{"resource":"achievement","userId":"391a3656-9a01-47d4-8c6d-64b68c44f212","achievementsProviderId":"c77326d8-ef16-4be0-b844-d5c384b7bb8b","name":"achievement","uri":"https://google.com","certifierId":"b8726ca1-557e-4502-8f9b-25044b9c123d","certifiedDate":"2019-07-08T00:00:00.000Z"}}`
7. Watch the app console, It will show message successfully handled.
8. Get the achievement from the postman.

9. write message:
  `{"topic":"u-bahn.action.create","originator":"u-bahn-api","timestamp":"2019-07-08T00:00:00.000Z","mime-type":"application/json","payload":{"resource":"achievementprovider","id":"c77326d8-ef16-4be0-b844-d5c384b7bb8b","name":"achievementprovider"}}`
10. Watch the app console, It will show message successfully handled.
11. Get the achievementprovider from the postman.

12. write message:
  `{"topic":"u-bahn.action.create","originator":"u-bahn-api","timestamp":"2019-07-08T00:00:00.000Z","mime-type":"application/json","payload":{"resource":"attributegroup","id":"720c34f9-0fd4-46fd-9293-4a8cfdcd3e96","organizationId":"017733ad-4704-4c7e-ae60-36b3332731df","name":"attributegroup"}}`
13. Watch the app console, It will show message successfully handled.
14. Get the attributegroup from the postman.

15. write message:
  `{"topic":"u-bahn.action.create","originator":"u-bahn-api","timestamp":"2019-07-08T00:00:00.000Z","mime-type":"application/json","payload":{"resource":"externalprofile","userId":"391a3656-9a01-47d4-8c6d-64b68c44f212","organizationId":"017733ad-4704-4c7e-ae60-36b3332731df","uri":"https:google.com"}}`
16. Watch the app console, It will show message successfully handled.
17. Get the externalprofile from the postman.

18. write message:
  `{"topic":"u-bahn.action.create","originator":"u-bahn-api","timestamp":"2019-07-08T00:00:00.000Z","mime-type":"application/json","payload":{"resource":"organization","id":"017733ad-4704-4c7e-ae60-36b3332731df","name":"organization"}}`
19. Watch the app console, It will show message successfully handled.
20. Get the organization from the postman.

21. write message:
  `{"topic":"u-bahn.action.create","originator":"u-bahn-api","timestamp":"2019-07-08T00:00:00.000Z","mime-type":"application/json","payload":{"resource":"role","id":"188446f1-02dc-4fc7-b74e-ab7ea3033a57","name":"role"}}`
22. Watch the app console, It will show message successfully handled.
23. Get the role from the postman.

24. write message:
  `{"topic":"u-bahn.action.create","originator":"u-bahn-api","timestamp":"2019-07-08T00:00:00.000Z","mime-type":"application/json","payload":{"resource":"skill","id":"8a8c8d3a-9165-4dae-8a8c-f828cbe01d5d","skillProviderId":"63061b84-9784-4b71-b695-4a777eeb7601","externalId":"ba395d36-6ce8-4bd1-9d6c-754f0389abcb","uri":"https://google.com","name":"skill"}}`
25. Watch the app console, It will show message successfully handled.
26. Get the skill from the postman.

27. write message:
  `{"topic":"u-bahn.action.create","originator":"u-bahn-api","timestamp":"2019-07-08T00:00:00.000Z","mime-type":"application/json","payload":{"resource":"skillprovider","id":"63061b84-9784-4b71-b695-4a777eeb7601","name":"skillprovider"}}`
28. Watch the app console, It will show message successfully handled.
29. Get the skillprovider from the postman.

30. write message:
  `{"topic":"u-bahn.action.create","originator":"u-bahn-api","timestamp":"2019-07-08T00:00:00.000Z","mime-type":"application/json","payload":{"resource":"userattribute","userId":"391a3656-9a01-47d4-8c6d-64b68c44f212","attributeId":"b5a50f73-08e2-43d1-a78a-4652f15d950e","value":"userattribute"}}`
31. Watch the app console, It will show message successfully handled.
32. Get the userattribute from the postman.

33. write message:
  `{"topic":"u-bahn.action.create","originator":"u-bahn-api","timestamp":"2019-07-08T00:00:00.000Z","mime-type":"application/json","payload":{"resource":"userrole","userId":"391a3656-9a01-47d4-8c6d-64b68c44f212","roleId":"188446f1-02dc-4fc7-b74e-ab7ea3033a57"}}`
34. Watch the app console, It will show message successfully handled.
35. Get the userrole from the postman.

36. write message:
  `{"topic":"u-bahn.action.create","originator":"u-bahn-api","timestamp":"2019-07-08T00:00:00.000Z","mime-type":"application/json","payload":{"resource":"userskill","userId":"391a3656-9a01-47d4-8c6d-64b68c44f212","skillId":"8a8c8d3a-9165-4dae-8a8c-f828cbe01d5d","metricValue":"userskill","certifierId":"7cf786d9-a8c0-48ed-a7cc-09dcf91d904c","certifiedDate":"2019-07-08T00:00:00.000Z"}}`
37. Watch the app console, It will show message successfully handled.
38. Get the userskill from the postman.

39. write message:
  `{"topic":"u-bahn.action.create","originator":"u-bahn-api","timestamp":"2019-07-08T00:00:00.000Z","mime-type":"application/json","payload":{"resource":"attribute","id":"b5a50f73-08e2-43d1-a78a-4652f15d950e","name":"attribute", "attributeGroupId": "720c34f9-0fd4-46fd-9293-4a8cfdcd3e96"}}`
40. Watch the app console, It will show message successfully handled.
41. Get the attribute from the postman.

42. These are full set of data for one user.
Get users with enrich=true, verify all data above are returned

43. Verify query parameters in each resource are works based on the swagger doc.
When setting query parameter to the non-existing value, verify the app tries to get the data from QLDB in the console.

44. By changing id values from above data, create another users or other resources.

45. Test paging, query filtering with multiple resources.

46. Please verify all specifications in the project.
