const spells = {
    stab: {
        type: "Placeholder",
        name: "Stab",
        damage(attackerStats) {
            return 25 + attackerStats.agility * 2 + attackerStats.strength * 2;
        }
    },
    frostbolt: {
        type: "Frost",
        name: "Frostbolt",
        damage(attackerStats) {
            return 10 + attackerStats.intelligence * 3;
        }
    },
    fireball: {
        type: "Fire",
        name: "Fireball",
        damage(attackerStats) {
            return 25 + attackerStats.intelligence * 3;
        }
    },
    fire_breath: {
        type: "Fire",
        name: "Fire Breath",
        damage(attackerStats) {
            return 25 + attackerStats.intelligence * 2;
        }
    },
    tail_whip: {
        type: "Placeholder",
        name: "Tail Whip",
        damage(attackerStats) {
            return 25 + attackerStats.strength * 2;
        }
    },
    bite: {
        type: "Placeholder",
        name: "Bite",
        damage(attackerStats) {
            return 25 + attackerStats.strength * 2;
        }
    },
    heavy_swing: {
        type: "Placeholder",
        name: "Heavy Swing",
        damage(attackerStats) {
            return 25 + attackerStats.strength * 2;
        }
    },
    /* aura_of_might: {
        type: "Placeholder",
        name: "Aura of Might",
        turnDuration: 3,
        effect(attacker, target) {
            attacker.stats.strength += 10;
            console.log(`Taifun strenght: ${attacker.stats.strength}`)
            console.log(`${attacker.name} is empowered, increasing their strength by 10.`);
            //attacker.activeEffects = attacker.activeEffects || [];
            attacker.activeEffects.push({
                name: this.name,
                remainingTurns: this.turnDuration,
                applyEffect: () => {
                    console.log(`${attacker.name} is empowered by Aura of Might.`);
                },
                removeEffect: () => {
                    attacker.stats.strength -= 10;
                    console.log(`${attacker.name}'s Aura of Might has expired, removing the strength bonus.`);
                }
            });
            console.log(attacker);
        },
        description: "Increases strength for 3 turns."
    },
    ignite: {
        type: "Fire",
        name: "Ignite",
        damage() {
            return 10;
        },
        damagePerTurn: 5,
        turnDuration: 3,
        effect(attacker, target) {
            console.log(`${attacker.name} casts Ignite on ${target.name}, applying damage over ${this.turnDuration} turns.`);

            // should be made more modular
            target.activeEffects = target.activeEffects || [];
            target.activeEffects.push({
                name: this.name,
                remainingTurns: this.turnDuration,
                applyEffect: () => {
                    target.health -= this.damagePerTurn;
                    console.log(`${target.name} takes ${this.damagePerTurn} damage from Ignite.`);
                }
            });
        }
    },
    rejuvenation: {
        type: "Placeholder",
        name: "Rejuvenation",
        healPerTurn: 50,
        turnDuration: 3,
        effect(attacker, target) {
            console.log(`${attacker.name} casts Rejuvenation, applying healing over ${this.turnDuration} turns.`);

            attacker.activeEffects.push({
                name: this.name,
                remainingTurns: this.turnDuration,
                applyEffect: () => {
                    // scale healing with focus points
                    if (attacker.class && attacker.class.name === "Mage") {
                        this.healPerTurn *= 1 + attacker.class.resource.focusPoints * 0.1; // increase healing by 10% per focus point
                        console.log(this.healPerTurn);
                    }
                    attacker.health += this.healPerTurn;
                    console.log(`${attacker.name} heals ${this.healPerTurn} from Rejuvenation.`);
                }
            });
        },
    }, */
    conjure_weapon: {
        type: "Conjuration",
        name: "Conjure Weapon",
        turnDuration: 3,
        effect(attacker) {
            attacker.weapon.push({
                name: "Conjured weapon",
                damage: 100,
            });

            const effect = attacker.permanentEffects.find(effect => effect.name === "Conjure+");
            if (effect) {
                effect.applyEffect(attacker);
            }

            attacker.activeEffects = attacker.activeEffects || [];
            attacker.activeEffects.push({
                name: this.name,
                remainingTurns: this.turnDuration,
                applyEffect: () => {
                    console.log(`${attacker.name} is using the conjured weapon.`);
                },
                removeEffect: () => {
                    attacker.weapon.pop();
                    console.log(attacker.weapon);
                    console.log("Conjured weapon has expired");
                }
            });
            console.log(attacker);
        },
        description: "Conjure a temporary weapon"
    },
    thunderclap: {
        type: "Placeholder",
        name: "Thunderclap",
        turnDuration: 2, // stun lasts for 1 turn
        effect(attacker, target) {
            console.log(`${attacker.name} casts Thunderclap on ${target.name}, stunning them for ${this.turnDuration} turn(s).`);

            // add the stun effect to the target's active effects
            // (maybe status effects should be stored differently?)
            target.activeEffects.push({
                name: "Stunned",
                remainingTurns: this.turnDuration,
                applyEffect: () => {
                    target.stunned = true; // mark target as stunned
                    console.log(`${target.name} is stunned and cannot act.`);
                },
                removeEffect: () => {
                    target.stunned = false; // remove stun after duration
                    console.log(`${target.name} is no longer stunned.`);
                }
            });

            // immediately apply the stun
            const stunEffect = target.activeEffects.find(effect => effect.name === "Stunned");
            if (stunEffect) {
                stunEffect.applyEffect();
            }
            console.log(target);
        },
        description: "Causes a shockwave, stunning the target for 1 turn."
    }
}
export default spells;
