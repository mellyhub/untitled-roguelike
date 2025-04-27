export class EffectsHandler {
    
    constructor(character) {
        this.character = character;

        this.permanentEffects = []; // permanent effects are effects that are always active, currently not used
        
        this.activeEffects = [];
    }

    addActiveEffect(effect) {
        this.activeEffects.push(effect);
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
                console.log(`${effect.name} effect on ${this.name} has expired.`);
                return false; // remove effect
            }

            effect.remainingTurns--;
            return true; // keep effect
        });
    }

    removeAllActiveEffects() {
        this.activeEffects.forEach(effect => {
            if (effect.removeEffect) {
                effect.removeEffect();
            }
            console.log(`Removed effect: ${effect.name} from ${this.name}`);
        });
        this.activeEffects = [];
    }

    isImpaired() {
        return this.activeEffects.some(effect => effect.name === "Stunned");
    }

}