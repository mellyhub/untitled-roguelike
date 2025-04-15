import { Player } from "../player";
import weapons from "../weapons";
import spells from "../spells";
import { Animations } from "../Animations";

export class Mage extends Player {
    name = "Trollkarlen";
    class = "Mage";
    animations = new Animations("mage", "mage idle", "mage attack", "mage cast");

    health = 200;
    maxHealth = 200;
    energy = 0;
    maxEnergy = 100;

    weapon = [weapons.big_axe];
    spells = [spells.frostbolt, spells.aura_of_might, spells.rejuvenation, spells.ignite, spells.fireball];
    
    stats = {
        strength: 2,
        agility: 3,
        intelligence: 12,
        critChance: 0.05,
        critDamage: 1.5
    };

    resource = {
        focusPoints: 0
    }

    // TODO: lägg in focus points grejerna från "DamageCalc.js"

    attack(target) {
        let damage = this.handleCrit(null);
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
            damage = Math.round(damage) + 10 * this.stats.intelligence;
            target.health -= damage;

            if (this.lastAction === spell.name) {
                this.resource.focusPoints = Math.min(this.resource.focusPoints + 1, 3); // cap at 3 FP
                console.log(`${this.name} gains 1 focus point. Total focus points: ${this.resource.focusPoints}`);
                damage *= 1 + this.resource.focusPoints * 0.1; // increase by 10% per focus point
                console.log(damage);
            }
            this.lastAction = spell.name;
            console.log(`${this.name} casts ${spell.name} on ${target.name} for ${damage} damage.`);
        }

        if (spell.effect) {
            spell.effect(this, target);
            console.log(`${this.name} casts ${spell.name}.`);
        }
    }
}