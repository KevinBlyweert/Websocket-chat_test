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
      if (player.velocity.y === 0 && player.jump === true) {
        player.velocity.y = -20;
        player.jump = false;
      }
      break;
      // case 'ArrowDown': case 'KeyS':
      //   player.velocity.y = 0;
      //   break;
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
