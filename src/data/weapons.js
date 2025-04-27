// hårdkodade vapen
import spells from '../data/spells.js';

const weapons = {
    unarmed: {
        name: "Unarmed",
        type: "?",
        damage: 0,
        stats: {
            strength: 0,
            agility: 0,
            intelligence: 0
        }
    },
    dagger: {
        name: "Dagger",
        type: "Dagger",
        damage: 10,
        stats: {
            strength: 0,
            agility: 5,
            intelligence: 0,
            critChance: 0.05
        }
    },
    staff: {
        name: "Staff",
        type: "Staff",
        damage: 5,
        stats: {
            strength: 0,
            agility: 0,
            intelligence: 8
        },
        spells: {
            frostbolt: spells.frostbolt,
            fireball: spells.fireball
        }
    },
    dragon: {
        name: "Dragon",
        type: "?",
        damage: 30,
        stats: {
            strength: 15,
            agility: 0,
            intelligence: 0
        }
    },
    big_axe: {
        name: "Big Axe",
        type: "Axe",
        damage: 60,
        stats: {
            strength: 12,
            agility: 5,
            intelligence: 0,
            critDamage: 0.2
        },
        spells: {
            heavy_swing: spells.heavy_swing,
        },
    },
    jens_sword: {
        name: "Jens Sword",
        type: "Sword",
        damage: 100,
        stats: {
            strength: 1000,
            agility: 1000,
            intelligence: 1000,
            defense: 1000,
            critChance: 1000,
            critDamage: 1000
        },
        spells: {
            heavy_swing: spells.heavy_swing,
        }
    },
    snowmans_bane: {
        name: "Snowman's Bane",
        type: "Sword",
        description: "The dreaded bane of the snowman, a weapon forged in the darkest corners of winter's wrath",
        damage: 10,
        stats: {
            strength: 3,
            agility: 3,
            intelligence: 3
        },
        effect() {
            if (target.name === "Snowman") {
                target.health = 0;
                console.log("The Snowman's Bane is mercilessly wielded to bring an end to the reign of the snowman, ensuring its icy demise.");
            }
        },
        spells: {
            heavy_swing: spells.heavy_swing,
        }
    },
};

export default weapons;