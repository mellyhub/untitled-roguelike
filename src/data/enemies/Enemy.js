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
    strength;
    energy;
    maxEnergy;
    spells;

    activeEffects = [];

    constructor(weight) {}

    processActiveEffects() {
        this.activeEffects = this.activeEffects.filter(effect => {
            effect.applyEffect();
            effect.remainingTurns--;
    
            // remove effect if expired
            if (effect.remainingTurns <= 0) {
                if (effect.removeEffect) {
                    effect.removeEffect(); // call the removeEffect function if it exists
                }
                console.log(`${effect.name} effect on ${this.name} has expired.`);
                return false; // remove effect
            }
    
            return true; // keep effect
        });
    }
}