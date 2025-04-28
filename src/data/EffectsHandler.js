export class EffectsHandler {
    
    constructor(character) {
        this.character = character;
        this.permanentEffects = []; // permanent effects from talents that are always active
        this.activeEffects = [];
    }

    addActiveEffect(effect) {
        this.activeEffects.push(effect);
    }

    addPermanentEffect(effect) {
        // Check if the effect already exists to avoid duplicates
        if (!this.permanentEffects.some(e => e.name === effect.name)) {
            this.permanentEffects.push(effect);
        }
    }

    processActiveEffects() {
        this.activeEffects = this.activeEffects.filter(effect => {
            effect.applyEffect();
            console.log(this.activeEffects);
            // remove effect if expired
            if (effect.remainingTurns <= 0) {
                if (effect.removeEffect) {
                    effect.removeEffect(); // call the removeEffect function if it exists
                }
                console.log(`${effect.name} effect on ${this.character.getName()} has expired.`);
                return false; // remove effect
            }

            effect.remainingTurns--;
            return true; // keep effect
        });
    }

    applyPermanentEffects(target, damage, battleUI) {
        this.permanentEffects.forEach(effect => {
            if (!effect || !effect.applyEffect) {
                return; // Skip invalid effects
            }
            
            try {
                // Different effects might need different parameters
                if (target && damage) {
                    effect.applyEffect(this.character, target, damage, battleUI);
                } else {
                    effect.applyEffect(this.character);
                }
            }
            catch (error) {
                console.error(`Error applying effect ${effect.name}:`, error);
            }
        });
    }

    // Apply effects that should trigger when defeating an enemy
    applyOnKillEffects() {
        this.permanentEffects.forEach(effect => {
            if (effect.onKill) {
                effect.onKill(this.character);
            } else if (effect.name === "Vital Surge") {
                effect.applyEffect(this.character);
            }
        });
    }

    // Apply effects that should trigger when player takes damage
    applyOnDamageEffects(attacker, damage) {
        if (!attacker) {
            console.error("Missing attacker parameter in applyOnDamageEffects");
            return;
        }
        
        this.permanentEffects.forEach(effect => {
            if (effect.name === "Mirror Shield") {
                effect.applyEffect(this.character, attacker, damage);
            }
        });
    }

    removeAllActiveEffects() {
        this.activeEffects.forEach(effect => {
            if (effect.removeEffect) {
                effect.removeEffect();
            }
            console.log(`Removed effect: ${effect.name} from ${this.character.getName()}`);
        });
        this.activeEffects = [];
    }

    // Check if character has status immunity from talents like Warrior's Resolve
    hasStatusImmunity() {
        return this.permanentEffects.some(effect => effect.name === "Warrior's Resolve");
    }

    isImpaired() {
        return this.activeEffects.some(effect => effect.name === "Stunned" || effect.name === "Paralyzed");
    }

    tryApplyStatusEffect(statusEffect) {
        if (this.hasStatusImmunity() && statusEffect.type === "Status") {
            console.log(`${this.character.getName()} is immune to ${statusEffect.name} due to Warrior's Resolve.`);
            return false;
        }
        
        this.addActiveEffect(statusEffect);
        return true;
    }
}