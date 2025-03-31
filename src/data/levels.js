import weapons from '../data/weapons.js';
import seedrandom from 'seedrandom';

function getRandomHealth(seed, min, max) {
    const rng = seedrandom(seed);
    const random = rng();
    return Math.floor(random * (max - min + 1)) + min;
}

// hårdkodat seed
//const seed = "hora";

// genererar ett seed baserat på nuvarande tid
const seed = String(Date.now());
console.log(`Seed: ${seed}`);


// hårdkodade levels för tillfället, här kan vi implementera slumpmässighet i framtiden
const levels = [
    {
        name: "Level 1",
        completed: false,
        enemies: [
            {
                name: "Goblin",
                health: getRandomHealth(seed, 50, 100),
                weapon: weapons.dagger, // hämtar Dagger från weapons.js
                stats: {
                    strength: 0,
                    agility: 0,
                    intelligence: 0
                },
            },
        ]
    },
    {
        name: "Level 2",
        completed: false,
        enemies: [
            {
                name: "Jens",
                health: getRandomHealth(seed, 120, 150),
                weapon: weapons.dagger, // hämtar Dagger från weapons.js
                stats: {
                    strength: 0,
                    agility: 0,
                    intelligence: 0
                },
            },
        ]
    },
    {
        name: "Level 3",
        completed: false,
        enemies: [
            {
                name: "Megadraken",
                health: 200,
                weapon: weapons.dragon, // hämtar Dragon från weapons.js
                stats: {
                    strength: 0,
                    agility: 0,
                    intelligence: 0
                },
            },
        ]
    }
];

export default levels;