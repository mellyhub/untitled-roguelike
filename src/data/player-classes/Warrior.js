import { Player } from "../player";
import weapons from "../weapons";
import spells from "../spells";
import { Animations } from "../Animations";

export class Warrior extends Player {
    name = "Taifun";
    class = "Warrior";
    animations = new Animations("warrior", "warrior idle", "warrior attack", "warrior cast");

    health = 200;
    maxHealth = 200;
    energy = 100;
    maxEnergy = 100;
    weapon = [weapons.big_axe];
    spells = [spells.thunderclap, spells.conjure_weapon, spells.arcane_surge];
    
    stats = {
        strength: 10,
        agility: 5,
        intelligence: 2,
        defense: 10,
        evasion: 0,
        critChance: 0.1,
        critDamage: 1.5,
        omnivamp: 0,
    };

    resource = {
        rage: 0
    }

    handleRage(damage) {
        const rageMultiplier = 1 + this.resource.rage * 0.002;
        console.log(`Rage multiplier: ${rageMultiplier}`);
        damage *= rageMultiplier;

        const rageAmount = 10; // amount of rage gained when hit
        this.resource.rage = Math.min(this.resource.rage + rageAmount, 100); // cap rage at 100
        console.log(`${this.name} gains ${rageAmount} rage. Total rage: ${this.resource.rage}`);
        return damage;
    }

    attack(target) {

        // check evasion
        if(Math.random() < target.stats.evasion) {
            console.log(`${target.name} evaded the attack!`);
            return "Missed!";
        }

        let damage = this.handleCrit(null);
        
        // apply rage muiltiplier
        damage += this.handleRage(damage);

        // apply defense
        const defenseReduction = target.stats.defense / (target.stats.defense + 100);
        damage *= 1 - defenseReduction;
        console.log(`${target.name} reduced damage by ${Math.round(defenseReduction * 100)}%`);

        // apply omnivamp
        this.health += Math.round(this.stats.omnivamp * damage);
        
        // round and apply damage
        damage = Math.round(damage);
        target.health -= damage;

        const restoreEnergy = this.permanentEffects.find(effect => effect.name === "Energy on Attack");
        if (restoreEnergy) {
            restoreEnergy.applyEffect(this);
        }
        return damage;
    }

    cast(target, spell) {
        this.energy -= 20;

        if (spell.damage) {
            // check evasion
            if(Math.random() < target.stats.evasion) {
                console.log(`${target.name} evaded the attack!`);
                return "Missed!";
            }
            let damage = this.handleCrit(spell);
            damage += this.handleRage(damage);

            damage = Math.round(damage);
            target.health -= damage;
            console.log(`${this.name} casts ${spell.name} on ${target.name} for ${damage} damage.`);
        
            return damage;
        }

        if (spell.effect) {
            spell.effect(this, target);
            console.log(`${this.name} casts ${spell.name}.`);
        }

        return 0;
    }
}