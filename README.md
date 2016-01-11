gwendoux.com -- personal website “API”
--------------------------------------

## Requirement

    * server with sudo user
    * node and npm install (nvm is highly recommended)
    * pm2 installed both on client and server

## Install

### User console

    * copy config.json.default to config.json
    * added correct value to config
    * npm install

    | script name | scripts called | pre | post | description |
    |-------------|----------------|-----|------|-------------|
    | lint        | eslint         |     |      | run linting service |
    | test        | mocha test/test.js | lint |     | run test and code coverage |
    | start       | node app.js    | lint |     | run application |
    | start:watch | nodemon |  |  | run application with nodemon watch |
    | deploy:setup | pm2 deploy ecosystem.json production setup | | | setup deployment on the distant machine |
    | deploy | pm2 deploy ecosystem.json production | | | deploy application |

### Server console

   * copy config.json.default to config.json
   * added correct value to config
   * configure nginx with config conf/nginx.conf
