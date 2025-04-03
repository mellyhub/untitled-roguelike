import enemies from './enemies.js';

// hardcoded levels
function generateLevels(seed) {
    return [
        {
            name: "Portal",
            completed: false,
            level: 0,
            enemies: [
                enemies.goblin(seed),
                enemies.jens(seed),
                enemies.megadraken(seed),
                enemies.snowman(seed)
            ],
        },
        {
            name: "test",
            completed: false,
            level: 0,
            enemies: [
                enemies.goblin(seed),
                enemies.jens(seed),
                enemies.megadraken(seed),
                enemies.snowman(seed)
            ],
        },
    ];
}

export default generateLevels;