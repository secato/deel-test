# Hello World

Finally finished the test, it was really fun. I'll leave some comments here:

- **regarding the folder structure**
  - I choose to separate code per domain, like "balance, contract, job".
  - Each folder contains all the code regarding that domain.
- **regarding dependency injection**
  - I went with a simply functional approach where I can inject dependency in the function parameters.
  - In more complex scenarios I would either use a DI library or created some classes and then injected the dependencies in the constructor.
- **regarding unit tests**
  - you can run unit tests with `npm run test`
- **regarding e2e tests**
  - you can run an example of integration test with `npm run test:e2e`
  - they are located in the root "tests" folder
  - I wrote only one example of test, and I left some comments in the test file due to time constraints
- **regarding the http files**
  - if you are using the rest client extension for vscode you can test the endpoints quickly from the editor, each folder has a .http file with some tests to the endpoint.
- **regarding some questions or thoughts**
  - you can do a find all for "Thought:" in order to see some comments that I left close the some functions or specific code.
- **Final comments**:
  - I would love to create a small UI for this, however I was above of the time (I had to learn/refresh myself about sequelize).
  - It would be nice to have an OpenAPI doc.
  - I would move database stuff to some helper functions or to the model to clean up the code, so instead of doing all the query in the method we would have something like `Profile.findBestProfessions(...params...)` to encapsulate the database stuff.

# DEEL BACKEND TASK

💫 Welcome! 🎉

This backend exercise involves building a Node.js/Express.js app that will serve a REST API. We imagine you should spend around 3 hours at implement this feature.

## Data Models

> **All models are defined in src/model.js**

### Profile

A profile can be either a `client` or a `contractor`.
clients create contracts with contractors. contractor does jobs for clients and get paid.
Each profile has a balance property.

### Contract

A contract between and client and a contractor.
Contracts have 3 statuses, `new`, `in_progress`, `terminated`. contracts are considered active only when in status `in_progress`
Contracts group jobs within them.

### Job

contractor get paid for jobs by clients under a certain contract.

## Getting Set Up

The exercise requires [Node.js](https://nodejs.org/en/) to be installed. We recommend using the LTS version.

1. Start by cloning this repository.

1. In the repo root directory, run `npm install` to gather all dependencies.

1. Next, `npm run seed` will seed the local SQLite database. **Warning: This will drop the database if it exists**. The database lives in a local file `database.sqlite3`.

1. Then run `npm start` which should start both the server and the React client.

❗️ **Make sure you commit all changes to the master branch!**

## Technical Notes

- The server is running with [nodemon](https://nodemon.io/) which will automatically restart for you when you modify and save a file.

- The database provider is SQLite, which will store data in a file local to your repository called `database.sqlite3`. The ORM [Sequelize](http://docs.sequelizejs.com/) is on top of it. You should only have to interact with Sequelize - **please spend some time reading sequelize documentation before starting the exercise.**

- To authenticate users use the `getProfile` middleware that is located under src/middleware/getProfile.js. users are authenticated by passing `profile_id` in the request header. after a user is authenticated his profile will be available under `req.profile`. make sure only users that are on the contract can access their contracts.
- The server is running on port 3001.

## APIs To Implement

Below is a list of the required API's for the application.

1. **_GET_** `/contracts/:id` - This API is broken 😵! it should return the contract only if it belongs to the profile calling. better fix that!

1. **_GET_** `/contracts` - Returns a list of contracts belonging to a user (client or contractor), the list should only contain non terminated contracts.

1. **_GET_** `/jobs/unpaid` - Get all unpaid jobs for a user (**_either_** a client or contractor), for **_active contracts only_**.

1. **_POST_** `/jobs/:job_id/pay` - Pay for a job, a client can only pay if his balance >= the amount to pay. The amount should be moved from the client's balance to the contractor balance.

1. **_POST_** `/balances/deposit/:userId` - Deposits money into the the the balance of a client, a client can't deposit more than 25% his total of jobs to pay. (at the deposit moment)

1. **_GET_** `/admin/best-profession?start=<date>&end=<date>` - Returns the profession that earned the most money (sum of jobs paid) for any contactor that worked in the query time range.

1. **_GET_** `/admin/best-clients?start=<date>&end=<date>&limit=<integer>` - returns the clients the paid the most for jobs in the query time period. limit query parameter should be applied, default limit is 2.

```
 [
    {
        "id": 1,
        "fullName": "Reece Moyer",
        "paid" : 100.3
    },
    {
        "id": 200,
        "fullName": "Debora Martin",
        "paid" : 99
    },
    {
        "id": 22,
        "fullName": "Debora Martin",
        "paid" : 21
    }
]
```

## Going Above and Beyond the Requirements

Given the time expectations of this exercise, we don't expect anyone to submit anything super fancy, but if you find yourself with extra time, any extra credit item(s) that showcase your unique strengths would be awesome! 🙌

It would be great for example if you'd write some unit test / simple frontend demostrating calls to your fresh APIs.

## Submitting the Assignment

When you have finished the assignment, create a github repository and send us the link.

Thank you and good luck! 🙏
