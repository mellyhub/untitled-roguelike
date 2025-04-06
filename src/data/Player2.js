// abstract class
export class Player {
    name;
    health;
    energy;
    weapon;
    inventory;
    spells;
    spellbook;
    class;
    stats;
    resource;
    lastAction;
    talentPoints;
    level;
    score;

    increaseHealth(amount) {
        this.health += amount;
    }

    increaseEnergy(amount) {
        this.energy += amount;
    }

    swapWeapon(newWeapon) {
        this.weapon = newWeapon;
    }

    addItemToInventory(item) {
        this.inventory.push(item);
    }

    addSpell(spell) {
        this.spells.push(spell);
    }

    increaseStat(stat, amount) {
        this.stats.stat += amount;
    }

    increaseTalentPoints(amount) {
        this.talentPoints += amount;
    }

    increaseScore(amount) {
        this.score =+ amount;
    }

    setLastAction(action) {
        this.lastAction = action;
    }
}