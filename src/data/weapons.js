// hårdkodade vapen
import spells from '../data/spells.js';

const weapons = {
    dagger: {
        name: "Dagger",
        icon: "jens-sword-icon",
        damage: 10,
    },
    staff: {
        name: "Staff",
        icon: "jens-sword-icon",
        damage: 5,
        spells:
        {
            frostbolt: spells.frostbolt,
            fireball: spells.fireball
        }
    },
    dragon: {
        name: "Dragon",
        icon: "fireball-icon",
        damage: 30,
    },
    big_axe: {
        name: "Big Axe",
        icon: "big-axe-icon",
        damage: 60,
        stats: {
            strength: 2,
            agility: 5,
            intelligence: 0,
        },
        spells:
        {
            heavy_swing: spells.heavy_swing,
        }
    },
    jens_sword: {
        name: "Jens Sword",
        icon: "jens-sword-icon",
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
        description: "The dreaded bane of the snowman, a weapon forged in the darkest corners of winter’s wrath",
        icon: "snowmans-bane-icon",
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