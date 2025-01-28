class Enemy extends Sprite {
    constructor({ position, imageSrc, frameRate, frameBuffer, scale = 1, collisionBlocks }) {
      super({
        position,
        imageSrc,
        frameRate,
        frameBuffer,
        scale,
      });
      this.velocity = { x: 0, y: 0 };
      this.collisionBlocks = collisionBlocks;
      this.hitbox = {
        position: { x: this.position.x, y: this.position.y },
        width: 10,
        height: 10,
      };
    }
  
    move() {
      this.position.x += this.velocity.x;
      this.position.y += this.velocity.y;
      this.updateHitbox();
    }
  
    updateHitbox() {
      this.hitbox = {
        position: {
          x: this.position.x + 35, // Ajusta según el enemigo
          y: this.position.y + 26,
        },
        width: 14,
        height: 27,
      };
    }
  
    // Método para hacer que el enemigo ataque
    attack(player) {
      if (collision({ object1: this.hitbox, object2: player.hitbox })) {
        console.log('¡El enemigo ha golpeado al jugador!');
        // Aquí podrías restar vida al jugador o hacer alguna otra acción
      }
    }
  
    update() {
      this.updateFrames();
      this.draw();
      this.move();
    }
  }
  
  // Función de colisión para detectar cuando los objetos se tocan
  function collision({ object1, object2 }) {
    return (
      object1.position.x + object1.width >= object2.position.x &&
      object1.position.x <= object2.position.x + object2.width &&
      object1.position.y + object1.height >= object2.position.y &&
      object1.position.y <= object2.position.y + object2.height
    );
  }
  