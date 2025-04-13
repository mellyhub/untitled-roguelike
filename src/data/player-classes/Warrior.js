import { Player } from "../player";
import weapons from "../weapons";
import spells from "../spells";
import { Animations } from "../Animations";

export class Warrior extends Player {
    name = "Taifun";
    animations = new Animations("warrior", "warrior idle", "warrior attack", null);

    health = 200;
    maxHealth = 200;
    energy = 100;
    maxEnergy = 100;
    weapon = weapons.big_axe;
    inventory = [];
    spells = [spells.frostbolt, spells.aura_of_might, spells.rejuvenation, spells.ignite, spells.fireball];
    spellbook = [];
    class = "Warrior";
    stats = {
        strength: 10,
        agility: 5,
        intelligence: 2,
        critChance: 0.5,
        critDamage: 1.5
    };
    resource = {
        rage: 0
    }
    lastAction = null;
    talentPoints = 0;
    level = 1;
    score = 0;

    attack(target) {
        let damage = this.handleCrit(null);

        // handle warrior rage scaling
        const rageMultiplier = 1 + this.resource.rage * 0.002;
        console.log(`Rage multiplier: ${rageMultiplier}`);
        damage *= rageMultiplier;

        // warrior rage gain on hit
        const rageAmount = 10; // amount of rage gained when hit
        this.resource.rage = Math.min(this.resource.rage + rageAmount, 100); // cap rage at 100
        console.log(`${this.name} gains ${rageAmount} rage. Total rage: ${this.resource.rage}`);

        target.health -= Math.round(damage);

    }

    cast(target, spell) {

        this.energy -= 20;

        if (spell.damage) {
            let damage = this.handleCrit(spell);

            // handle warrior rage scaling
            const rageMultiplier = 1 + this.resource.rage * 0.002;
            console.log(`Rage multiplier: ${rageMultiplier}`);
            damage *= rageMultiplier;

            // warrior rage gain on hit
            const rageAmount = 10; // amount of rage gained when hit
            this.resource.rage = Math.min(this.resource.rage + rageAmount, 100); // cap rage at 100
            console.log(`${this.name} gains ${rageAmount} rage. Total rage: ${this.resource.rage}`);

            damage = Math.round(damage);
            target.health -= damage;
            console.log(`${this.name} casts ${spell.name} on ${target.name} for ${damage} damage.`);
        }

        if (spell.effect) {
            spell.effect(this, target);
            console.log(`${this.name} casts ${spell.name}.`);
        }
    }
}