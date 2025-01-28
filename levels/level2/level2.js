const canvas = document.querySelector('canvas');
const c = canvas.getContext('2d');

// Ajustar el canvas al tamaño completo de la ventana
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

// Mantener el tamaño escalado
const scaledCanvas = {
  width: canvas.width / 4,
  height: canvas.height / 4,
};

// Redibujar el canvas en caso de que la ventana cambie de tamaño
window.addEventListener('resize', () => {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;

  scaledCanvas.width = canvas.width / 4;
  scaledCanvas.height = canvas.height / 4;
});

// Código relacionado con las colisiones
const floorCollisions2D = [];
for (let i = 0; i < floorCollisions.length; i += 36) {
  floorCollisions2D.push(floorCollisions.slice(i, i + 36));
}

const collisionBlocks = [];
floorCollisions2D.forEach((row, y) => {
  row.forEach((symbol, x) => {
    if (symbol === 202) {
      collisionBlocks.push(
        new CollisionBlock({
          position: { x: x * 16, y: y * 16 },
        })
      );
    }
  });
});

const platformCollisions2D = [];
for (let i = 0; i < platformCollisions.length; i += 36) {
  platformCollisions2D.push(platformCollisions.slice(i, i + 36));
}

const platformCollisionBlocks = [];
platformCollisions2D.forEach((row, y) => {
  row.forEach((symbol, x) => {
    if (symbol === 202) {
      platformCollisionBlocks.push(
        new CollisionBlock({
          position: { x: x * 16, y: y * 16 },
          height: 4,
        })
      );
    }
  });
});

// un array de monedas que estarán sobre las plataformas, una moneda por plataforma
const coins = platformCollisionBlocks.map(platform => {
  return new Coin({
    position: { x: platform.position.x + 2, y: platform.position.y - 16 },
    imageSrc: './img/warrior/mangopixel.png' 
  });
});

const gravity = 0.12;

// todo al respecto del jugador y sus png
const player = new Player({
  position: { x: 100, y: 300 },
  collisionBlocks,
  platformCollisionBlocks,
  imageSrc: './img/warrior/Idle.png',
  frameRate: 8,
  animations: {
    Idle: { imageSrc: './img/warrior/Idle.png', frameRate: 8, frameBuffer: 10 },
    Run: { imageSrc: './img/warrior/Run.png', frameRate: 8, frameBuffer: 5 },
    Jump: { imageSrc: './img/warrior/Jump.png', frameRate: 2, frameBuffer: 10 },
    Fall: { imageSrc: './img/warrior/Fall.png', frameRate: 2, frameBuffer: 8 },
    FallLeft: { imageSrc: './img/warrior/FallLeft.png', frameRate: 2, frameBuffer: 8 },
    RunLeft: { imageSrc: './img/warrior/RunLeft.png', frameRate: 8, frameBuffer: 5 },
    IdleLeft: { imageSrc: './img/warrior/IdleLeft.png', frameRate: 8, frameBuffer: 10 },
    JumpLeft: { imageSrc: './img/warrior/JumpLeft.png', frameRate: 2, frameBuffer: 10 },
  },
});

const keys = {
  d: { pressed: false },
  a: { pressed: false },
  w: { pressed: false },
  space: { pressed: false },
};

const background = new Sprite({
  position: { x: 0, y: 0 },
  imageSrc: './img/background.png',
});

const backgroundImageHeight = 432;

const camera = {
  position: { x: 0, y: -backgroundImageHeight + scaledCanvas.height },
};

let coinCount = 0; // Contador de monedas

function drawCoinCounter() {
  c.fillStyle = 'black';
  c.font = '30px Arial';
  c.fillText(`Monedas: ${coinCount}`, 10, 30); // Mostrar el contador en la parte superior izquierda
}

// Función de animación
function animate() {
  window.requestAnimationFrame(animate);
  c.fillStyle = 'white';
  c.fillRect(0, 0, canvas.width, canvas.height);

  c.save();
  c.scale(4, 4); // escalado del canvas para pantallas
  c.translate(camera.position.x, camera.position.y);
  background.update();

  player.checkForHorizontalCanvasCollision();
  player.update();

  // Verificar la colisión del jugador con las monedas
  coins.forEach(coin => {
    if (!coin.collected && collision({ object1: player, object2: coin })) {
      coin.collect();
      coinAudio.currentTime = 0;
      coinAudio.play();
      coinCount++; //para incrementar las monedas
      console.log(`Monedas recogidas: ${coinCount}`);
    }
    // dibuja las monedas
    coin.update();
  });

  player.velocity.x = 0;
  if (keys.d.pressed) {
    player.switchSprite('Run');
    player.velocity.x = 2;
    player.lastDirection = 'right';
    player.shouldPanCameraToTheLeft({ canvas, camera });
  } else if (keys.a.pressed) {
    player.switchSprite('RunLeft');
    player.velocity.x = -2;
    player.lastDirection = 'left';
    player.shouldPanCameraToTheRight({ canvas, camera });
  } else if (player.velocity.y === 0) {
    if (player.lastDirection === 'right') player.switchSprite('Idle');
    else player.switchSprite('IdleLeft');
  }

  if (player.velocity.y < 0) {
    player.shouldPanCameraDown({ camera, canvas });
    if (player.lastDirection === 'right') player.switchSprite('Jump');
    else player.switchSprite('JumpLeft');
  } else if (player.velocity.y > 0) {
    player.shouldPanCameraUp({ camera, canvas });
    if (player.lastDirection === 'right') player.switchSprite('Fall');
    else player.switchSprite('FallLeft');
  }

  // dibuja el contador
  drawCoinCounter();
  c.restore();
}

animate();

// Función para crear sonidos
function CreateAudio(src) {
  const audio = new Audio(src);
  audio.load();
  return audio;
}

const RunAudioD = CreateAudio('./audio/Running.mp3');
const RunAudioA = CreateAudio('./audio/Running.mp3');
const JumpAudio = CreateAudio('./audio/Jumping.mp3');
const coinAudio = CreateAudio('./audio/coin.mp3');
const DoubleJumpAudio = CreateAudio('./audio/doublejump.mp3');

// Eventos de teclas
window.addEventListener('keydown', (event) => {
  switch (event.key) {
    case 'd':
      keys.d.pressed = true;
      RunAudioD.loop = true;
      RunAudioD.play();
      break;
    case 'a':
      keys.a.pressed = true;
      RunAudioA.loop = true;
      RunAudioA.play();
      break;
    case 'w':
      // da el salto corto si el jugador está en el suelo
      if (player.velocity.y === 0) {
        JumpAudio.play();
        player.velocity.y = -4;
        RunAudioD.pause();
        RunAudioA.pause();
      }
      break;
      case ' ':
        // Salto ligeramente más alto si el jugador está en el suelo
        if (player.velocity.y === 0) {
          DoubleJumpAudio.play();
          player.velocity.y = -4.5; // Ajustar la altura del salto
          RunAudioD.pause();
          RunAudioA.pause();
        }
        break;
  }
});

window.addEventListener('keyup', (event) => {
  switch (event.key) {
    case 'd':
      keys.d.pressed = false;
      RunAudioD.pause(); //pausa el audio cuando se deja de presionar
      break;
    case 'a':
      keys.a.pressed = false;
      RunAudioA.pause();
      break;
  }
});
