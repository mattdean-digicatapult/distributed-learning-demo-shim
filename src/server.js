const express = require('express');
const bodyParser = require('body-parser');

const makeServer = () => {
  const app = express();
  app.use(bodyParser.json());
  return app
}

module.exports = makeServer
