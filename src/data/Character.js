import { CombatHandler } from "./CombatHandler";
import { EffectsHandler } from "./EffectsHandler";
import { Coatings } from './coatings.js';

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

    constructor(name, weapons, spells, stats, animations, characterClass) {
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

        // Bind methods to ensure 'this' context is maintained
        this.attemptAction = this.attemptAction.bind(this);
        this.attack = this.attack.bind(this);
        this.cast = this.cast.bind(this);
        this.doDamage = this.doDamage.bind(this);
    }

    attemptAction(action, target, spell, battleScene) {
        try {
            this.effectsHandler.processActiveEffects();

            if (this.effectsHandler.isImpaired()) {
                console.log(`${this.name} is impaired, cannot perform action!`);
                return 0; // Return 0 damage when impaired
            }
            else if (action === "attack") {
                return this.attack(target, battleScene);
            }
            else if (action === "cast") {
                return this.cast(target, spell, battleScene);
            }
            return 0; // Default return 0 damage
        }
        catch (error) {
            console.error("Error in attemptAction:", error);
            return 0;
        }
    }

    attack(target, battleScene) {
        try {
            if (!target) {
                console.error("No target specified for attack!");
                return 0;
            }

            // Check for evasion
            if (target.stats.evasion > Math.random()) {
                console.log(`${target.getName()} evaded the attack`);
                battleScene.displayDamageText(target, "Evaded!");
                return 0;
            }

            const weapon = this.getCurrentWeapon();
            if (!weapon) {
                console.error("No weapon equipped!");
                return 0;
            }

            let damage = weapon.damage;

            // Apply damage
            target.setHealth(target.getHealth() - damage);
            console.log(`${this.getName()} attacks ${target.getName()} for ${damage} damage!`);

            // Process weapon coatings
            Coatings.processCoatings(weapon, this, target);

            // Check if target is defeated
            if (target.getHealth() <= 0) {
                console.log(`${target.getName()} has been defeated!`);
                target.setHealth(0);
            }

            return damage;
        }
        catch (error) {
            console.error("Error in attack:", error);
            return 0;
        }
    }

    cast(target, spell, battleScene) {
        try {
            // Deduct spell energy cost
            if (spell.cost && this.getEnergy() >= spell.cost) {
                this.setEnergy(this.getEnergy() - spell.cost);
                console.log(`${this.name} used ${spell.cost} energy to cast ${spell.name}.`);
            }
            else if (spell.cost) {
                console.log(`${this.name} doesn't have enough energy to cast ${spell.name}.`);
                return 0; // Don't cast if not enough energy
            }

            let totalDamage = 0;

            if (spell.effect) {
                spell.effect(this, target);
            }
            if (spell.damage) {
                let damage = spell.damage(this);
                totalDamage = this.doDamage(damage, target, battleScene);
            }

            return totalDamage;
        }
        catch (error) {
            console.error("Error in cast:", error);
            return 0;
        }
    }

    doDamage(damage, target, battleScene) {
        try {
            if (!target) {
                console.error("doDamage: target is undefined");
                return 0;
            }

            let isCritical = false;
            let finalDamage = damage;

            // Check for Exploit Weakness talent
            if (this.effectsHandler && target.effectsHandler) {
                try {
                    const exploitWeakness = this.effectsHandler.permanentEffects.find(effect => effect.name === "Exploit Weakness");
                    if (exploitWeakness && exploitWeakness.applyEffect) {
                        const result = exploitWeakness.applyEffect(this, target);
                        if (result === true) {
                            isCritical = true;
                        }
                    }
                }
                catch (error) {
                    console.error("Error applying Exploit Weakness:", error);
                }
            }

            // Normal critical hit chance if not already critical from talents
            if (!isCritical && this.stats.critChance > Math.random()) {
                console.log("Critical hit");
                isCritical = true;
            }

            // Apply critical multiplier if needed
            if (isCritical) {
                finalDamage *= this.stats.critDamage;
            }

            // Check for Shattering Blows talent (ignore 25% of defense)
            try {
                const shatteringBlows = this.effectsHandler.permanentEffects.find(effect => effect.name === "Shattering Blows");
                const defenseReduction = shatteringBlows ? 0.25 : 0;

                // Apply target's defense
                const effectiveDefense = target.stats.defense * (1 - defenseReduction);
                finalDamage = Math.max(1, finalDamage - effectiveDefense);
            }
            catch (error) {
                console.error("Error applying Shattering Blows:", error);
            }

            // Check for Executioner's precision (50% more damage to low health targets)
            try {
                if (target.getHealth() < target.getMaxHealth() * 0.25) {
                    const executionerPrecision = this.effectsHandler.permanentEffects.find(effect => effect.name === "Executioner's precision");
                    if (executionerPrecision) {
                        finalDamage *= 1.5;
                        console.log(`${this.name} executes ${target.name} for 50% more damage!`);
                    }
                }
            }
            catch (error) {
                console.error("Error applying Executioner's precision:", error);
            }

            finalDamage = Math.round(finalDamage);

            // Make sure battleScene exists and has displayDamageText method
            if (battleScene && typeof battleScene.displayDamageText === 'function') {
                // Use battle scene's displayDamageText method
                battleScene.displayDamageText(target, finalDamage, isCritical);
            }
            else {
                console.error("battleScene or displayDamageText method is undefined");
            }

            target.setHealth(target.getHealth() - finalDamage);

            // Apply omnivamp (healing from damage)
            if (this.stats.omnivamp && this.stats.omnivamp > 0) {
                const healing = Math.round(finalDamage * this.stats.omnivamp);
                if (healing > 0) {
                    this.setHealth(Math.min(this.getHealth() + healing, this.getMaxHealth()));
                    console.log(`${this.name} heals for ${healing} from omnivamp.`);
                }
            }

            return finalDamage;
        }
        catch (error) {
            console.error("Error in doDamage:", error);
            return 0;
        }
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

    equipWeapon(weapon) {
        // Remove stats from current weapon
        const currentWeapon = this.getCurrentWeapon();
        if (currentWeapon && currentWeapon.stats) {
            this.removeWeaponStats(currentWeapon);
        }

        // Add the new weapon and its stats
        this.weapons.push(weapon);
        if (weapon.stats) {
            this.addWeaponStats(weapon);
        }
        else {
            console.log("Weapon has no stats.");
        }
    }

    addWeaponStats(weapon) {
        if (!weapon.stats) return;

        // Add weapon stats to character stats
        if (weapon.stats.strength) this.stats.strength += weapon.stats.strength;
        if (weapon.stats.agility) this.stats.agility += weapon.stats.agility;
        if (weapon.stats.intelligence) this.stats.intelligence += weapon.stats.intelligence;
        if (weapon.stats.defense) this.stats.defense += weapon.stats.defense;
        if (weapon.stats.critChance) this.stats.critChance += weapon.stats.critChance;
        if (weapon.stats.critDamage) this.stats.critDamage += weapon.stats.critDamage;
    }

    removeWeaponStats(weapon) {
        if (!weapon.stats) return;

        // Remove weapon stats from character stats
        if (weapon.stats.strength) this.stats.strength -= weapon.stats.strength;
        if (weapon.stats.agility) this.stats.agility -= weapon.stats.agility;
        if (weapon.stats.intelligence) this.stats.intelligence -= weapon.stats.intelligence;
        if (weapon.stats.defense) this.stats.defense -= weapon.stats.defense;
        if (weapon.stats.critChance) this.stats.critChance -= weapon.stats.critChance;
        if (weapon.stats.critDamage) this.stats.critDamage -= weapon.stats.critDamage;
    }

    popWeapon() {
        if (this.weapons.length === 1) {
            console.log('Cannot remove unarmed.')
            return
        }
        const removedWeapon = this.weapons.pop();
        if (removedWeapon && removedWeapon.stats) {
            this.removeWeaponStats(removedWeapon);
        }
        return removedWeapon;
    }

    // New getter/setter methods
    getClass() {
        return this.class;
    }

    setClass(newClass) {
        this.class = newClass;
    }

    getScore() {
        return this.score;
    }

    setScore(newScore) {
        this.score = newScore;
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