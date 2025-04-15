import seedrandom from 'seedrandom';

import { Goblin } from '../data/enemies/Goblin.js';
import { Snowman } from '../data/enemies/Snowman.js';
import { NightGlider } from '../data/enemies/NightGlider.js';
import { PipeSlime } from '../data/enemies/PipeSlime.js';
import { Cat } from '../data/enemies/Cat.js';
import { PortalTreader } from './enemies/PortalTreader.js';

const enemies = [Snowman, Goblin, NightGlider, PipeSlime, Cat, PipeSlime, PortalTreader];

export function get_random_enemy(seed) {
    const rng = seedrandom(seed);
    return enemies[Math.floor(rng() * enemies.length)];
}