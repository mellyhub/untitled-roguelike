// hårdkodade vapen
import spells from '../data/spells.js';

const weapons = {
    dagger: {
        name: "Dagger",
        attack: 10,
    },
    staff: {
        name: "Staff",
        attack: 5,
        spells:
        {
            frostbolt: spells.frostbolt,
            fireball: spells.fireball
        }
    },
    dragon: {
        name: "Dragon",
        attack: 30,
    },
    big_axe: {
        name: "Big Axe",
        attack: 60,
        stats: {
            strength: 2,
            agility: 5,
            intelligence: 0,
        },
    },
    jens_sword: {
        name: "Jens Svärd",
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
    }
};

export default weapons;