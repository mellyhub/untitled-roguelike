import { Player } from "./player2";
import weapons from "./weapons";
import spells from "./spells";

export class Warrior extends Player {
    name = "Taifun"
    health = 200;
    energy = 100;
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
    talentPoints = 50;
    level = 1;
    score = 0;

    attack(target) {
        let damage;

        if (this.stats.critChance > Math.random()) {
            console.log("Critical hit!");
            damage = this.weapon.damage * this.stats.strength * 0.1 * this.stats.critDamage;
        } else {
            damage = this.weapon.damage * this.stats.strength * 0.1;
        }

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
        let damage;

        if (spell.damage) {
            // If the spell deals damage
            if (this.stats.critChance > Math.random()) {
                damage = spell.damage(this.stats) * this.stats.critDamage;
            }
            else {
                damage = spell.damage(this.stats);
            }

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
            //spell.effect(this, target, scene);
            console.log(`${this.name} casts ${spell.name}.`);
        }
    }
}