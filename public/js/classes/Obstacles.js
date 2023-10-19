class Obstacles {
  constructor({
    x, y, width, height,
  }) {
    this.position = {
      x, y,
    };
    this.dimension = {
      width, height,
    };
  }

  draw() {
    c.fillStyle = 'red';
    c.fillRect(this.position.x, this.position.y, this.dimension.width, this.dimension.height);
  }
}
