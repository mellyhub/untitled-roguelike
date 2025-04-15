import { Enemy } from "./Enemy";

export class Snowman extends Enemy {
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
    omnivamp = 0;
    spells = [];

    constructor(weight) {
        super();
        this.health = 190 + weight * 10;
        this.strength = 30 + weight * 10;
    }

    attack(target) {
        target.health -= 50;
    }
}