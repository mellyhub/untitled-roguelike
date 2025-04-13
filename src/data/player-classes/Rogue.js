import { Player } from "../player";
import weapons from "../weapons";
import spells from "../spells";

export class Rogue extends Player {
    name = "Edwin";
    animationKey = "rogue-idle";
    animationSheetName = "rogue idle";
    animationFrameRate = 2;

    health = 200;
    maxHealth = 200;
    energy = 100;
    weapon = weapons.big_axe;
    inventory = [];
    spells = [spells.frostbolt, spells.aura_of_might, spells.rejuvenation, spells.ignite, spells.fireball];
    spellbook = [];
    class = "Rogue";
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
        let damage = this.handleCrit(null);

        

        target.health -= Math.round(damage);

    }

    cast(target, spell) {
        

        if (spell.damage) {
            let damage = this.handleCrit(spell);

            

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