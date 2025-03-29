// hårdkodade vapen
import spells from '../data/spells.js';

const weapons = {
    dagger: {
        name: "Dagger",
        castable:
        {
            stab: spells.stab
        }
    },
    staff: {
        name: "Staff",
        castable:
        {
            frostbolt: spells.frostbolt,
            fireball: spells.fireball
        }
    },
    dragon: {
        name: "Dragon",
        castable:
        {
            fire_breath: spells.fire_breath,
            tail_whip: spells.tail_whip,
            bite: spells.bite
        }
    },
};

export default weapons;