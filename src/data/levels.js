import enemies from './enemies.js';

// hardcoded levels
function generateLevels(seed) {
    return [
        {
            name: "Level 1",
            completed: false,
            enemies: [
                enemies.goblin(seed),
            ],
        },
        {
            name: "Level 2",
            completed: false,
            enemies: [
                enemies.jens(seed),
            ],
        },
        {
            name: "Level 3",
            completed: false,
            enemies: [
                enemies.megadraken(seed),
            ],
        },
        {
            name: "Random",
            completed: false,
            enemies: [
                enemies.goblin(seed),
                enemies.jens(seed),
                enemies.megadraken(seed)
            ],
        },
    ];
}

export default generateLevels;