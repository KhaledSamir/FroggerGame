import { IEntity } from '../types';
import { Resources } from '../resources';

export class Enemy implements IEntity {
  x: number;
  y: number;

  private readonly speed: number;
  private readonly originX: number;
  private readonly canvasWidth: number;
  private readonly sprite = 'images/enemy-bug.png';

  constructor(x: number, y: number, speed: number, canvasWidth: number) {
    this.x = x;
    this.y = y;
    this.speed = speed;
    this.originX = x;
    this.canvasWidth = canvasWidth;
  }

  update(dt: number): void {
    this.x += this.speed * dt;
    if (this.x > this.canvasWidth + 50) {
      this.reset();
    }
  }

  render(ctx: CanvasRenderingContext2D): void {
    const img = Resources.get(this.sprite);
    if (img) ctx.drawImage(img, this.x, this.y);
  }

  private reset(): void {
    this.x = this.originX;
  }
}
