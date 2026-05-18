import { Enemy } from './entities/enemy';
import { Player } from './entities/player';
import { Resources } from './resources';
import {
  CANVAS_WIDTH,
  CANVAS_HEIGHT,
  TILE_WIDTH,
  TILE_HEIGHT,
  NUM_ROWS,
  NUM_COLS,
  COLLISION_THRESHOLD,
} from './constants';

const ROW_IMAGES = [
  'images/water-block.png',
  'images/stone-block.png',
  'images/stone-block.png',
  'images/stone-block.png',
  'images/grass-block.png',
  'images/grass-block.png',
];

const SPRITE_URLS = [
  'images/stone-block.png',
  'images/water-block.png',
  'images/grass-block.png',
  'images/enemy-bug.png',
  'images/char-boy.png',
  'images/char-princess-girl.png',
];

export class Engine {
  private readonly canvas: HTMLCanvasElement;
  private readonly ctx: CanvasRenderingContext2D;
  private readonly scoreEl: HTMLElement;
  private readonly player: Player;
  private readonly enemies: Enemy[];
  private lastTime = 0;

  constructor(scoreEl: HTMLElement) {
    this.scoreEl = scoreEl;
    this.canvas = document.createElement('canvas');
    this.canvas.width = CANVAS_WIDTH;
    this.canvas.height = CANVAS_HEIGHT;
    document.body.appendChild(this.canvas);

    const ctx = this.canvas.getContext('2d');
    if (!ctx) throw new Error('Failed to get 2D context');
    this.ctx = ctx;

    this.player = new Player(300, 400);
    this.enemies = this.createEnemies();

    document.addEventListener('keyup', (e) => this.handleKey(e));

    Resources.load(SPRITE_URLS);
    Resources.onReady(() => this.init());
  }

  private createEnemies(): Enemy[] {
    const enemies: Enemy[] = [];
    for (let y = 50; y <= 220; y += 85) {
      enemies.push(new Enemy(-50, y, y * 2, CANVAS_WIDTH));
    }
    return enemies;
  }

  private init(): void {
    this.player.score = 0;
    this.scoreEl.textContent = '0';
    this.lastTime = Date.now();
    this.main();
  }

  private main(): void {
    const now = Date.now();
    const dt = (now - this.lastTime) / 1000;
    this.lastTime = now;

    this.update(dt);
    this.render();

    window.requestAnimationFrame(() => this.main());
  }

  private update(dt: number): void {
    this.enemies.forEach((e) => e.update(dt));
    this.player.update(dt);
    this.checkCollisions();
    this.scoreEl.textContent = String(this.player.score);
  }

  private checkCollisions(): void {
    for (const enemy of this.enemies) {
      const dx = enemy.x - this.player.x;
      const dy = enemy.y - this.player.y;
      if (Math.sqrt(dx * dx + dy * dy) < COLLISION_THRESHOLD) {
        this.player.reset(true);
        return;
      }
    }
  }

  private render(): void {
    for (let row = 0; row < NUM_ROWS; row++) {
      for (let col = 0; col < NUM_COLS; col++) {
        const img = Resources.get(ROW_IMAGES[row]);
        if (img) this.ctx.drawImage(img, col * TILE_WIDTH, row * TILE_HEIGHT);
      }
    }

    this.enemies.forEach((e) => e.render(this.ctx));
    this.player.render(this.ctx);
  }

  private handleKey(e: KeyboardEvent): void {
    const keyMap: Record<number, string> = {
      37: 'left',
      38: 'up',
      39: 'right',
      40: 'down',
    };
    const dir = keyMap[e.keyCode];
    if (dir) this.player.handleInput(dir as import('./types').Direction);
  }
}
