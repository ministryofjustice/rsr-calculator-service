#Risk Calculator Service
A Restful service to calculate risk on a known set of parameters.

## Swagger documentation
The details of the API  can found in [the online documentation](https://noms-digital-studio.github.io/rsr-calculator-service/).

The swagger specification can be found on the path ```/api-docs```.

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
