class CollisionBlock {
  constructor({ position, height = 16 }) {
    this.position = position;
    this.width = 16;
    this.height = height;
  }

  draw() {
    c.fillStyle = 'rgba(255, 0, 0, 0.5)';
    c.fillRect(this.position.x, this.position.y, this.width, this.height);
  }

  update() {
    this.draw();
  }
}

function collision({ object1, object2 }) {
  return (
    object1.position.y + object1.height >= object2.position.y &&
    object1.position.y <= object2.position.y + object2.height &&
    object1.position.x <= object2.position.x + object2.width &&
    object1.position.x + object1.width >= object2.position.x
  );
}

function platformCollision({ object1, object2 }) {
  return (
    object1.position.y + object1.height >= object2.position.y &&
    object1.position.y + object1.height <= object2.position.y + object2.height &&
    object1.position.x <= object2.position.x + object2.width &&
    object1.position.x + object1.width >= object2.position.x
  );
}

class Coin {
  constructor({ position }) {
    this.position = position;
    this.width = 16;  
    this.height = 16; 
    this.collected = false; 
    this.image = new Image(); 
    this.image.src = '/img/mangopixel.png'; 
  }

  draw() {
    if (!this.collected) {
      c.drawImage(
        this.image, 
        this.position.x, 
        this.position.y, 
        this.width, 
        this.height 
      );
    }
  }

  update() {
    this.draw();
  }

  collect() {
    this.collected = true;
  }
}