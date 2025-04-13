import { Player } from "../player";
import weapons from "../weapons";
import spells from "../spells";
import { Animations } from "../Animations";

export class Mage extends Player {
    name = "Trollkarlen";
    animations = new Animations("mage", "mage idle", null, "mage cast");

    health = 200;
    maxHealth = 200;
    energy = 100;
    weapon = weapons.big_axe;
    inventory = [];
    spells = [spells.frostbolt, spells.aura_of_might, spells.rejuvenation, spells.ignite, spells.fireball];
    spellbook = [];
    class = "Mage";
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
    lastAction = null;
    talentPoints = 50;
    level = 1;
    score = 0;

    
    // TODO: lägg in focus points grejerna från "DamageCalc.js"

    attack(target) {
        let damage = this.handleCrit(null);
        target.health -= Math.round(damage);
    }

    cast(target, spell) {
        if (spell.damage) {
            let damage = this.handleCrit(spell);
            damage = Math.round(damage) + 10 * this.stats.intelligence;
            target.health -= damage;
            console.log(`${this.name} casts ${spell.name} on ${target.name} for ${damage} damage.`);
        }

        if (spell.effect) {
            spell.effect(this, target);
            console.log(`${this.name} casts ${spell.name}.`);
        }
    }
}