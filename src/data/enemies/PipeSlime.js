export class PipeSlime {
    name = "Pipe slime";
    animationKey = "pipe-slime-anim";
    animationSheetName = "pipe-slime";
    animationFrameRate = 6;
    imageScale = 1;
    imageXPos = 1440;
    imageYPos = 540;

    health;
    strength;
    energy = 100;
    spells = [];

    constructor(weight) {
        this.health = 190 + weight * 10;
        this.strength = 100 + weight * 10;
    }

    attack(target) {
        target.health -= 50;
    }
}