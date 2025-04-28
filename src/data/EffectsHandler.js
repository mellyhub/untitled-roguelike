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
        this.permanentEffects.push(effect);
    }

    processActiveEffects() {
        this.activeEffects = this.activeEffects.filter(effect => {
            if (effect.remainingTurns > 0) {
                effect.applyEffect();
                effect.remainingTurns--;
                return true;
            }
            else {
                if (effect.removeEffect) {
                    effect.removeEffect();
                }
                return false;
            }
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
                }
                else {
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
            }
            else if (effect.name === "Vital Surge") {
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
        });
        this.activeEffects = [];
    }

    // Check if character has status immunity from talents like Warrior's Resolve
    hasStatusImmunity() {
        return this.permanentEffects.some(effect => 
            effect.name === "Warrior's Resolve" || 
            effect.name === "Status Immunity"
        );
    }

    isImpaired() {
        return this.activeEffects.some(effect => 
            effect.name === "Paralyzed" || 
            effect.name === "Stunned"
        );
    }

    tryApplyStatusEffect(effect) {
        // Check if character has status immunity
        if (this.hasStatusImmunity()) {
            console.log(`${this.character.getName()} is immune to status effects!`);
            return false;
        }

        // Check if effect is already active
        if (this.activeEffects.some(e => e.name === effect.name)) {
            console.log(`${this.character.getName()} already has ${effect.name}!`);
            return false;
        }

        this.addActiveEffect(effect);
        return true;
    }
}