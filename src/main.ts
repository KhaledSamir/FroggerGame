import { Engine } from './engine';

const scoreEl = document.getElementById('score');
if (!scoreEl) throw new Error('Score element not found');

new Engine(scoreEl);
