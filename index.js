require('dotenv').config();
const debug = require('debug')('ws:server');
const path = require('path');
const { createServer } = require('node:http');
const express = require('express');
const createWSServer = require('./app/websocket');

const port = process.env.PORT || 3000;

const app = express();
const server = createServer(app);
createWSServer(server);
app.use(express.static(path.join(__dirname, './public')));

server.listen(port, () => {
  debug(`Server ready: http://localhost:${port}`);
});
