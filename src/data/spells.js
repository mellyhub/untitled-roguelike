import player from "./player.js";

const spells = {
    stab: {
        name: "Stab",
        damage: 10
    },
    frostbolt: {
        name: "Frostbolt",
        damage: 10
    },
    fireball: {
        name: "Fireball",
        damage: 20
    },
    fire_breath: {
        name: "Fire Breath",
        damage: 30
    },
    tail_whip: {
        name: "Tail Whip",
        damage: 10
    },
    bite: {
        name: "Bite",
        damage: 20
    },
    heavy_swing: {
        name: "Heavy Swing",
        damage: 3 * player.stats.strength
    },
};

export default spells;