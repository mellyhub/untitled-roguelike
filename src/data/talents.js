const talentConfig = {

    magic: [
        {
            name: "Conjure+",
            description: "Conjured weapons are 10% stronger.",
            maxPoints: 1,
            effect: (player) => {
                if (!player.permanentEffects.some(effect => effect.name === "Conjure+")) {
                    player.permanentEffects.push({
                        name: "Conjure+",
                        applyEffect: (player) => {
                            if (player.weapon.at(-1).name === "Conjured weapon") {
                                player.weapon.at(-1).damage *= 1.1;
                                console.log(`Conjured weapon damage increased to ${player.weapon.at(-1).damage}`);
                            }
                        },
                    });
                }
            }
        },

        {
            name: "Mirror Shield",
            description: "Reflects a portion of incoming damage back at attackers.",
            maxPoints: 1,
            effect: (player) => {
                if (!player.permanentEffects.some(effect => effect.name === "Mirror Shield")) {
                    player.permanentEffects.push({
                        name: "Mirror Shield",
                        applyEffect: (player, attacker, damage) => {
                            const reflectedDamage = Math.round(damage * 0.1); // reflects 10% of incoming damage
                            attacker.health -= reflectedDamage; // apply reflected damage to the attacker
                            console.log(`${attacker.name} takes ${reflectedDamage} reflected damage from Mirror Shield.`);
                        },
                    });
                }
            }
        },

        {
            name: "Void Channeling",
            description: "Repeats your attack, dealing 50% of the damage.",
            maxPoints: 1,
            effect: (player) => {
                if (!player.permanentEffects.some(effect => effect.name === "Void Channeling")) {
                    player.permanentEffects.push({
                        name: "Void Channeling",
                        applyEffect: (player, target, originalDamage, battleUI) => {
                            if (Math.random() < 0.2) {  // 20% chance to trigger
                                const repeatedDamage = Math.round(originalDamage * 0.5); // 50% of the original damage
                                console.log(`${player.name} repeats the attack, dealing ${repeatedDamage} damage to ${target.name}.`);
                                target.health -= repeatedDamage; // apply the repeated damage

                                // display the repeated damage visually
                                console.log(battleUI);
                                battleUI.displayDamageText("enemy", repeatedDamage);
                            }
                        },
                    });
                }
            }
        }
    ],

    physical: [
        {
            name: "Energy",
            description: "Gain 5 energy when attacking.",
            maxPoints: 1,
            effect: (player) => {
                if (!player.permanentEffects.some(effect => effect.name === "Energy on Attack")) {
                    player.permanentEffects.push({
                        name: "Energy on Attack",
                        applyEffect: (player) => {
                            player.energy = Math.min(player.energy + 5, 100); // cap energy at 100
                            console.log(`${player.name} gains 5 energy from "Energy on Attack". Current energy: ${player.energy}`);
                        }
                    });
                }
            }
        },

        {
            name: "Blademaster",
            description: "Increases damage dealt by swords by 5% per point.",
            maxPoints: 5,
            effect: (player) => {
                if (!player.weapon || player.weapon.length === 0) {
                    console.error("Player has no weapon equipped!");
                    return;
                }
                if (!player.permanentEffects.some(effect => effect.name === "Blademaster")) {
                    player.permanentEffects.push({
                        name: "Blademaster",
                        applyEffect: (player) => {
                            const weapon = player.weapon.at(-1);
                            if (weapon && weapon.type === "Sword") {
                                weapon.damage *= 1.05;
                                console.log(`Sword damage is increased to ${weapon.damage}`);
                            }
                        },
                    });
                }
            }
        },

        {
            name: "Battle Trance",
            description: "Puts the player into a hightened state of awareness, increasing critical hit chance.",
            maxPoints: 5,
            effect: (player) => {
                player.stats.critChance += 0.1;
                console.log(`Player's critical chanse incresed to ${player.stats.critChance}`);
            }
        },

        {
            name: "Shattering Blows",
            description: "Attacks ignore 25% of enemy defense.",
            maxPoints: 1,
            effect: (player) => {
                if (!player.permanentEffects.some(effect => effect.name === "Shattering Blows")) {
                    player.permanentEffects.push({
                        name: "Shattering Blows",
                        applyEffect: (player) => {
                            console.log(`${player.name}'s attack ignores 25% of enemy defense`);
                        },
                    });
                }
            }
        },

        {
            name: "Executioner's precision",
            description: "Deal +50% damage to enemies below 25% HP.",
            maxPoints: 1,
            effect: (player) => {
                if (!player.permanentEffects.some(effect => effect.name === "Executioner's precision")) {
                    player.permanentEffects.push({
                        name: "Executioner's precision",
                        applyEffect: (player) => {
                            console.log(`${player.name} triggers Executioner's precision, amplifying damage`);
                        },
                    });
                }
            }
        },

        {
            name: "Pact of Power",
            description: "Boosts your stats for the cost of max health.",
            maxPoints: 5,
            effect: (player) => {
                player.maxHealth = Math.round(player.maxHealth * 0.9);
                if (player.health > player.maxHealth) {  // making sure you dont have more health than max health
                    player.health = player.maxHealth;
                }
                player.damageMultiplier += 0.0025;
                player.stats.strength++;
                player.stats.agility++;
                player.stats.intelligence++;
            }
        },

        {
            name: "Pact of Resillience",
            description: "Increases defense but reduces effectiveness of healing.",
            maxPoints: 5,
            effect: (player) => {
                player.stats.defense += 3;
                player.healMultiplier *= 0.8;
            }
        },

    ],

    defense: [
        {
            name: "Max HP",
            description: "Increases player's max HP by 10 per point.",
            maxPoints: 5,
            effect: (player) => {
                player.maxHealth += 10;
                console.log(`Player's max HP increased to ${player.maxHealth}`);
            }
        },

        {
            name: "Energy Shield",
            description: "Adds defense scaling with intelligence.",
            maxPoints: 5,
            effect: (player) => {
                player.stats.defense += player.stats.intelligence;
                console.log(player.stats);
            }
        },

        {
            name: "Nimble Instinct",
            description: "Adds evasion scaling with agility.",
            maxPoints: 5,
            effect: (player) => {
                player.stats.evasion += (player.stats.agility * 0.01);
                console.log(player.stats);
            }
        },

        {
            name: "Rebirth",
            description: "Grants 1 revive per combat.",
            maxPoints: 1,
            effect: (player) => {
                if (!player.permanentEffects.some(effect => effect.name === "Rebirth")) {
                    player.permanentEffects.push({
                        name: "Rebirth",
                        applyEffect: (player) => {
                            if (player.health <= 0 && !player.hasRevived) {
                                player.hasRevived = true; // mark the revive as used
                                player.health = Math.round(player.maxHealth * 0.3); // restore 30% of max health
                                console.log(`${player.name} has been revived by Rebirth! Health restored to ${player.health}.`);
                            }
                        },
                        removeEffect: () => {
                            player.hasRevived = false; // reset revive for next combat
                        }
                    });
                }
            }
        },
    ],

    utility: [
        {
            name: "Morbious",
            description: "Morbs the user",
            maxPoints: 5,
            effect: (player) => {
                player.stats.omnivamp += 0.05;
            },
            maxEffect: (player) => {
                console.log(`${player.name}: ITS MORBIN TIME!`);
            }
        },

        {
            name: "Vital Surge",
            description: "Heal 25 HP after defeating an enemy.",
            maxPoints: 1,
            effect: (player) => {
                if (!player.permanentEffects.some(effect => effect.name === "Vital Surge")) {
                    player.permanentEffects.push({
                        name: "Vital Surge",
                        applyEffect: (player) => {
                            const restoreAmount = Math.round(25 * player.healMultiplier);
                            player.health += restoreAmount;
                            if (player.health > player.maxHealth) {
                                player.health = player.maxHealth;
                            }
                            console.log(`${player.name} restores ${restoreAmount} health from Vital Surge`);
                        },
                    });
                }
            }
        },

        {
            name: "Paralysis Coating",
            description: "Applies paralysis coating to your weapon.",
            maxPoints: 1,
            effect: (player) => {
                const weapon = player.weapon.at(-1);
                if (!weapon) {
                    console.error("No weapon equipped to apply Paralysis Coating!");
                    return;
                }

                // check if coating is already applied
                if (weapon.coatings.some(coating => coating.name === "Paralysis Coating")) {
                    console.log("Paralysis Coating is already applied to the weapon.");
                    return;
                }

                weapon.coatings.push({
                    name: "Paralysis Coating",
                    chance: 0.2, // 20% chance to trigger on attack
                    effect: (attacker, target) => {
                        console.log(`${target.name} is paralyzed by ${attacker.name}'s Paralysis Coating!`);
                        target.activeEffects.push({
                            name: "Paralyzed",
                            remainingTurns: 3,
                            applyEffect: () => {
                                target.statusEffects.paralysed = true;
                            },
                            removeEffect: () => {
                                target.statusEffects.paralysed = false;
                            }
                        });

                        // immediately apply the effect
                        const paralysisEffect = target.activeEffects.find(effect => effect.name === "Paralyzed");
                        if (paralysisEffect) {
                            paralysisEffect.applyEffect();
                        }
                    }
                });
            }
        },

        {
            name: "Toxic Coating",
            description: "Applies toxic coating to your weapon.",
            maxPoints: 1,
            effect: (player) => {
                const weapon = player.weapon.at(-1);
                if (!weapon) {
                    console.error("No weapon equipped to apply Toxic Coating!");
                    return;
                }

                // check if coating is already applied
                if (weapon.coatings.some(coating => coating.name === "Toxic Coating")) {
                    console.log("Toxic Coating is already applied to the weapon.");
                    return;
                }
                weapon.coatings.push({
                    name: "Toxic Coating",
                    chance: 1, // 100% chance to trigger on attack
                    effect: (attacker, target) => {
                        console.log(`${target.name} is poisoned by ${attacker.name}'s Toxic Coating!`);
                        target.activeEffects.push({
                            name: "Poisoned",
                            remainingTurns: 5,
                            applyEffect: () => {
                                target.statusEffects.poisoned = true;
                                target.health -= 20;
                            },
                            removeEffect: () => {
                                target.statusEffects.poisoned = false;
                            }
                        });

                        // immediately apply the effect
                        const poisonEffect = target.activeEffects.find(effect => effect.name === "Poisoned");
                        if (poisonEffect) {
                            poisonEffect.applyEffect();
                        }
                    }
                });
            }
        }
    ]
};

export default talentConfig;