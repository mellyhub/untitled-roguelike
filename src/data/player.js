// abstract class
export class Player {
    name;
    health;
    energy;
    maxEnergy;
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
    image;
    permanentEffects;

    handleCrit(spell) {
        if (this.stats.critChance > Math.random()) {
            console.log("Critical hit!");
            return spell ? 
                spell.damage(this.stats) * this.stats.critDamage : 
                this.weapon.damage * this.stats.strength * 0.1 * this.stats.critDamage;
        } else {
            return spell ?
                spell.damage(this.stats) : 
                this.weapon.damage * this.stats.strength * 0.1;
        }
    }

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