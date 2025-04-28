const talentConfig = {

    offense: [
        {
            name: "Energy",
            description: "Gain 5 energy when attacking.",
            maxPoints: 1,
            effect: (player) => {
                if (!player.effectsHandler.permanentEffects.some(effect => effect.name === "Energy on Attack")) {
                    player.effectsHandler.addPermanentEffect({
                        name: "Energy on Attack",
                        type: "Buff",
                        applyEffect: () => {
                            player.setEnergy(Math.min(player.getEnergy() + 5, 100)); // cap energy at 100
                            console.log(`${player.getName()} gains 5 energy from "Energy on Attack". Current energy: ${player.getEnergy()}`);
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
                if (!player.weapons || player.weapons.length === 0) {
                    console.error("Player has no weapon equipped!");
                    return;
                }
                if (!player.effectsHandler.permanentEffects.some(effect => effect.name === "Blademaster")) {
                    player.effectsHandler.addPermanentEffect({
                        name: "Blademaster",
                        type: "Buff",
                        applyEffect: () => {
                            // to be implemented
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
                if (!player.effectsHandler.permanentEffects.some(effect => effect.name === "Shattering Blows")) {
                    player.effectsHandler.addPermanentEffect({
                        name: "Shattering Blows",
                        type: "Buff",
                        applyEffect: () => {
                            console.log(`${player.getName()}'s attack ignores 25% of enemy defense`);
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
                if (!player.effectsHandler.permanentEffects.some(effect => effect.name === "Executioner's precision")) {
                    player.effectsHandler.addPermanentEffect({
                        name: "Executioner's precision",
                        type: "Buff",
                        applyEffect: () => {
                            console.log(`${player.getName()} triggers Executioner's precision, amplifying damage`);
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
                if (!player.effectsHandler.permanentEffects.some(effect => effect.name === "Void Channeling")) {
                    player.effectsHandler.addPermanentEffect({
                        name: "Void Channeling",
                        type: "Buff",
                        applyEffect: (player, target, originalDamage, battleUI) => {
                            if (!target) {
                                console.error("Void Channeling: target is undefined");
                                return;
                            }
                            
                            if (!originalDamage || originalDamage <= 0) {
                                return; // No damage to repeat
                            }
                            
                            try {
                                if (Math.random() < 0.2) {  // 20% chance to trigger
                                    const repeatedDamage = Math.round(originalDamage * 0.5); // 50% of the original damage
                                    console.log(`${player.getName()} repeats the attack, dealing ${repeatedDamage} damage to ${target.getName()}.`);
                                    target.setHealth(target.getHealth() - repeatedDamage); // apply the repeated damage

                                    // display the repeated damage visually
                                    if (battleUI) {
                                        battleUI.displayDamageText(target, repeatedDamage);
                                    }
                                }
                            }
                            catch (error) {
                                console.error("Error in Void Channeling:", error);
                            }
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
                player.stats.maxHealth = Math.round(player.stats.maxHealth * 0.9);
                if (player.getHealth() > player.getMaxHealth()) {  // making sure you dont have more health than max health
                    player.setHealth(player.getMaxHealth());
                }
                player.stats.damageMultiplier = (player.stats.damageMultiplier || 1) + 0.0025;
                player.stats.strength++;
                player.stats.agility++;
                player.stats.intelligence++;
            }
        },
        {
            name: "Conjure+",
            description: "Conjured weapons are 10% stronger.",
            maxPoints: 1,
            effect: (player) => {
                if (!player.effectsHandler.permanentEffects.some(effect => effect.name === "Conjure+")) {
                    player.effectsHandler.addPermanentEffect({
                        name: "Conjure+",
                        type: "Buff",
                        applyEffect: () => {
                            const weapon = player.getCurrentWeapon();
                            if (weapon && weapon.name === "Conjured weapon") {
                                weapon.damage *= 1.1;
                                console.log(`Conjured weapon damage increased to ${weapon.damage}`);
                            }
                        },
                    });
                }
            }
        },
        {
            name: "Exploit Weakness",
            description: "Guarantees your attack to be a critical hit if the enemy is under a status effect.",
            maxPoints: 1,
            effect: (player) => {
                if (!player.effectsHandler.permanentEffects.some(effect => effect.name === "Exploit Weakness")) {
                    player.effectsHandler.addPermanentEffect({
                        name: "Exploit Weakness",
                        type: "Buff",
                        applyEffect: (player, target) => {
                            if (!target || !target.effectsHandler) {
                                return false;
                            }
                            
                            try {
                                if (target.effectsHandler.activeEffects.some(effect => effect.type === "Status")) {
                                    console.log(`${player.getName()} triggers Exploit Weakness, guaranteeing a critical hit`);
                                    return true; // Signal that this should be a critical hit
                                }
                            }
                            catch (error) {
                                console.error("Error in Exploit Weakness:", error);
                            }
                            return false;
                        },
                    });
                }
            }
        }
    ],

    defense: [
        {
            name: "Max HP",
            description: "Increases player's max HP by 10 per point.",
            maxPoints: 5,
            effect: (player) => {
                player.stats.maxHealth += 10;
                console.log(`Player's max HP increased to ${player.stats.maxHealth}`);
            }
        },
        {
            name: "Energy Shield",
            description: "Adds defense scaling with intelligence.",
            maxPoints: 5,
            effect: (player) => {
                player.stats.defense += player.stats.intelligence;
            }
        },
        {
            name: "Nimble Instinct",
            description: "Adds evasion scaling with agility.",
            maxPoints: 5,
            effect: (player) => {
                player.stats.evasion += (player.stats.agility * 0.01);
            }
        },
        {
            name: "Pact of Resillience",
            description: "Increases defense but reduces effectiveness of healing.",
            maxPoints: 5,
            effect: (player) => {
                player.stats.defense += 3;
                player.stats.healMultiplier = (player.stats.healMultiplier || 1) * 0.8;
            }
        },
        {
            name: "Mirror Shield",
            description: "Reflects a portion of incoming damage back at attackers.",
            maxPoints: 1,
            effect: (player) => {
                if (!player.effectsHandler.permanentEffects.some(effect => effect.name === "Mirror Shield")) {
                    player.effectsHandler.addPermanentEffect({
                        name: "Mirror Shield",
                        type: "Buff",
                        applyEffect: (player, attacker, damage) => {
                            if (!damage || damage <= 0) {
                                console.log("Mirror Shield: No damage to reflect");
                                return;
                            }
                            
                            try {
                                const reflectedDamage = Math.round(damage * 0.1); // reflects 10% of incoming damage
                                attacker.setHealth(attacker.getHealth() - reflectedDamage); // apply reflected damage to the attacker
                                console.log(`${attacker.getName()} takes ${reflectedDamage} reflected damage from Mirror Shield.`);
                            }
                            catch (error) {
                                console.error("Error in Mirror Shield reflection:", error);
                            }
                        },
                    });
                }
            }
        },
        {
            name: "Rebirth",
            description: "Grants 1 revive per combat.",
            maxPoints: 1,
            effect: (player) => {
                if (!player.effectsHandler.permanentEffects.some(effect => effect.name === "Rebirth")) {
                    player.effectsHandler.addPermanentEffect({
                        name: "Rebirth",
                        type: "Buff",
                        applyEffect: () => {
                            if (player.getHealth() <= 0 && !player.hasRevived) {
                                player.hasRevived = true; // mark the revive as used
                                player.setHealth(Math.round(player.getMaxHealth() * 0.3)); // restore 30% of max health
                                console.log(`${player.getName()} has been revived by Rebirth! Health restored to ${player.getHealth()}.`);
                            }
                        },
                        removeEffect: () => {
                            player.hasRevived = false; // reset revive for next combat
                        }
                    });
                }
            }
        },
        {
            name: "Warrior's Resolve",
            description: "Grants immunity from all status effects.",
            maxPoints: 1,
            effect: (player) => {
                if (!player.effectsHandler.permanentEffects.some(effect => effect.name === "Warrior's Resolve")) {
                    player.effectsHandler.addPermanentEffect({
                        name: "Warrior's Resolve",
                        type: "Buff",
                        applyEffect: () => {
                            if (player.effectsHandler.activeEffects.some(effect => effect.type === "Status")) {
                                const statusEffects = player.effectsHandler.activeEffects.filter(e => e.type === "Status");
                                statusEffects.forEach(effect => {
                                    console.log(`${player.getName()} has been cleansed from ${effect.name}.`);
                                    if (effect.removeEffect) effect.removeEffect();
                                });
                                player.effectsHandler.activeEffects = player.effectsHandler.activeEffects.filter(e => e.type !== "Status");
                            }
                        },
                    });
                }
            }
        }
    ],

    utility: [
        {
            name: "Vital Surge",
            description: "Heal 25 HP after defeating an enemy.",
            maxPoints: 1,
            effect: (player) => {
                if (!player.effectsHandler.permanentEffects.some(effect => effect.name === "Vital Surge")) {
                    player.effectsHandler.addPermanentEffect({
                        name: "Vital Surge",
                        type: "Buff",
                        applyEffect: () => {
                            const healMultiplier = player.stats.healMultiplier || 1;
                            const restoreAmount = Math.round(25 * healMultiplier);
                            player.setHealth(player.getHealth() + restoreAmount);
                            if (player.getHealth() > player.getMaxHealth()) {
                                player.setHealth(player.getMaxHealth());
                            }
                            console.log(`${player.getName()} restores ${restoreAmount} health from Vital Surge`);
                        },
                    });
                }
            }
        },
        {
            name: "Morbious",
            description: "Morbs the user",
            maxPoints: 5,
            effect: (player) => {
                player.stats.omnivamp += 0.05;
            },
            maxEffect: (player) => {
                console.log(`${player.getName()}: ITS MORBIN TIME!`);
                player.stats.omnivamp = 0.7; // morbious buff (see meeting notes 25/04/21)
            }
        },
        {
            name: "Toxic Coating",
            description: "Applies toxic coating to your weapon.",
            maxPoints: 1,
            effect: (player) => {
                const weapon = player.getCurrentWeapon();
                if (!weapon) {
                    console.error("No weapon equipped to apply Toxic Coating!");
                    return;
                }

                // check if coating is already applied
                if (weapon.coatings && weapon.coatings.some(coating => coating.name === "Toxic Coating")) {
                    console.log("Toxic Coating is already applied to the weapon.");
                    return;
                }
                else if (!weapon.coatings) {
                    weapon.coatings = [];
                }

                weapon.coatings.push({
                    name: "Toxic Coating",
                    chance: 1, // 100% chance to trigger on attack
                    effect: (attacker, target) => {
                        console.log(`${target.getName()} is poisoned by ${attacker.getName()}'s Toxic Coating!`);
                        target.effectsHandler.activeEffects.push({
                            name: "Poisoned",
                            type: "Status",
                            remainingTurns: 5,
                            applyEffect: () => {
                                target.setHealth(target.getHealth() - 20);
                                console.log(`${target.getName()} takes 20 damage from poison`);
                            },
                            removeEffect: () => {
                                console.log(`${target.getName()} is no longer poisoned`);
                            }
                        });
                    }
                });
            }
        },
        {
            name: "Paralysis Coating",
            description: "Applies paralysis coating to your weapon.",
            maxPoints: 1,
            effect: (player) => {
                const weapon = player.getCurrentWeapon();
                if (!weapon) {
                    console.error("No weapon equipped to apply Paralysis Coating!");
                    return;
                }

                // check if coating is already applied
                if (weapon.coatings && weapon.coatings.some(coating => coating.name === "Paralysis Coating")) {
                    console.log("Paralysis Coating is already applied to the weapon.");
                    return;
                }
                else if (!weapon.coatings) {
                    weapon.coatings = [];
                }

                weapon.coatings.push({
                    name: "Paralysis Coating",
                    //chance: 0.2, // 20% chance to trigger on attack
                    chance: 1,  // Currently hardcoded to 100% for testing purposes
                    effect: (attacker, target) => {
                        console.log(`${target.getName()} is paralyzed by ${attacker.getName()}'s Paralysis Coating!`);
                        target.effectsHandler.activeEffects.push({
                            name: "Paralyzed",
                            type: "Status",
                            remainingTurns: 3,
                            applyEffect: () => {
                                console.log(`${target.getName()} is paralyzed`);
                            },
                            removeEffect: () => {
                                console.log(`${target.getName()} is no longer paralyzed`);
                            }
                        });
                        // immediately apply the effect
                        const effect = target.effectsHandler.activeEffects.find(effect => effect.name === "Paralyzed");
                        if (effect) {
                            effect.applyEffect();
                        }
                    }
                });
            }
        },
    ],
};

export default talentConfig;