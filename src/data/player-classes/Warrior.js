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
    spells = [
        spells.thunderclap,
        spells.conjure_weapon,
        spells.arcane_surge,
        spells.phantom_strike,
        spells.soul_shatter,
        spells.heal,
        spells.geomancy
    ];

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
        if (Math.random() < target.stats.evasion) {
            console.log(`${target.name} evaded the attack!`);
            return "Missed!";
        }

        let damage = this.handleCrit(null);

        // process weapon coatings
        const weapon = this.weapon.at(-1);
        if (weapon && weapon.coatings) {
            weapon.coatings.forEach(coating => {
                if (Math.random() < coating.chance) {
                    console.log(`Coating triggered: ${coating.name}`);
                    coating.effect(this, target); // process the coating's effect
                }
            });
        }

        damage *= this.damageMultiplier;
        
        // apply rage muiltiplier
        damage += this.handleRage(damage);
        
        // apply defense
        const defenseReduction = target.stats.defense / (target.stats.defense + 100);
        damage *= 1 - defenseReduction;
        console.log(`${target.name} reduced damage by ${Math.round(defenseReduction * 100)}%`);

        // rounding damage
        damage = Math.round(damage);

        // apply omnivamp
        this.health += Math.round(this.stats.omnivamp * damage);
        if(this.health >= this.maxHealth) {
            this.health = this.maxHealth;
        }

        // apply damage to enemy
        target.health -= damage;

        const restoreEnergy = this.permanentEffects.find(effect => effect.name === "Energy on Attack");
        if (restoreEnergy) {
            restoreEnergy.applyEffect(this);
        }
        return damage;
    }

    cast(target, spell) {
        if (this.energy >= spell.energyCost) {
            this.energy -= spell.energyCost;

            if (spell.effect) {
                spell.effect(this, target);
                console.log(`${this.name} casts ${spell.name}.`);
            }

            if (spell.damage) {

                // check evasion
                if (Math.random() < target.stats.evasion) {
                    console.log(`${target.name} evaded the attack!`);
                    return "Missed!";
                }

                let damage = this.handleCrit(null);

                console.log(damage);
                
                // apply rage muiltiplier
                damage += this.handleRage(damage);

                console.log(damage);

                if (spell.name === "Phantom Strike") {
                    console.log(`${target.name}'s defense is ignored`);
                }
                else {
                    // apply defense
                    const defenseReduction = target.stats.defense / (target.stats.defense + 100);
                    damage *= 1 - defenseReduction;
                    console.log(`${target.name} reduced damage by ${Math.round(defenseReduction * 100)}%`);
                }

                // round and apply damage
                damage = Math.round(damage);
                target.health -= damage;

                console.log(`${this.name} casts ${spell.name} on ${target.name} for ${damage} damage.`);

                return damage;
            }

            return 0;
        }
        else {
            console.log("Not enough energy to cast!");
            // currently, your turn is "skipped" if you try to cast without having enough energy
            // this behavior should probably be changed
        }
    }
}