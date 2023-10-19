class Player {
  constructor({ collisionBlocks = [] }) {
    this.position = { x: 0, y: 0 };
    this.dimension = { width: 16, height: 16 };
    this.velocity = { x: 0, y: 0 };
    this.sides = {
      top: this.position.y,
      bottom: this.position.y + this.dimension.height,
      left: this.position.x,
      right: this.position.x + this.dimension.width,
    };
    this.gravity = 2;
    this.collisionBlocks = collisionBlocks;
  }

  draw() {
    c.fillStyle = 'red';
    c.fillRect(this.position.x, this.position.y, this.dimension.width, this.dimension.height);
  }

  update() {
    this.position.x += this.velocity.x;
    this.position.y += this.velocity.y;
    this.sides.bottom = this.position.y + this.dimension.height;
    this.sides.top = this.position.y;
    this.sides.left = this.position.x;
    this.sides.right = this.position.x + this.dimension.width;
    for (let i = 0; i < this.collisionBlocks.length; i++) {
      const collisionBlock = this.collisionBlocks[i];
      if (this.sides.left < collisionBlock.position.x + collisionBlock.dimension.width
        && this.sides.right > collisionBlock.position.x
        && this.sides.bottom >= collisionBlock.position.y
        && this.sides.top <= collisionBlock.position.y + collisionBlock.dimension.height) {
        if (this.velocity.x < 0) {
          this.position.x = collisionBlock.position.x + collisionBlock.dimension.width + 0.01;
          break;
        }
        if (this.velocity.x > 0) {
          this.position.x = collisionBlock.position.x - this.dimension.width - 0.01;
          break;
        }
      }
    }
    this.velocity.y += this.gravity;
    this.position.y += this.velocity.y;
    this.sides.bottom = this.position.y + this.dimension.height;
    this.sides.top = this.position.y;
    this.sides.left = this.position.x;
    this.sides.right = this.position.x + this.dimension.width;
    for (let i = 0; i < this.collisionBlocks.length; i++) {
      const collisionBlock = this.collisionBlocks[i];

      if (this.sides.left <= collisionBlock.position.x + collisionBlock.dimension.width
        && this.sides.right >= collisionBlock.position.x
        && this.sides.bottom > collisionBlock.position.y
        && this.sides.top < collisionBlock.position.y + collisionBlock.dimension.height) {
        if (this.velocity.y < 0) {
          this.velocity.y = 0;
          this.position.y = collisionBlock.position.y + collisionBlock.dimension.height + 0.01;
          break;
        }
        if (this.velocity.y > 0) {
          this.velocity.y = 0;
          this.position.y = collisionBlock.position.y - this.dimension.height - 0.01;
          break;
        }
      }
    }
    this.sides.bottom = this.position.y + this.dimension.height;
    this.sides.top = this.position.y;
    this.sides.left = this.position.x;
    this.sides.right = this.position.x + this.dimension.width;
    if (this.sides.left + this.velocity.x < 0) { this.velocity.x = 0; this.position.x = 0; }
    if (this.sides.right + this.velocity.x > canvas.width) {
      this.velocity.x = 0;
      this.position.x = canvas.width - this.dimension.width;
    }

    this.draw();
  }
}
