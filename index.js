require('dotenv').config();
const debug = require('debug')('ws:server');
const path = require('path');
const { createServer } = require('node:http');
const express = require('express');
const { Server } = require('socket.io');

const port = process.env.PORT || 3000;

const app = express();
const server = createServer(app);
const io = new Server(server);

const messagesHistory = [];
const maxHistoryLength = 20;
function addMessageToHistory(messageObject) {
  messagesHistory.push(messageObject);
  if (messagesHistory.length > maxHistoryLength) {
    messagesHistory.shift();
  }
}
io.on('connection', (socket) => {
//   debug(`New user, id = ${socket.id}`);
  socket.on('pseudo', (pseudo) => {
    // eslint-disable-next-line no-param-reassign
    socket.data.pseudo = pseudo;
    messagesHistory.forEach((messageObject) => {
      socket.emit('message-received', messageObject);
    });
  });
  socket.on('new_message', (message) => {
    const response = { pseudo: socket.data.pseudo, message };
    io.emit('message_reception', response);
    addMessageToHistory(response);
  });
  socket.on('mousemove', ({ X, Y }) => {
    socket.broadcast.emit('mouse_reception', {
      pseudo: socket.data.pseudo, id: socket.id, X, Y,
    });
  });
  socket.on('disconnect', () => {
    socket.broadcast.emit('user-disconnected', socket.id);
  });
});

setInterval(() => {
  io.emit('time', Date.now());
}, 30_000);

app.use(express.static(path.join(__dirname, './public')));

server.listen(port, () => {
  debug(`Server ready: http://localhost:${port}`);
});
