// hårdkodade vapen
import spells from '../data/spells.js';

const weapons = {
    dagger: {
        name: "Dagger",
        icon: null,
        attack: 10,
    },
    staff: {
        name: "Staff",
        icon: null,
        attack: 5,
        spells:
        {
            frostbolt: spells.frostbolt,
            fireball: spells.fireball
        }
    },
    dragon: {
        name: "Dragon",
        icon: null,
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
        icon: "src/assets/images/item-icons/jens-sword-icon.png",
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