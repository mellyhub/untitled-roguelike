import { Enemy } from "./Enemy";

export class PortalTreader extends Enemy {
    name = "Portal Treader";
    battleCry = null;
    animationKey = "portal-treader-anim";
    animationSheetName = "portal treader idle";
    animationFrameRate = 6;
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
        this.strength = 100 + weight * 10;
    }

    attack(target) {
        target.health -= 50;
    }
}