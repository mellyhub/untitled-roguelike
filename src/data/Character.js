import { CombatHandler } from "./CombatHandler";
import { EffectsHandler } from "./EffectsHandler";

export class Character {
    name;
    class;
    weapons;
    spells;
    stats; // Includes Health, Energy/Mana, ...
    level;
    score;
    talents;
    talentPoints = 50;
    gold = 50;

    // Unique resource, for example Rage or Combo Points
    resource;

    // Animation handler
    animations;

    // Combat handler
    combatHandler;

    // Effects handler
    effectsHandler;

    // Inventory handler
    inventoryHandler;

    constructor(name, weapons, spells, stats, animations, characterClass = "Enemy") {
        this.name = name;
        this.class = characterClass;
        this.weapons = weapons;
        this.spells = spells;
        this.stats = stats;
        this.combatHandler = new CombatHandler(this);
        this.effectsHandler = new EffectsHandler(this);
        this.animations = animations;
        this.level = 0;
        this.score = 0;
    }

    attemptAction(action, target, spell, battleUI) {
        this.effectsHandler.processActiveEffects();

        if (this.effectsHandler.isImpaired()) {
            console.log(`${this.name} is impaired, cannot perform action!`);
        } 
        else if (action === "attack") {
            this.attack(target, battleUI);
        } 
        else if (action === "cast") {
            this.cast(target, spell, battleUI);
        }
    }

    attack(target, battleUI) {
        if (target.stats.evasion > Math.random()) {
            console.log(`${target.name} evaded the attack`);
            return;
        }
        const damage = this.weapons.at(-1).damage;
        this.doDamage(damage, target, battleUI);
    }

    cast(target, spell, battleUI) {
        if (spell.effect) {
            spell.effect(this, target);
        }
        if (spell.damage) {
            let damage = spell.damage(this);
            this.doDamage(damage, target, battleUI);
        }
    }

    doDamage(damage, target, battleUI) {
        if (this.stats.critChance > Math.random()) {
            console.log("Critical hit");
            damage *= this.stats.critDamage;
        }

        const newHealth = target.getHealth() - damage;
        battleUI.displayDamageText(target, target.getHealth() - newHealth);
        target.setHealth(newHealth);
    }

    getName() {
        return this.name;
    }

    getHealth() {
        return this.stats.health;
    }

    getMaxHealth() {
        return this.stats.maxHealth;
    }

    setHealth(newHealth) {
        this.stats.health = newHealth;
    }

    getLevel() {
        return this.stats.level;
    }

    setLevel(newLevel) {
        this.stats.level = newLevel;
    }

    getEnergy() {
        return this.stats.energy;
    }

    getMaxEnergy() {
        return this.stats.maxEnergy;
    }

    setEnergy(newEnergy) {
        this.stats.energy = newEnergy;
    }

    getResource() {
        const key = Object.keys(this.resource)[0];
        return this.resource[key];
    }
    
    getCurrentWeapon() {
        return this.weapons.at(-1);
    }

    addWeapon(weapon) {
        this.weapons.push(weapon);
    }

    popWeapon() {
        this.weapons.pop();
    }
}

    /*
    handleRage(damage) {
        const rageMultiplier = 1 + this.resource.rage * 0.002;
        damage *= rageMultiplier;

        const rageAmount = 10; // amount of rage gained when hit
        this.resource.rage = Math.min(this.resource.rage + rageAmount, 100); // cap rage at 100
        return damage;
    }

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