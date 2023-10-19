class Playground {
  constructor() {
    this.position = { x: 0, y: 0 };
    this.dimension = { width: canvas.width, height: canvas.height };
  }

  draw() {
    c.fillStyle = 'rgba(0,0,0,0)';
    c.fillRect(this.position.x, this.position.y, this.dimension.width, this.dimension.height);
  }

  update() {
    c.clearRect(this.position.x, this.position.y, this.dimension.width, this.dimension.height);
    this.draw();
  }
}
