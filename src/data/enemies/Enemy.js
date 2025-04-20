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

    statusEffects = [{
        stunned: false,
        paralysed: false,
        poisoned: false,
    }]
    
    constructor(weight) {}

    processActiveEffects() {
        this.activeEffects = this.activeEffects.filter(effect => {
            effect.applyEffect();
            
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
}