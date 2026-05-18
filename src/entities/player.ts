import { IEntity, Direction } from '../types';
import { Resources } from '../resources';
import { CANVAS_WIDTH, CANVAS_HEIGHT } from '../constants';

export class Player implements IEntity {
  x: number;
  y: number;
  score = 0;

  private readonly originX: number;
  private readonly originY: number;
  private readonly sprite = 'images/char-princess-girl.png';

  constructor(x: number, y: number) {
    this.x = x;
    this.y = y;
    this.originX = x;
    this.originY = y;
  }

  update(_dt: number): void {
    if (this.y < 0) {
      this.reset(false);
    }
  }

  render(ctx: CanvasRenderingContext2D): void {
    const img = Resources.get(this.sprite);
    if (img) ctx.drawImage(img, this.x, this.y);
  }

  handleInput(key: Direction): void {
    switch (key) {
      case Direction.Left:
        if (this.x - 80 > 0) this.x -= 100;
        break;
      case Direction.Right:
        if (CANVAS_WIDTH - this.x > 200) this.x += 100;
        break;
      case Direction.Up:
        this.y -= 90;
        break;
      case Direction.Down:
        if (CANVAS_HEIGHT - this.y > 210) this.y += 90;
        break;
    }
  }

  reset(collision: boolean): void {
    this.x = this.originX;
    this.y = this.originY;
    this.score += collision ? -5 : 5;
  }
}
