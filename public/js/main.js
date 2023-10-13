const socket = io();

const chatForm = document.querySelector('form');
chatForm.addEventListener('submit', (event) => {
  event.preventDefault();
  const input = document.querySelector('#chatInput');
  const message = input.value;
  if (message) { socket.emit('new_message', message); }
  input.value = '';
});

socket.on('message_reception', ({ pseudo, message }) => {
  const p = document.createElement('p');
  p.textContent = `${pseudo} : ${message}`;
  document.querySelector('#chatMess').appendChild(p);
});

function getUserMouse(id) {
  return document.querySelector(`[data-id="${id}"]`);
}
function createUsermouse(pseudo, id) {
  const pointer = document.createElement('div');
  pointer.classsList.add('user-pointer');
  pointer.setAttribute('data-id', id);
  pointer.textContent = pseudo;
  document.body.appendChild(pointer);
  return pointer;
}

socket.on('mouse_reception', ({
  pseudo, id, X, Y,
}) => {
  let userMouse = getUserMouse(id);
  if (!userMouse) {
    userMouse = createUsermouse(pseudo, id);
  }
  console.log(X, Y);
  userMouse.style.left = `${X}px`;
  userMouse.style.top = `${Y}px`;
});

socket.on('user-disconnected', (id) => {
  const userMouse = getUserMouse(id);
  userMouse?.remove();
});

socket.on('time', (timestamp) => {
  const p = document.createElement('p');
  p.textContent = `Le serveur dit qu'il est ${new Date(timestamp)}`;
  const chat = document.querySelector('#chatMess');
  chat.appendChild(p);
});

const pseudo = prompt('Entrez votre pseudo:');
socket.emit('pseudo', pseudo);
document.body.addEventListener('mousemove', _.throttle(({ clientX, clientY }) => {
  socket.emit('mousemove', { X: clientX, Y: clientY });
}), 250, { leading: true, trailing: true });
