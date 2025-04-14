export class Snowman {
    name = "Snowman";
    battleCry = "snow";
    animationKey = "snowman-anim";
    animationSheetName = "snowman";
    animationFrameRate = 10;
    imageScale = 1;
    imageXPos = 1440;
    imageYPos = 540;

    health;
    strength;
    energy = 100;
    maxEnergy = 100;
    spells = [];

    constructor(weight) {
        this.health = 190 + weight * 10;
        this.strength = 30 + weight * 10;
    }

    attack(target) {
        target.health -= 50;
    }
}