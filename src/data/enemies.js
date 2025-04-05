import weapons from '../data/weapons.js';
import spells from "./spells.js"; 
import seedrandom from 'seedrandom';

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