export class NightGlider {
    name = "Night Glider";
    battleCry = null;
    animationKey = "nightGlider-idle";
    animationSheetName = "night glider";
    animationFrameRate = 3;
    imageScale = 0.9;
    imageXPos = 1440;
    imageYPos = 420;

    health;
    strength;
    energy = 100;
    spells = [];

    constructor(weight) {
        this.health = 290 + weight * 10;
        this.strength = 50 + weight * 10;
    }

    attack(target) {
        target.health -= 50;
    }
}