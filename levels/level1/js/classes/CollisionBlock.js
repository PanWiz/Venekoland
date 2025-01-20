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
    this.collected = false; // Para saber si la moneda ha sido recogida
  }

  draw() {
    if (!this.collected) {
      c.fillStyle = 'yellow';
      c.beginPath();
      c.arc(this.position.x + this.width / 2, this.position.y + this.height / 2, this.width / 2, 0, Math.PI * 2);
      c.fill();
    }
  }

  update() {
    this.draw();
  }

  collect() {
    this.collected = true;
  }
}