const spells = {
    stab: {
        type: "Placeholder",
        name: "Stab",
        cost: 20,
        damage(attackerStats) {
            return 25 + attackerStats.agility * 2 + attackerStats.strength * 2;
        }
    },
    frostbolt: {
        type: "Frost",
        name: "Frostbolt",
        cost: 20,
        damage(attackerStats) {
            return 10 + attackerStats.intelligence * 3;
        }
    },
    fireball: {
        type: "Fire",
        name: "Fireball",
        cost: 30,
        damage(attacker) {
            return 25 + attacker.stats.intelligence * 3;
        }
    },
    fire_breath: {
        type: "Fire",
        name: "Fire Breath",
        cost: 25,
        damage(attackerStats) {
            return 25 + attackerStats.intelligence * 2;
        }
    },
    tail_whip: {
        type: "Placeholder",
        name: "Tail Whip",
        cost: 15,
        damage(attackerStats) {
            return 25 + attackerStats.strength * 2;
        }
    },
    bite: {
        type: "Placeholder",
        name: "Bite",
        cost: 15,
        damage(attackerStats) {
            return 25 + attackerStats.strength * 2;
        }
    },
    heavy_swing: {
        type: "Placeholder",
        name: "Heavy Swing",
        cost: 25,
        damage(attackerStats) {
            return 25 + attackerStats.strength * 2;
        }
    },

    /* aura_of_might: {
        type: "Placeholder",
        name: "Aura of Might",
        duration: 3,
        effect(attacker, target) {
            attacker.stats.strength += 10;
            console.log(`Taifun strenght: ${attacker.stats.strength}`)
            console.log(`${attacker.name} is empowered, increasing their strength by 10.`);
            attacker.activeEffects.push({
                name: this.name,
                remainingTurns: this.duration,
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
        duration: 3,
        effect(attacker, target) {
            console.log(`${attacker.name} casts Ignite on ${target.name}, applying damage over ${this.duration} turns.`);

            // should be made more modular
            target.activeEffects = target.activeEffects || [];
            target.activeEffects.push({
                name: this.name,
                remainingTurns: this.duration,
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
        duration: 3,
        effect(attacker, target) {
            console.log(`${attacker.name} casts Rejuvenation, applying healing over ${this.duration} turns.`);

            attacker.activeEffects.push({
                name: this.name,
                remainingTurns: this.duration,
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
        cost: 25,
        duration: Infinity,
        effect(attacker, target) {
            attacker.equipWeapon({
                name: "Conjured weapon",
                damage: 100,
                stats: {
                    strength: 1000,
                    agility: 1000,
                    intelligence: 1000,
                    defense: 1000,
                    critChance: 1000,
                    critDamage: 1000
                },
                coatings: []
            });

            /*
            const effect = attacker.permanentEffects.find(effect => effect.name === "Conjure+");
            if (effect) {
                effect.applyEffect(attacker);
            }
            */

            attacker.effectsHandler.addActiveEffect({
                name: this.name,
                type: "Buff",
                remainingTurns: this.duration,
                applyEffect: () => {
                    console.log(`${attacker.name} is using the conjured weapon.`);
                },
                removeEffect: () => {
                    attacker.popWeapon();
                    console.log("Conjured weapon has expired");
                }
            });
        },
        description: "Conjure a temporary weapon"
    },

    thunderclap: {
        type: "Placeholder",
        name: "Thunderclap",
        cost: 25,
        duration: 1, // stuns for 1 turn
        effect(attacker, target) {
            console.log(`${attacker.getName()} casts Thunderclap on ${target.getName()}, stunning them for ${this.duration} turns.`);
            target.effectsHandler.activeEffects.push({
                name: "Stunned",
                type: "Status",
                remainingTurns: this.duration,
                applyEffect: () => {
                    console.log(`${target.getName()} is stunned and cannot act.`);
                },
                removeEffect: () => {
                    console.log(`${target.getName()} is no longer stunned.`);
                }
            });
        },
        description: "Causes a shockwave, stunning the target for 1 turn."
    },

    arcane_surge: {
        type: "Placeholder",
        name: "Arcane Surge",
        cost: 25,
        duration: 3,
        effect(attacker, target) {
            console.log(`${attacker.name} casts Arcane Surge, increasing intellect for ${this.duration} turns.`);
            attacker.stats.intelligence += 10;
            attacker.activeEffects.push({
                name: "Arcane Surge",
                type: "Buff",
                remainingTurns: this.duration,
                applyEffect: () => {
                    console.log(`${attacker.name} is empowered by Arcane Surge`);
                },
                removeEffect: () => {
                    attacker.stats.intelligence -= 10;
                }
            });
        },
        description: "Temporarly increases intellect."
    },

    phantom_strike: {
        type: "Placeholder",
        name: "Phantom Strike",
        cost: 50,
        damage(attackerStats) {
            return 50 + attackerStats.strength * 2;
        },
        description: "Ignores enemy defense stat."
    },

    soul_shatter: {
        type: "Placeholder",
        name: "Soul Shatter",
        cost: 50,
        damage(attackerStats) {
            return 20 + attackerStats.strength * 2;
        },
        effect(attacker, target) {
            console.log(`${target.name} is affected by Soul Shatter, reducing their stats for the rest of the combat.`);
            
            if (!target.stats) {
                console.error("Target stats are undefined!");
                return;
            }

            target.stats.strength -= 3;
            target.stats.agility -= 3;
            target.stats.intelligence -= 3;

            target.activeEffects.push({
                name: "Soul Shatter",
                type: "Debuff",
                remainingTurns: Infinity, // effect lasts for the rest of combat
                applyEffect: () => {
                    console.log(`${target.name}'s stats are reduced by Soul Shatter.`);
                },
                removeEffect: () => {
                    target.stats.strength += 3;
                    target.stats.agility += 3;
                    target.stats.intelligence += 3;
                    console.log(`${target.name}'s stats have been restored after Soul Shatter.`);
                }
            });
        },
        description: "Reduces the target's main stats by 3 for the rest of the combat."
    },

    heal: {
        type: "Placeholder",
        name: "Heal",
        cost: 25,
        effect(attacker, target) {
            const healAmount = Math.round(10 * attacker.stats.intelligence);
            
            // Sets the attackers health to the healed health or the max attacker HP
            attacker.setHealth(Math.min(attacker.getHealth() + healAmount, attacker.getMaxHealth()));

            console.log(`${attacker.name} heals for ${healAmount}`);
        },
        description: "used for testing"
    },

    geomancy: {
        type: "Geomancy",
        name: "Geomancy",
        cost: 100,
        damage(attackerStats) {
            return 200 + attackerStats.intelligence * 2;
        },
    }
}
export default spells;
