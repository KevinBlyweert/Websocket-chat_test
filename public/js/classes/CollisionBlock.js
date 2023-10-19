class CollisionBlock {
  constructor({ position }) {
    this.position = position;
    this.dimension = { width: 16, height: 16 };
  }

  draw() {
    c.fillRect(this.position.x, this.position.y, this.dimension.width, this.dimension.height);
  }
}
