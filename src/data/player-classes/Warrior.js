import { Player } from "../player";
import weapons from "../weapons";
import spells from "../spells";
import { Animations } from "../Animations";

export class Warrior extends Player {
    name = "Taifun";
    class = "Warrior";
    animations = new Animations("warrior", "warrior idle", "warrior attack", "warrior cast");

    health = 10000;
    maxHealth = 200;
    energy = 100;
    maxEnergy = 100;
    weapon = [weapons.big_axe];
    spells = [spells.frostbolt, spells.aura_of_might, spells.rejuvenation, spells.ignite, spells.fireball, spells.conjure_weapon];
    
    stats = {
        strength: 1,
        agility: 5,
        intelligence: 2,
        critChance: 0.5,
        critDamage: 1.5
    };

    resource = {
        rage: 0
    }

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

        const restoreEnergy = this.permanentEffects.find(effect => effect.name === "Energy on Attack");
        if (restoreEnergy) {
            restoreEnergy.applyEffect(this);
        }

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