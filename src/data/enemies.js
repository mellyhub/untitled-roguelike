import seedrandom from 'seedrandom';
import weapons from './weapons.js';
import spells from './spells.js';
import { Character } from './Character.js';
import { Animations } from './Animations.js';

//const enemies = [Snowman, Goblin, NightGlider, PipeSlime, Cat, PipeSlime, PortalTreader];

export const enemies = {
    pipeSlime: {
        name: "PipeSlime",
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
            evasion: 0,
            critChance: 0.1,
            critDamage: 1.5,
            omnivamp: 0,
        },
        weapons: [weapons.big_axe],
        spells: [
            spells.heal,
        ],
        resource: {
            rage: 0
        },
        animations: 
            new Animations(
                "Pipe Slime", 
                "pipe slime", 
                "pipe slime", 
                "pipe slime",
                {
                    idleAnimFramerate: 6,
                    attackAnimFramerate: 6,
                    castAnimFramerate: 6,
                    idleAnimPos: { x: 1440, y: 540 },
                    attackAnimPos: { x: 1440, y : 540 },
                    castAnimPos: { x: 1440, y : 540 },
                }
            ),
        createEnemy() {
            return new Character(
                "Pipe Slime", 
                [...this.weapons], 
                [...this.spells], 
                structuredClone(this.stats), 
                this.animations
            );
        }
    }
}

export function get_random_enemy(seed) {
    //const rng = seedrandom(seed);
    //return enemies[Math.floor(rng() * enemies.length)];
    return enemies.pipeSlime;
}