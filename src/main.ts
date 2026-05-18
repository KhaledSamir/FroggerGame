import { Engine } from './engine';
import { CharacterSelect } from './ui/characterSelect';
import { CharacterDefinition } from './types';
import { CANVAS_WIDTH, CANVAS_HEIGHT } from './constants';

const scoreEl = document.getElementById('score');
if (!scoreEl) throw new Error('Score element not found');

const canvas = document.createElement('canvas');
canvas.width = CANVAS_WIDTH;
canvas.height = CANVAS_HEIGHT;
document.body.appendChild(canvas);

const ctx = canvas.getContext('2d');
if (!ctx) throw new Error('Failed to get 2D context');

function startGame(character: CharacterDefinition): void {
  scoreEl!.textContent = '0';
  new Engine(canvas, ctx!, scoreEl!, character);
}

new CharacterSelect(canvas, ctx, (character: CharacterDefinition) => {
  startGame(character);
});
