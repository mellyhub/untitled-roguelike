import { Enemy } from "./Enemy";
export class Cat extends Enemy {
    name = "Cat";
    battleCry = null;
    animationKey = "cat-animation";
    animationSheetName = "cat fighter";
    animationFrameRate = 15;
    imageScale = 6;
    imageXPos = 1440;
    imageYPos = 600;

    health;
    strength;
    energy = 100;
    maxEnergy = 100;
    omnivamp = 0;
    spells = [];

    constructor(weight) {
        super();
        this.health = 590 + weight * 10;
        this.strength = 100 + weight * 10;
    }

    attack(target) {
        target.health -= 50;
    }
}