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

export enum CharacterType {
  Princess = 'princess',
  Boy = 'boy',
  CatGirl = 'cat-girl',
  HornGirl = 'horn-girl',
  PinkGirl = 'pink-girl',
}

export interface CharacterPassive {
  speedMultiplier: number;
  freeCollision: boolean;
  collisionReduction: number;
  showEnemyPaths: boolean;
}

export interface CharacterDefinition {
  type: CharacterType;
  name: string;
  sprite: string;
  passiveLabel: string;
  passive: CharacterPassive;
}
