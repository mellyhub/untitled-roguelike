// abstract class
export class Player {
    name;
    health;
    energy;
    maxEnergy;
    weapon;
    inventory = [];
    spells;
    spellbook = [];
    class;
    stats;
    resource;
    lastAction;
    talentPoints;
    level;
    score;
    image;
    permanentEffects = [];
    activeEffects = [];
    lastAction = null;
    talentPoints = 50;
    level = 1;
    score = 0;
    talents = {};
    hasRevived = false;

    processActiveEffects() {
        this.activeEffects = this.activeEffects.filter(effect => {
            effect.applyEffect();
            effect.remainingTurns--;
    
            // remove effect if expired
            if (effect.remainingTurns <= 0) {
                if (effect.removeEffect) {
                    effect.removeEffect(); // call the removeEffect function if it exists
                }
                console.log(`${effect.name} effect on ${this.name} has expired.`);
                return false; // remove effect
            }
    
            return true; // keep effect
        });
    }

    removeAllActiveEffects() {
        this.activeEffects.forEach(effect => {
            if (effect.removeEffect) {
                effect.removeEffect();
            }
            console.log(`Removed effect: ${effect.name} from ${this.name}`);
        });
        this.activeEffects = [];
    }

    handleCrit(spell) {
        if (this.stats.critChance > Math.random()) {
            console.log("Critical hit!");
            return spell ? 
                spell.damage(this.stats) * this.stats.critDamage : 
                this.weapon.at(-1).damage * this.stats.strength * 0.1 * this.stats.critDamage;
        } else {
            return spell ?
                spell.damage(this.stats) : 
                this.weapon.at(-1).damage * this.stats.strength * 0.1;
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

    increaseLevel(amount) {
        this.level += amount;
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