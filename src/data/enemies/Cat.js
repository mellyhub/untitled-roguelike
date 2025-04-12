export class Cat {
    name = "Cat";
    animationKey = "cat-animation";
    animationSheetName = "cat fighter";
    animationFrameRate = 15;
    imageScale = 6;
    imageXPos = 1440;
    imageYPos = 600;

    health;
    strength;
    energy = 100;
    spells = [];

    constructor(weight) {
        this.health = 590 + weight * 10;
        this.strength = 100 + weight * 10;
    }

    attack(target) {
        target.health -= 50;
    }
}