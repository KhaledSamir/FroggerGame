export interface IEntity {
  update(dt: number): void;
  render(ctx: CanvasRenderingContext2D): void;
}

export enum Direction {
  Left = 'left',
  Right = 'right',
  Up = 'up',
  Down = 'down',
}
