import weapons from '../data/weapons.js';
import seedrandom from 'seedrandom';

// generating random health by using the seed
function getRandomHealth(seed, min, max) {
    const rng = seedrandom(seed);
    const random = rng();
    return Math.floor(random * (max - min + 1)) + min;
}

const enemies = {
    goblin: (seed) => ({
        name: "Goblin",
        health: getRandomHealth(seed, 50, 100),
        weapon: weapons.dagger,
        spells: [],
        stats: {
            strength: 10,
            agility: 0,
            intelligence: 0,
        },
    }),

    jens: (seed) => ({
        name: "Jens",
        health: getRandomHealth(seed, 120, 150),
        weapon: weapons.dagger,
        spells: [],
        stats: {
            strength: 10,
            agility: 0,
            intelligence: 0,
        },
    }),

    megadraken: (seed) => ({
        name: "Megadraken",
        health: 200,
        weapon: weapons.dragon,
        spells: [],
        stats: {
            strength: 10,
            agility: 0,
            intelligence: 0,
        },
    }),
}

export default enemies;