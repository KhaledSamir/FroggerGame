import { CharacterDefinition, CharacterType } from '../types';
import { Resources } from '../resources';
import { CHARACTERS } from '../data/characters';
import { CANVAS_WIDTH, CANVAS_HEIGHT, TILE_WIDTH } from '../constants';

const SPRITE_URLS = CHARACTERS.map((c) => c.sprite);
SPRITE_URLS.push('images/Selector.png');

const CHAR_Y = 260;
const SELECTOR_Y = CHAR_Y - 10;
const SLOT_WIDTH = TILE_WIDTH; // 101px — exactly matches tile grid

export class CharacterSelect {
  private readonly canvas: HTMLCanvasElement;
  private readonly ctx: CanvasRenderingContext2D;
  private selectedIndex = 0;
  private onConfirm: (character: CharacterDefinition) => void;
  private keyHandler: (e: KeyboardEvent) => void;
  private clickHandler: (e: MouseEvent) => void;
  private animFrame = 0;
  private rafId = 0;

  constructor(canvas: HTMLCanvasElement, ctx: CanvasRenderingContext2D, onConfirm: (character: CharacterDefinition) => void) {
    this.canvas = canvas;
    this.ctx = ctx;
    this.onConfirm = onConfirm;

    this.keyHandler = (e: KeyboardEvent) => this.handleKey(e);
    this.clickHandler = (e: MouseEvent) => this.handleClick(e);

    document.addEventListener('keyup', this.keyHandler);
    this.canvas.addEventListener('click', this.clickHandler);

    Resources.load(SPRITE_URLS);
    Resources.onReady(() => this.startLoop());
  }

  private startLoop(): void {
    const loop = () => {
      this.animFrame++;
      this.render();
      this.rafId = requestAnimationFrame(loop);
    };
    this.rafId = requestAnimationFrame(loop);
  }

  private render(): void {
    const ctx = this.ctx;

    // Background gradient
    const grad = ctx.createLinearGradient(0, 0, 0, CANVAS_HEIGHT);
    grad.addColorStop(0, '#1a1a2e');
    grad.addColorStop(1, '#16213e');
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);

    // Title
    ctx.textAlign = 'center';
    ctx.fillStyle = '#ffd700';
    ctx.font = 'bold 28px Arial';
    ctx.fillText('Choose Your Character', CANVAS_WIDTH / 2, 80);

    ctx.fillStyle = 'rgba(255,255,255,0.5)';
    ctx.font = '14px Arial';
    ctx.fillText('← → to browse   •   Enter or click to start', CANVAS_WIDTH / 2, 110);

    // Character slots
    CHARACTERS.forEach((char, i) => {
      const x = i * SLOT_WIDTH + SLOT_WIDTH / 2;

      // Hover glow for selected
      if (i === this.selectedIndex) {
        const pulse = 0.6 + 0.4 * Math.sin(this.animFrame * 0.08);
        ctx.save();
        ctx.shadowColor = '#ffd700';
        ctx.shadowBlur = 20 * pulse;
        ctx.fillStyle = `rgba(255, 215, 0, ${0.15 * pulse})`;
        ctx.fillRect(i * SLOT_WIDTH, CHAR_Y - 20, SLOT_WIDTH, 120);
        ctx.restore();

        // Selector sprite
        const selector = Resources.get('images/Selector.png');
        if (selector) {
          ctx.drawImage(selector, i * SLOT_WIDTH, SELECTOR_Y);
        }
      }

      // Character sprite
      const img = Resources.get(char.sprite);
      if (img) {
        ctx.drawImage(img, i * SLOT_WIDTH, CHAR_Y);
      }

      // Character name below sprite
      ctx.fillStyle = i === this.selectedIndex ? '#ffd700' : 'rgba(255,255,255,0.6)';
      ctx.font = i === this.selectedIndex ? 'bold 13px Arial' : '12px Arial';
      ctx.textAlign = 'center';
      ctx.fillText(char.name, x, CHAR_Y + 105);
    });

    // Passive description panel for selected character
    const selected = CHARACTERS[this.selectedIndex];
    const panelY = CANVAS_HEIGHT - 140;

    ctx.fillStyle = 'rgba(255,255,255,0.08)';
    ctx.beginPath();
    ctx.roundRect(20, panelY, CANVAS_WIDTH - 40, 80, 10);
    ctx.fill();

    ctx.fillStyle = '#ffd700';
    ctx.font = 'bold 15px Arial';
    ctx.textAlign = 'center';
    ctx.fillText(selected.name, CANVAS_WIDTH / 2, panelY + 26);

    ctx.fillStyle = 'rgba(255,255,255,0.85)';
    ctx.font = '13px Arial';
    ctx.fillText(selected.passiveLabel, CANVAS_WIDTH / 2, panelY + 50);

    // Start button
    const btnY = CANVAS_HEIGHT - 46;
    const btnW = 160;
    const btnX = (CANVAS_WIDTH - btnW) / 2;
    const pulse = 0.85 + 0.15 * Math.sin(this.animFrame * 0.06);

    ctx.fillStyle = `rgba(255, 215, 0, ${pulse})`;
    ctx.beginPath();
    ctx.roundRect(btnX, btnY, btnW, 34, 8);
    ctx.fill();

    ctx.fillStyle = '#1a1a2e';
    ctx.font = 'bold 15px Arial';
    ctx.textAlign = 'center';
    ctx.fillText('▶  Start Game', CANVAS_WIDTH / 2, btnY + 22);
  }

  private handleKey(e: KeyboardEvent): void {
    if (e.key === 'ArrowLeft' || e.keyCode === 37) {
      this.selectedIndex = (this.selectedIndex - 1 + CHARACTERS.length) % CHARACTERS.length;
    } else if (e.key === 'ArrowRight' || e.keyCode === 39) {
      this.selectedIndex = (this.selectedIndex + 1) % CHARACTERS.length;
    } else if (e.key === 'Enter' || e.key === ' ') {
      this.confirm();
    }
  }

  private handleClick(e: MouseEvent): void {
    const rect = this.canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    // Click on a character slot
    const col = Math.floor(x / SLOT_WIDTH);
    if (col >= 0 && col < CHARACTERS.length && y >= CHAR_Y - 20 && y <= CHAR_Y + 115) {
      if (col === this.selectedIndex) {
        this.confirm();
      } else {
        this.selectedIndex = col;
      }
      return;
    }

    // Click on Start button
    const btnY = CANVAS_HEIGHT - 46;
    const btnW = 160;
    const btnX = (CANVAS_WIDTH - btnW) / 2;
    if (x >= btnX && x <= btnX + btnW && y >= btnY && y <= btnY + 34) {
      this.confirm();
    }
  }

  private confirm(): void {
    this.destroy();
    this.onConfirm(CHARACTERS[this.selectedIndex]);
  }

  destroy(): void {
    cancelAnimationFrame(this.rafId);
    document.removeEventListener('keyup', this.keyHandler);
    this.canvas.removeEventListener('click', this.clickHandler);
  }

  getSelectedType(): CharacterType {
    return CHARACTERS[this.selectedIndex].type;
  }
}
