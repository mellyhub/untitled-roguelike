import weapons from '../data/weapons.js';
import spells from "./spells.js"; 
import seedrandom from 'seedrandom';

import { Goblin } from '../data/enemies/Goblin.js';
import { Snowman } from '../data/enemies/Snowman.js';
import { NightGlider } from '../data/enemies/NightGlider.js';
import { PipeSlime } from '../data/enemies/PipeSlime.js';
import { Cat } from '../data/enemies/Cat.js';
import { PortalTreader } from './enemies/PortalTreader.js';

// fienden för varje runda väljs här
const enemies2 = [Snowman, Goblin, NightGlider, PipeSlime, Cat, PipeSlime, PortalTreader];

export function get_random_enemy(seed) {
    const rng = seedrandom(seed);
    return enemies2[Math.floor(rng() * enemies2.length)];
}

// generating random health by using the seed
function getRandomHealth(seed, min, max) {
    const rng = seedrandom(seed);
    const random = rng();
    return Math.floor(random * (max - min + 1)) + min;
}

// Generate random stats using the seed
function getRandomStat(seed, min, max) {
    const rng = seedrandom(seed);
    const random = rng();
    return Math.floor(random * (max - min + 1)) + min;
}

const enemies = {
    goblin: (seed, weight = 1) => ({
        name: "Goblin",
        health: getRandomHealth(seed, 50 * weight, 100 * weight),
        energy: 100,
        weapon: weapons.dagger,
        spells: [],
        stats: {
            strength: getRandomStat(seed, 5 * weight, 15 * weight),
            agility: getRandomStat(seed, 5 * weight, 15 * weight),
            intelligence: getRandomStat(seed, 0 * weight, 10 * weight),
        },
        class: { name: "Enemy" },
        image: 'src/assets/images/enemy-sprites/goblin-prototyp1.png'
    }),

    jens: (seed, weight = 1) => ({
        name: "Jens",
        health: getRandomHealth(seed, 120 * weight, 150 * weight),
        energy: 100,
        weapon: weapons.dagger,
        spells: [],
        stats: {
            strength: getRandomStat(seed, 10 * weight, 20 * weight),
            agility: getRandomStat(seed, 5 * weight, 15 * weight),
            intelligence: getRandomStat(seed, 5 * weight, 10 * weight),
        },
        class: { name: "Enemy" },
        image: 'src/assets/images/enemy-sprites/goblin-prototyp1.png'
    }),

    megadraken: (seed, weight = 1) => ({
        name: "Megadraken",
        health: 200 * weight,
        energy: 100,
        weapon: weapons.dragon,
        spells: [spells.fireball],
        stats: {
            strength: getRandomStat(seed, 15 * weight, 25 * weight),
            agility: getRandomStat(seed, 5 * weight, 10 * weight),
            intelligence: getRandomStat(seed, 10 * weight, 20 * weight),
        },
        class: { name: "Enemy" },
        image: 'src/assets/images/enemy-sprites/night-glider.png'
    }),

    snowman: (seed, weight = 1) => ({
        name: "Snowman",
        health: 200 * weight,
        energy: 100,
        weapon: weapons.dagger,
        spells: [],
        stats: {
            strength: getRandomStat(seed, 10 * weight, 20 * weight),
            agility: getRandomStat(seed, 10 * weight, 20 * weight),
            intelligence: getRandomStat(seed, 10 * weight, 20 * weight),
        },
        class: { name: "Enemy" },
        image: 'src/assets/images/enemy-sprites/night-glider.png'
    }),
}

export default enemies;