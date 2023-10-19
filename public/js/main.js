// import Sprite from './classes/Sprite.js';
// import Player from './classes/Player.js';
// import Playground from './classes/Playground.js';

let start = '';

const socket = io();
let myPseudo = '';
const keys = {
  rightPress: false,
  leftPress: false,
  upPress: false,
};

while (!myPseudo) {
  myPseudo = prompt('Entrez votre pseudo:');
}

canvas.width = document.querySelector('#playground').offsetWidth;
canvas.height = document.querySelector('#playground').offsetHeight;

const player = new Player({ collisionBlocks });
const playground = new Playground();

function animate() {
  window.requestAnimationFrame(animate);
  if (!start) {
    player.position.y = (playground.dimension.height * 2) / 3;
    player.position.x = playground.dimension.width / 2;
    start = 'init';
  }
  playground.update();
  collisionBlocks.forEach((collisionBlock) => collisionBlock.draw());
  player.velocity.x = 0;
  if (keys.rightPress) player.velocity.x = 5;
  else if (keys.leftPress) player.velocity.x = -5;
  player.update();
  const time = document.querySelector('#time');
  time.textContent = new Date(Date.now()).toUTCString();
}

animate();

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
  p.scrollIntoView({ behavior: 'smooth' });
});

function getUserAvatar(id) {
  return document.querySelector(`[data-id="${id}"]`);
}
function createUserAvatar(pseudo, id) {
  const avatar = document.createElement('div');
  avatar.classList.add('user-avatar');
  avatar.setAttribute('data-id', id);
  avatar.setAttribute('position', 'absolute');
  document.querySelector('#game').appendChild(avatar);
  return avatar;
}

// socket.on('mouse_reception', ({
//   pseudo, id, X, Y,
// }) => {
//   let userMouse = getUserAvatar(id);
//   if (!userMouse) {
//     userMouse = createUserAvatar(pseudo, id);
//   }
//   // console.log(X, Y);
//   userMouse.style.left = `${X}px`;
//   userMouse.style.top = `${Y}px`;
// });
socket.on('player_move', ({
  pseudo, id, X, Y,
}) => {
  let userAvatar = getUserAvatar(id);
  if (!userAvatar) {
    userAvatar = createUserAvatar(pseudo, id);
  }
  // console.log(X, Y);
  userAvatar.style.left = `calc(${X}px + 20px)`;
  userAvatar.style.top = `calc(${Y}px + 10vh)`;
  userAvatar.replaceChildren();
  const avatarPseudo = document.createElement('p');
  avatarPseudo.textContent = pseudo;
  userAvatar.appendChild(avatarPseudo);
});

socket.on('user-disconnected', (id) => {
  const userAvatar = getUserAvatar(id);
  userAvatar?.remove();
});

socket.emit('pseudo', myPseudo);
document.body.addEventListener('keydown', _.throttle(() => {
  socket.emit('moving', { X: player.position.x, Y: player.position.y });
}), 250, { leading: true, trailing: true });

function keyDownHandler({ code }) {
  if (code === 'ArrowRight') {
    keys.rightPress = true;
  } else if (code === 'ArrowLeft') {
    keys.leftPress = true;
  }
  switch (code) {
    case 'ArrowRight': case 'KeyD':
      keys.rightPress = true;
      break;
    case 'ArrowLeft': case 'KeyA':
      keys.leftPress = true;
      break;
    case 'ArrowUp': case 'KeyW':
      if (player.velocity.y === 0) {
        player.velocity.y = -15;
      }
      break;
    default:
      break;
  }
}
function keyUpHandler({ code }) {
  if (code === 'ArrowRight') {
    keys.rightPress = false;
  } else if (code === 'ArrowLeft') {
    keys.leftPress = false;
  }
  switch (code) {
    case 'ArrowRight': case 'KeyD':
      keys.rightPress = false;
      break;
    case 'ArrowLeft': case 'KeyA':
      keys.leftPress = false;
      break;
    default:
      break;
  }
}

window.addEventListener('keydown', keyDownHandler, false);
window.addEventListener('keyup', keyUpHandler, false);
