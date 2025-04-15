import seedrandom from 'seedrandom';
import { Enemy } from "./Enemy";

export class Goblin extends Enemy {
    name = "Goblin";
    battleCry = null;
    animationKey = "goblin-anim";
    animationSheetName = "goblin";
    animationFrameRate = 6;
    imageScale = 1;
    imageXPos = 1440;
    imageYPos = 540;

    health;
    strength;
    energy = 100;
    maxEnergy = 100;
    omnivamp = 0;

    constructor(weight) {
        super();
        this.health = this.getRandomStat(50, 50) + weight * 10;
        this.strength = this.getRandomStat(5 , 5) + weight * 10;
    }

    getRandomStat(min, max) {
        const rng = seedrandom();
        const random = rng();
        return Math.floor(random * (max - min + 1)) + min;
    }

    attack(target) {
        target.health -= 50;
    }
}