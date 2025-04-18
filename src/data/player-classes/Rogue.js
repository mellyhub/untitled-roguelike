import { Player } from "../player";
import weapons from "../weapons";
import spells from "../spells";
import { Animations } from "../Animations";

export class Rogue extends Player {
    name = "Edwin";
    class = "Rogue";
    animations = new Animations("rogue", "rogue idle", "rogue attack", null);

    health = 200;
    maxHealth = 200;
    energy = 100;
    maxEnergy = 100;

    weapon = [weapons.big_axe];
    spells = [spells.frostbolt, spells.aura_of_might, spells.rejuvenation, spells.ignite, spells.fireball];
    
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

    attack(target) {
        let damage = this.handleCrit(null);
        target.health -= Math.round(damage);
        return damage;
    }

    cast(target, spell) {

        this.energy -= 20;

        if (spell.damage) {
            let damage = this.handleCrit(spell);
            damage = Math.round(damage);
            target.health -= damage;
            console.log(`${this.name} casts ${spell.name} on ${target.name} for ${damage} damage.`);
            return damage;
        }

        if (spell.effect) {
            spell.effect(this, target);
            console.log(`${this.name} casts ${spell.name}.`);
            return null;
        }
    }
}