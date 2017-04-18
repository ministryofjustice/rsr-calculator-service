#Risk os Serious Recidivism Service
A Restful service to provide access to the Risk of Serious Recidivism calculator

## Running with NodeJS
Start by ensuring you have the most recent version of NodeJS and NPM installed.

### Pre-requisites
To find the current version of NodeJS installed on your system, run the following command in your preferred shell;

```bash
$ node -v
```

If you have the latest versions installed you need to get the dependencies loaded, run the following command in your preferred shell;

```bash
$ npm install
```

### Running the tests
If you have all the Pre-requisites then you are ready to run the tests. Call the following from your shell;

```bash
$ npm test
```

### Running the server
If you have all the Pre-requisites then you are ready to run the service. Call the following from your shell;

```bash
$ npm start
```

### Running the server with raw logs
If you wish to have the output in raw JSON, then you can run the server without piping it through bunyan's formatter. Call the following from your shell;

```bash
$ node server.js
```

## Swagger documentation
The swagger documentation can be found on the path ```/dist/?url=/swagger/resources.json```
