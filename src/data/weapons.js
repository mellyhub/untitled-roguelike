// hårdkodade vapen
import spells from '../data/spells.js';

const weapons = {
    dagger: {
        name: "Dagger",
        icon: "jens-sword-icon",
        attack: 10,
    },
    staff: {
        name: "Staff",
        icon: "jens-sword-icon",
        attack: 5,
        spells:
        {
            frostbolt: spells.frostbolt,
            fireball: spells.fireball
        }
    },
    dragon: {
        name: "Dragon",
        icon: "fireball-icon",
        attack: 30,
    },
    big_axe: {
        name: "Big Axe",
        icon: null,
        attack: 60,
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
        name: "Jens Svärd",
        icon: "jens-sword-icon",
        attack: 100,
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
        attack: 10,
        spells:
        {
            heavy_swing: spells.heavy_swing,
        }
    },
};

export default weapons;