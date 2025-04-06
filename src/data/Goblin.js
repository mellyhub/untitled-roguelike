import seedrandom from 'seedrandom';

export class Goblin {
    name = "Goblin";
    health;
    strength;

    constructor(weight) {
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