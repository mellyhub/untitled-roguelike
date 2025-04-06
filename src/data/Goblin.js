import seedrandom from 'seedrandom';

export class Goblin {
    name = "Goblin";
    health;
    strength;

    constructor() {
        this.health = this.getRandomStat(50 * 1, 100 * 1);
        this.strength = this.getRandomStat(5 * 1, 15 * 1);
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