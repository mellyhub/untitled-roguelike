import { Enemy } from "./Enemy";

export class PipeSlime extends Enemy {
    name = "Pipe Slime";
    battleCry = "slime";
    animationKey = "pipe-slime-anim";
    animationSheetName = "pipe slime";
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

    stats = {
        strength: 10,
        agility: 5,
        intelligence: 2,
        defense: 10,
        evasion: 0.1,
        critChance: 0.5,
        critDamage: 1.5,
        omnivamp: 0,
    };

    constructor(weight) {
        super();
        this.health = 190 + weight * 10;
        this.strength = 100 + weight * 10;
    }

    attack(target) {
        // enemy damage handling needs to be rewritten
        target.health -= 50;
        return 50;
    }
}