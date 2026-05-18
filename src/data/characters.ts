import { CharacterDefinition, CharacterType } from '../types';

export const CHARACTERS: CharacterDefinition[] = [
  {
    type: CharacterType.Princess,
    name: 'Princess',
    sprite: 'images/char-princess-girl.png',
    passiveLabel: 'Balanced — no special ability',
    passive: { speedMultiplier: 1, freeCollision: false, collisionReduction: 0, showEnemyPaths: false },
  },
  {
    type: CharacterType.Boy,
    name: 'Boy',
    sprite: 'images/char-boy.png',
    passiveLabel: 'Swift — moves 25% faster',
    passive: { speedMultiplier: 1.25, freeCollision: false, collisionReduction: 0, showEnemyPaths: false },
  },
  {
    type: CharacterType.CatGirl,
    name: 'Cat Girl',
    sprite: 'images/char-cat-girl.png',
    passiveLabel: 'Nine Lives — first collision per run is free',
    passive: { speedMultiplier: 1, freeCollision: true, collisionReduction: 0, showEnemyPaths: false },
  },
  {
    type: CharacterType.HornGirl,
    name: 'Horn Girl',
    sprite: 'images/char-horn-girl.png',
    passiveLabel: 'Foresight — enemy paths shown at start',
    passive: { speedMultiplier: 1, freeCollision: false, collisionReduction: 0, showEnemyPaths: true },
  },
  {
    type: CharacterType.PinkGirl,
    name: 'Pink Girl',
    sprite: 'images/char-pink-girl.png',
    passiveLabel: 'Agile — smaller collision hitbox',
    passive: { speedMultiplier: 1, freeCollision: false, collisionReduction: 10, showEnemyPaths: false },
  },
];
