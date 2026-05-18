import { Enemy } from './entities/enemy';
import { Player } from './entities/player';
import { Resources } from './resources';
import { CharacterDefinition } from './types';
import {
  CANVAS_WIDTH,
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
  'images/char-cat-girl.png',
  'images/char-horn-girl.png',
  'images/char-pink-girl.png',
  'images/char-princess-girl.png',
];

const ENEMY_PATH_DISPLAY_MS = 2500;

export class Engine {
  private readonly ctx: CanvasRenderingContext2D;
  private readonly scoreEl: HTMLElement;
  private readonly player: Player;
  private readonly enemies: Enemy[];
  private readonly character: CharacterDefinition;
  private lastTime = 0;
  private enemyPathsVisible = false;
  private enemyPathsTimer = 0;

  constructor(_canvas: HTMLCanvasElement, ctx: CanvasRenderingContext2D, scoreEl: HTMLElement, character: CharacterDefinition) {
    this.ctx = ctx;
    this.scoreEl = scoreEl;
    this.character = character;

    this.player = new Player(300, 400, character);
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

    if (this.character.passive.showEnemyPaths) {
      this.enemyPathsVisible = true;
      this.enemyPathsTimer = ENEMY_PATH_DISPLAY_MS;
    }

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

    if (this.enemyPathsVisible) {
      this.enemyPathsTimer -= dt * 1000;
      if (this.enemyPathsTimer <= 0) this.enemyPathsVisible = false;
    }
  }

  private checkCollisions(): void {
    const threshold = COLLISION_THRESHOLD - this.player.collisionReduction;
    for (const enemy of this.enemies) {
      const dx = enemy.x - this.player.x;
      const dy = enemy.y - this.player.y;
      if (Math.sqrt(dx * dx + dy * dy) < threshold) {
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

    if (this.enemyPathsVisible) {
      this.renderEnemyPaths();
    }

    this.enemies.forEach((e) => e.render(this.ctx));
    this.player.render(this.ctx);
  }

  private renderEnemyPaths(): void {
    const alpha = Math.min(1, this.enemyPathsTimer / 500);
    this.ctx.save();
    this.ctx.globalAlpha = alpha * 0.5;
    this.ctx.strokeStyle = '#ff4444';
    this.ctx.lineWidth = 3;
    this.ctx.setLineDash([8, 6]);

    for (const enemy of this.enemies) {
      this.ctx.beginPath();
      this.ctx.moveTo(enemy.x + 50, enemy.y + 40);
      this.ctx.lineTo(CANVAS_WIDTH + 50, enemy.y + 40);
      this.ctx.stroke();

      this.ctx.fillStyle = '#ff4444';
      this.ctx.font = 'bold 18px Arial';
      this.ctx.fillText('→', CANVAS_WIDTH - 30, enemy.y + 46);
    }

    this.ctx.restore();
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
