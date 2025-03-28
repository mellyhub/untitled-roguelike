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
        enemies: [
            {
                name: "Goblin",
                health: getRandomHealth(seed, 50, 100),
                weapon: weapons[0], // hämtar dagger från weapons.js
            },
        ]
    },
    {
        name: "Level 2",
        enemies: [
            {
                name: "Jens",
                health: getRandomHealth(seed, 120, 150),
                weapon: weapons[0],
            },
        ]
    }
];

export default levels;