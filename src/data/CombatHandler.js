// Might not use this, maybe unnecessary (CURRENTLY NOT USED)
export class CombatHandler {

    constructor(character) {
        this.character = character;
    }

    calculateBaseDamage() {
        //this.damageThisTurn += Math.round(this.character.weapons.at(-1).damage * this.character.stats.strength * 0.1);
        this.damageThisTurn += 10;
    }

    handleResource() {
        this.damageThisTurn *= 1 + this.character.getResource() * 0.002;
    }

    calculateAttackDamage() {
        return this.character.weapons.at(-1).damage;
    }

    castSpell(target, spell) {
        if (spell.effect) {
            spell.effect(this.character, target);
        }
        if (spell.damage) {
            return Math.round(spell.damage(this.character));
        }
    }

    calculateSpellDamage(spell) {
        return 50;
    }
}