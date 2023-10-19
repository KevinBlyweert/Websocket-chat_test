const { Server } = require('socket.io');

function createWSServer(server) {
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
        socket.emit('message_reception', messageObject);
      });
    });
    socket.on('new_message', (message) => {
      const response = { pseudo: socket.data.pseudo, message };
      io.emit('message_reception', response);
      addMessageToHistory(response);
    });
    // socket.on('mousemove', ({ X, Y }) => {
    //   io.emit('mouse_reception', {
    //     pseudo: socket.data.pseudo, id: socket.id, X, Y,
    //   });
    // });
    socket.on('moving', ({ X, Y }) => {
      io.emit('player_move', {
        pseudo: socket.data.pseudo, id: socket.id, X, Y,
      });
    });
    socket.on('disconnect', () => {
      socket.broadcast.emit('user-disconnected', socket.id);
    });
    // setInterval(() => {
    //   io.emit('time', Date.now());
    // }, 60000);
  });
}

module.exports = createWSServer;
