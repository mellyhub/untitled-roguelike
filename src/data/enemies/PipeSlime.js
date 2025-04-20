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
    maxHealth;
    strength;
    energy = 100;
    maxEnergy = 100;

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
        this.maxHealth = 190 + weight * 10;
        this.strength = 100 + weight * 10;
    }

    attack(target) {

        // stun and paralysis currently do the same thing
        if (this.statusEffects.stunned || this.statusEffects.paralysed === true) {
            console.log(`${this.name} is incapacitated and cannot attack.`);
            return "";
        }

        let damage = 50;

        // check for mirror shield talent
        const mirrorShieldEffect = target.permanentEffects.find(effect => effect.name === "Mirror Shield");
        if (mirrorShieldEffect) {
            mirrorShieldEffect.applyEffect(target, this, damage); // reflect damage back to the attacker
            damage *= 0.9; // mitigate damage
        }

        // enemy damage handling needs to be rewritten
        
        target.health -= damage;
        console.log(`${this.name} attacks ${target.name} for ${damage} damage.`);



        return damage;
    }
}