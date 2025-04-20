// hårdkodade vapen
import spells from '../data/spells.js';

const weapons = {
    unarmed: {
        name: "Unarmed",
        type: "?",
        damage: 0
    },
    dagger: {
        name: "Dagger",
        type: "Dagger",
        damage: 10,
    },
    staff: {
        name: "Staff",
        type: "Staff",
        damage: 5,
        spells:
        {
            frostbolt: spells.frostbolt,
            fireball: spells.fireball
        }
    },
    dragon: {
        name: "Dragon",
        type: "?",
        damage: 30,
    },
    big_axe: {
        name: "Big Axe",
        type: "Axe",
        damage: 60,
        stats: {
            strength: 2,
            agility: 5,
            intelligence: 0,
        },
        spells:
        {
            heavy_swing: spells.heavy_swing,
        },
        coatings: [],
    },
    jens_sword: {
        name: "Jens Sword",
        type: "Sword",
        damage: 100,
        stats: {
            strength: 1000,
            agility: 1000,
            intelligence: 1000,
        },
        spells:
        {
            heavy_swing: spells.heavy_swing,
        }
    },
    snowmans_bane: {
        name: "Snowman’s Bane",
        type: "Sword",
        description: "The dreaded bane of the snowman, a weapon forged in the darkest corners of winter’s wrath",
        damage: 10,
        effect() {
            if (target.name === "Snowman") {
                target.health = 0;
                console.log("The Snowman’s Bane is mercilessly wielded to bring an end to the reign of the snowman, ensuring its icy demise.");
            }
        },
        spells:
        {
            heavy_swing: spells.heavy_swing,
        }
    },
};

export default weapons;