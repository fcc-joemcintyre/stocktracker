# Stock Tracker

Stock tracking, showing the historical closing prices for stocks selected by
the users.

The server component interacts with a stock information service (Quandl) to
fetch the data for the displayed stocks. It provides a client that allows
stocks to be added and removed from the list of tracked stocks, and
broadcasts changes to all connected clients.

The client component provides an interactive display of the stock information,

- date range can be selected (1m, 3m, 6m, 1y, 3y)
- up to 8 stocks can be tracked

If multiple clients are using the application, the display is
synchronized across the clients (a client adding or removing a stock will
result in all clients seeing the changed set of stocks).

## Live instance

The application can be used at https://stocktracker-jm.herokuapp.com

## Development setup

Note that this repo uses features from npm version 7. To update to version 7, use

```
npm i -g npm
```

Clone the *Github* repo, then install the dependencies using *npm*.

```
git clone https://github.com/fcc-joemcintyre/stocktracker.git
cd stocktracker
npm install
```

### Build

In a terminal, build can be activated with

```
npm run [build | build-stage]
```

The build uses *Webpack* to run the set of build tasks. The build options are,

- build: dev build
- build-stage: build application ready to be deployed to Heroku or similar

*build* is a continuous build option - the build will
set up watches and rerun build elements as file changes are saved.
*build-stage* is a one time build option, run again to build a new stage output.

## Testing

Unit testing can be done for all components,

```
npm test
```

Integration testing can be done using,

```
npm run test-int
```

### Coverage

Coverage reports are generated using,

```
npm test -- --coverage
```

The coverage report will be available from
*coverage/index.html*

### Server

In a terminal, continuous server operation, updating on changes,
can be activated with

```
npm start
```

The *nodemon* utility provides restart on update.

### Client

After starting a server instance, open a browser and then access the
application at http://localhost:3000

## Deployment

The build process creates the *dist* directory containing all the deployment
files (in the project directory or in the staging directory).

The entry point for the server is *main.js*.
The port number for the server can be passed on the command (-p/--port) or using
the PORT environment variable. For hosted environments, the PORT environment
variable provided by the hosting service is used.

## License
MIT
