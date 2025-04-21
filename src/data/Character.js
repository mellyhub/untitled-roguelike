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

    constructor(name, weapons, spells, stats, animations) {
        this.name = name;
        this.weapons = weapons;
        this.spells = spells;
        this.stats = stats;
        this.combatHandler = new CombatHandler(this);
        this.effectsHandler = new EffectsHandler(this);
        this.animations = animations;
        this.level = 0;
        this.score = 0;
    }

    // Does not return anything, return is used to stop the function
    attemptAction(action, target, spell, battleUI) {
        this.effectsHandler.processActiveEffects();

        if (this.effectsHandler.isImpaired()) {
            console.log(`${this.name} is impaired, cannot perform action!`);
            return;
        }

        if (action === "attack") {
            return this.attack(target, battleUI);
        }

        if (action === "cast") {
            return this.cast(target, spell, battleUI);
        }
    }

    attack(target, battleUI) {
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