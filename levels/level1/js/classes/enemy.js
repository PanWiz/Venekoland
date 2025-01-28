class Enemy extends Sprite {
  constructor({
    position,
    collisionBlocks,
    platformCollisionBlocks,
    imageSrc,
    frameRate,
    scale = 0.5,
    player,
    speed = 1,
    jumpHeight = -3.5,
  }) {
    super({ imageSrc, frameRate, scale });
    this.position = position;
    this.velocity = {
      x: 0,
      y: 1,
    };

    this.collisionBlocks = collisionBlocks;
    this.platformCollisionBlocks = platformCollisionBlocks;
    this.player = player;
    this.speed = speed;
    this.jumpHeight = jumpHeight;
    this.hitbox = {
      position: {
        x: this.position.x,
        y: this.position.y,
      },
      width: 10,
      height: 10,
    };

    this.camerabox = {
      position: {
        x: this.position.x,
        y: this.position.y,
      },
      width: 200,
      height: 80,
    };

    // Cargar el sonido de pasos
    this.stepSound = new Audio('./audio/Running.mp3');
    this.stepSound.volume = 0.3; // Ajusta el volumen si es necesario
    this.isMoving = false;
    this.stepSound.loop = true; // Hacer que el sonido se repita en bucle
  }

  updateCamerabox() {
    this.camerabox = {
      position: {
        x: this.position.x - 50,
        y: this.position.y,
      },
      width: 200,
      height: 80,
    };
  }

  update() {
    this.updateFrames();
    this.updateHitbox();
    this.updateCamerabox();
    this.draw();
    this.followPlayer();
    this.position.x += this.velocity.x;
    this.position.y += this.velocity.y;
    this.updateHitbox();
    this.checkForHorizontalCollisions();
    this.applyGravity();
    this.updateHitbox();
    this.checkForVerticalCollisions();

    // Reproducir el sonido de pasos si el enemigo se está moviendo
    if (this.velocity.x !== 0 && !this.isMoving) {
      this.isMoving = true;
      this.stepSound.play().catch(error => {
        console.log("La reproducción automática del sonido fue bloqueada. Interactúa con la página para habilitar el sonido.");
      });
    } else if (this.velocity.x === 0 && this.isMoving) {
      this.isMoving = false;
      this.stepSound.pause();
    }
  }

  updateHitbox() {
    this.hitbox = {
      position: {
        x: this.position.x + 35,
        y: this.position.y + 26,
      },
      width: 14,
      height: 27,
    };
  }

  followPlayer() {
    const distanceX = this.player.position.x - this.position.x;
    const distanceY = this.player.position.y - this.position.y;

    if (Math.abs(distanceX) > 5) {
      this.velocity.x = this.speed * Math.sign(distanceX);
    } else {
      this.velocity.x = 0;
    }

    // Hacer que el enemigo salte solo cuando la diferencia en Y es significativa
    if (distanceY < -10 && this.isOnGround()) {
      this.velocity.y = this.jumpHeight;
    }
  }

  isOnGround() {
    return this.velocity.y === 0;
  }

  checkForHorizontalCollisions() {
    for (let i = 0; i < this.collisionBlocks.length; i++) {
      const collisionBlock = this.collisionBlocks[i];

      if (
        collision({
          object1: this.hitbox,
          object2: collisionBlock,
        })
      ) {
        if (this.velocity.x > 0) {
          this.velocity.x = 0;

          const offset =
            this.hitbox.position.x - this.position.x + this.hitbox.width;

          this.position.x = collisionBlock.position.x - offset - 0.01;
          break;
        }

        if (this.velocity.x < 0) {
          this.velocity.x = 0;

          const offset = this.hitbox.position.x - this.position.x;

          this.position.x =
            collisionBlock.position.x + collisionBlock.width - offset + 0.01;
          break;
        }
      }
    }
  }

  applyGravity() {
    this.velocity.y += gravity;
    this.position.y += this.velocity.y;
  }

  checkForVerticalCollisions() {
    for (let i = 0; i < this.collisionBlocks.length; i++) {
      const collisionBlock = this.collisionBlocks[i];

      if (
        collision({
          object1: this.hitbox,
          object2: collisionBlock,
        })
      ) {
        if (this.velocity.y > 0) {
          this.velocity.y = 0;

          const offset =
            this.hitbox.position.y - this.position.y + this.hitbox.height;

          this.position.y = collisionBlock.position.y - offset - 0.01;
          break;
        }

        if (this.velocity.y < 0) {
          this.velocity.y = 0;

          const offset = this.hitbox.position.y - this.position.y;

          this.position.y =
            collisionBlock.position.y + collisionBlock.height - offset + 0.01;
          break;
        }
      }
    }

    // colisión de bloques de plataforma
    for (let i = 0; i < this.platformCollisionBlocks.length; i++) {
      const platformCollisionBlock = this.platformCollisionBlocks[i];

      if (
        platformCollision({
          object1: this.hitbox,
          object2: platformCollisionBlock,
        })
      ) {
        if (this.velocity.y > 0) {
          this.velocity.y = 0;

          const offset =
            this.hitbox.position.y - this.position.y + this.hitbox.height;

          this.position.y = platformCollisionBlock.position.y - offset - 0.01;
          break;
        }
      }
    }
  }
}
