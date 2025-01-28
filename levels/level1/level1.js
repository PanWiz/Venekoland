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

// Un array de monedas que estarán sobre las plataformas, una moneda por plataforma
const coins = platformCollisionBlocks.map(platform => {
  return new Coin({
    position: { x: platform.position.x + 2, y: platform.position.y - 16 },
    imageSrc: './img/warrior/mangopixel.png',
  });
});

const gravity = 0.12;

// Todo al respecto del jugador y sus png
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

// Agregar enemigos
const enemies = [
  new Enemy({
    position: { x: 500, y: 300 },
    collisionBlocks,
    platformCollisionBlocks,
    imageSrc: './img/Orc_Berserk/idle.png',
    frameRate: 5,
    player,
    speed: 1,
  }),
];

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
//
let coinCount = 0; // Contador de monedas
const totalCoins = coins.length; // El total de monedas disponibles

const levelGoal = totalCoins; // Número de monedas necesarias para ganar el nivel

let hearts = 3; // Cantidad inicial de corazones

// Cargar imágenes del HUD
const heartImage = new Image();
heartImage.src = '/img/images.png'; // Asegúrate de que la ruta sea correcta

const coinImage = new Image();
coinImage.src = '/img/mangopixel.png'; // Asegúrate de que la ruta sea correcta

// Función para verificar colisiones con un área reducida
function collision({ object1, object2, reduction = 1 }) {
  // Reducir el área de colisión (por ejemplo, al 50% del tamaño original)
  const object1Width = object1.width * reduction;
  const object1Height = object1.height * reduction;
  const object2Width = object2.width * reduction;
  const object2Height = object2.height * reduction;

  return (
    object1.position.x + object1Width >= object2.position.x &&
    object1.position.x <= object2.position.x + object2Width &&
    object1.position.y + object1Height >= object2.position.y &&
    object1.position.y <= object2.position.y + object2Height
  );
}

// Función para dibujar el contador de monedas
function drawCoinCounter() {
  const coinSize = 32; // Tamaño de la moneda (más grande)
  const padding = 10; // Espacio entre la moneda y el texto
  const startX = 20; // Posición inicial en X
  const startY = 80; // Posición inicial en Y

  c.drawImage(coinImage, startX, startY, coinSize, coinSize);
  c.fillStyle = 'white';
  c.font = '24px Arial';
  c.fillText(`${coinCount}/${levelGoal}`, startX + coinSize + padding, startY + coinSize - 10);
}

// Función para dibujar los corazones
function drawHearts() {
  const heartSize = 32; // Tamaño de cada corazón (más grande)
  const padding = 10; // Espacio entre corazones
  const startX = 20; // Posición inicial en X
  const startY = 20; // Posición inicial en Y

  for (let i = 0; i < hearts; i++) {
    c.drawImage(
      heartImage,
      startX + i * (heartSize + padding),
      startY,
      heartSize,
      heartSize
    );
  }
}

// Función para terminar el juego
function gameOver() {
  cancelAnimationFrame(animationId);
  alert('¡Has perdido! Inténtalo de nuevo.');
  window.location.reload();
}

// Función para mostrar el mensaje de "Ganaste"
function showWinMessage() {
  const winMessage = document.createElement("div");
  winMessage.style.position = "absolute";
  winMessage.style.top = "50%";
  winMessage.style.left = "50%";
  winMessage.style.transform = "translate(-50%, -50%)";
  winMessage.style.fontSize = "48px";
  winMessage.style.fontWeight = "bold";
  winMessage.style.color = "#FFFFFF";
  winMessage.style.textShadow = "2px 2px 4px #000000";
  winMessage.style.zIndex = 1000;
  winMessage.textContent = "You Win!";
  victoryAudio.play();
  document.body.appendChild(winMessage);

  // Activar el confeti
  tsParticles.load("tsparticles", {
    fullScreen: {
      enable: true,
      zIndex: 1,
    },
    emitters: {
      position: {
        x: 50,
        y: 100,
      },
      rate: {
        quantity: 10, // Aumentar la cantidad de partículas
        delay: 0.1, // Reducir el retraso entre partículas
      },
    },
    particles: {
      color: {
        value: ["#1E00FF", "#FF0061", "#E1FF00", "#00FF9E"],
      },
      move: {
        decay: 0.05,
        direction: "top",
        enable: true,
        gravity: {
          enable: true,
        },
        outModes: {
          top: "none",
          default: "destroy",
        },
        speed: {
          min: 100, // Aumentar la velocidad mínima
          max: 200, // Aumentar la velocidad máxima
        },
      },
      number: {
        value: 0,
      },
      opacity: {
        value: 1,
      },
      rotate: {
        value: {
          min: 0,
          max: 360,
        },
        direction: "random",
        animation: {
          enable: true,
          speed: 30,
        },
      },
      tilt: {
        direction: "random",
        enable: true,
        value: {
          min: 0,
          max: 360,
        },
        animation: {
          enable: true,
          speed: 30,
        },
      },
      
      size: {
        value: 10, // Aumentar el tamaño de las partículas
        animation: {
          enable: true,
          startValue: "min",
          count: 1,
          speed: 16,
          sync: true,
        },
      },
      roll: {
        darken: {
          enable: true,
          value: 25,
        },
        enlighten: {
          enable: true,
          value: 25,
        },
        enable: true,
        speed: {
          min: 5,
          max: 15,
        },
      },
      wobble: {
        distance: 30,
        enable: true,
        speed: {
          min: -7,
          max: 7,
        },
      },
      shape: {
        type: ["circle", "square"],
        options: {},
      },
    },
    responsive: [
      {
        maxWidth: 1024,
        options: {
          particles: {
            move: {
              speed: {
                min: 33,
                max: 66,
              },
            },
          },
        },
      },
    ],
  });

  // Esperar 3 segundos antes de redirigir al siguiente nivel
  setTimeout(() => {
    winMessage.remove();
    goToNextLevel();
  }, 3000);
}

// Función para pasar al siguiente nivel
function goToNextLevel() {
  cancelAnimationFrame(animationId);
  window.location.href = '/levels/level2/level2.html'; // Cambia la URL según tu estructura de niveles
}


// Función de animación
let animationId;
let isInvulnerable = false; // Estado de invulnerabilidad después de recibir daño
let invulnerabilityDuration = 1000; // Duración de la invulnerabilidad en milisegundos

function animate() {
  animationId = window.requestAnimationFrame(animate);
  c.fillStyle = 'white';
  c.fillRect(0, 0, canvas.width, canvas.height);

  c.save();
  c.scale(4, 4);
  c.translate(camera.position.x, camera.position.y);
  background.update();

  player.checkForHorizontalCanvasCollision();
  player.update();

  // Actualizar y dibujar enemigos
  enemies.forEach((enemy) => {
    enemy.update();

    // Verificar colisión entre el jugador y el enemigo con un área reducida
    if (!isInvulnerable && collision({ object1: player, object2: enemy, reduction: 0.3 })) {
      hearts -= 1; // Reducir un corazón
      damageAudio.currentTime = 0; // Reiniciar el sonido de daño
      damageAudio.play(); // Reproducir sonido de daño
      console.log(`Corazones restantes: ${hearts}`);

      // Activar estado de invulnerabilidad
      isInvulnerable = true;
      setTimeout(() => {
        isInvulnerable = false; // Desactivar invulnerabilidad después de un tiempo
      }, invulnerabilityDuration);

      if (hearts <= 0) {
        gameOver(); // Terminar el juego si no quedan corazones
      }
    }
  });

  // Verificar la colisión del jugador con las monedas
  coins.forEach(coin => {
    if (!coin.collected && collision({ object1: player, object2: coin })) {
      coin.collect();
      coinAudio.currentTime = 0;
      coinAudio.play();
      coinCount++;
      console.log(`Monedas recogidas: ${coinCount}`);
    }
    coin.update();
  });

  // Comprobar si el jugador ha recogido todas las monedas
if (coinCount >= levelGoal) {
  showWinMessage();
}

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

  c.restore();

  // Dibujar el contador de monedas y corazones
  drawCoinCounter();
  drawHearts();
}

// Asegurarse de que las imágenes estén cargadas antes de iniciar la animación
let imagesLoaded = 0;
const totalImages = 2; // Número total de imágenes que necesitas cargar

function checkIfAllImagesLoaded() {
  imagesLoaded++;
  if (imagesLoaded === totalImages) {
    animate(); // Iniciar la animación solo cuando todas las imágenes estén cargadas
  }
}

heartImage.onload = checkIfAllImagesLoaded;
coinImage.onload = checkIfAllImagesLoaded;

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
const damageAudio = CreateAudio('./audio/damage.mp3'); // Sonido de daño
const victoryAudio = CreateAudio('./audio/victory.mp3');

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
      if (player.velocity.y === 0) {
        JumpAudio.play();
        player.velocity.y = -4;
        RunAudioD.pause();
        RunAudioA.pause();
      }
      break;
    case ' ':
      if (player.velocity.y === 0) {
        DoubleJumpAudio.play();
        player.velocity.y = -4.5;
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
      RunAudioD.pause();
      break;
    case 'a':
      keys.a.pressed = false;
      RunAudioA.pause();
      break;
  }
});