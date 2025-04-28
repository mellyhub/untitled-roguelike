import { Character } from "../Character";

export class Warrior extends Character {

    // Warrior only has spells that works with the refactor

    constructor(name, weapons, spells, stats, animations) {
        super(name, weapons, spells, stats);
        this.class = "Warrior";
        this.resource = { rage : 0 };
        this.animations = animations;
    }  
    
    handleRage(damage) {
        const rageMultiplier = 1 + this.resource.rage * 0.002;
        damage *= rageMultiplier;

        const rageAmount = 10; // amount of rage gained when hit
        this.resource.rage = Math.min(this.resource.rage + rageAmount, 100); // cap rage at 100
        return damage;
    }

    /*
    attack(target, battleUI) {

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

        // apply attacker specific multiplier
        damage *= this.damageMultiplier;

        // apply rage muiltiplier
        damage += this.handleRage(damage);

        // check for Executioner's precision talent
        const executionersPrecision = this.permanentEffects.find(effect => effect.name === "Executioner's precision");
        if (executionersPrecision && target.health <= target.maxHealth * 0.25) {
            damage *= 1.5;
            executionersPrecision.applyEffect(this);
        }

        // apply defense and Shattering Blows talent if applicable
        let defenseReduction;
        const shatteringBlows = this.permanentEffects.find(effect => effect.name === "Shattering Blows");
        if (shatteringBlows) {
            defenseReduction = (target.stats.defense * 0.75) / (target.stats.defense + 100);
        }
        else {
            defenseReduction = target.stats.defense / (target.stats.defense + 100);
        }
        damage *= 1 - defenseReduction;
        console.log(`${target.name} reduced damage by ${Math.round(defenseReduction * 100)}%`);

        // rounding damage
        damage = Math.round(damage);

        // apply omnivamp
        this.health += Math.round(this.stats.omnivamp * this.healMultiplier * damage);
        if (this.health > this.maxHealth) {
            this.health = this.maxHealth;
        }

        // apply damage to enemy
        target.health -= damage;

        const restoreEnergy = this.permanentEffects.find(effect => effect.name === "Energy on Attack");
        if (restoreEnergy) {
            restoreEnergy.applyEffect(this);
        }

        // trigger Void Channeling effect
        const voidChanneling = this.permanentEffects.find(effect => effect.name === "Void Channeling");
        if (voidChanneling) {
            voidChanneling.applyEffect(this, target, damage, battleUI);
        }
        // reset Void Channeling flag
        if (voidChanneling && voidChanneling.removeEffect) {
            voidChanneling.removeEffect();
        }

        battleUI.displayDamageText("enemy", damage);
    }

    cast(target, spell, battleUI) {
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

                battleUI.displayDamageText("enemy", damage);
            }
        }
        else {
            console.log("Not enough energy to cast!");
            // currently, your turn is "skipped" if you try to cast without having enough energy
            // this behavior should probably be changed
        }
    }
    */
}