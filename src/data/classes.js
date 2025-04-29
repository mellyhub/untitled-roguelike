import weapons from "./weapons.js"; 
import spells from "./spells.js";
import { Animations } from "./Animations.js";
import { Character } from "./Character.js";

export const classes = {
    warrior: {
        name: "Warrior",
        description: "En mäktig krigare med stor svärd",
        stats: {
            level: 0,
            health: 200,
            maxHealth: 200,
            energy: 200,
            maxEnergy: 200,
            strength: 10,
            agility: 5,
            intelligence: 2,
            defense: 10,
            evasion: 0.3,
            critChance: 0.1,
            critDamage: 1.5,
            omnivamp: 0,
        },
        weapons: [{...weapons.unarmed }, {...weapons.big_axe }],
        spells: [
            spells.thunderclap,
            spells.conjure_weapon,
            spells.overcharge,
            spells.heal,
            spells.fireball
        ],
        resource: {
            rage: 0
        },
        animations:
            new Animations(
                "warrior", 
                "warrior idle", 
                "warrior attack", 
                "warrior cast",
                {
                    idleAnimFramerate: 2,
                    attackAnimFramerate: 20,
                    castAnimFramerate: 20,
                    idleAnimPos: { x: 480, y: 540 },
                    attackAnimPos: { x: 830, y : 348 },
                    castAnimPos: { x: 480, y : 540 },
                }
            ),
        createClass() {
            const player = new Character("Taffe", this.weapons, this.spells, this.stats, this.resource, this.animations, "Warrior");
            player.addWeaponStats(this.weapons.at(-1));
            return player;
        }
    },
    mage: {
        name: "Mage",
        description: "En mäktig magiker med stor stav",
        stats: {
            strength: 2,
            agility: 3,
            intelligence: 12,
            critChance: 0.05,
            critDamage: 1.5
        },
        resource: {
            focusPoints: 0
        }
    },
    rogue: {
        name: "Rogue",
        description: "En snabb och smidig tjuv med stor kniv",
        stats: {
            strength: 3,
            agility: 10,
            intelligence: 4,
            critChance: 0.1,
            critDamage: 1.5
        },
        resource: {
            comboPoints: 3
        }
    }
};

export default classes;