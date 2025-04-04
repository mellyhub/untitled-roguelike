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
        energy: 100,
        weapon: weapons.dagger,
        spells: [],
        stats: {
            strength: 10,
            agility: 0,
            intelligence: 0,
        },
        image: 'src/assets/images/enemy-sprites/goblin-prototyp1.png'
    }),

    jens: (seed) => ({
        name: "Jens",
        health: getRandomHealth(seed, 120, 150),
        energy: 100,
        weapon: weapons.dagger,
        spells: [],
        stats: {
            strength: 1000,
            agility: 0,
            intelligence: 0,
        },
        image: 'src/assets/images/enemy-sprites/goblin-prototyp1.png'
    }),

    megadraken: (seed) => ({
        name: "Megadraken",
        health: 200,
        energy: 100,
        weapon: weapons.dragon,
        spells: [],
        stats: {
            strength: 10,
            agility: 0,
            intelligence: 0,
        },
        image: 'src/assets/images/enemy-sprites/night-glider.png'
    }),

    snowman: (seed) => ({
        name: "Snowman",
        health: 200,
        energy: 100,
        weapon: weapons.dagger,
        spells: [],
        stats: {
            strength: 20,
            agility: 20,
            intelligence: 20,
        },
        image: 'src/assets/images/enemy-sprites/night-glider.png'
    }),
}

export default enemies;