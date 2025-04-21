export class Enemy {
    name;
    battleCry;
    animationKey;
    animationSheetNam;
    animationFrameRate;
    imageScale;
    imageXPos;
    imageYPos;

    health;
    maxHealth;
    strength;
    energy;
    maxEnergy;
    spells = [];
    activeEffects = [];
    
    constructor(weight) {}

    /**
     * checks if the character has a specific status effect.
     * @param {string} effectName - the name of the status effect to check.
     * @returns {boolean} - true if the effect is active, false otherwise.
     */
    hasStatusEffect(effectName) {
        return this.activeEffects.some(effect => effect.type === "Status" && effect.name === effectName);
    }

    processActiveEffects() {
        this.activeEffects = this.activeEffects.filter(effect => {

            if(effect.applyEffect) {
                effect.applyEffect(this);
            }
            
            // remove effect if expired
            if (effect.remainingTurns <= 0) {
                if (effect.removeEffect) {
                    effect.removeEffect(this); // call the removeEffect function if it exists
                }
                console.log(`${effect.name} effect on ${this.name} has expired.`);
                return false; // remove effect
            }
    
            effect.remainingTurns--;
            return true; // keep effect
        });
    }
}