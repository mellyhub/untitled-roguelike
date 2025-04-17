const talentConfig = {
    magic: [
        {
            name: "Conjure+",
            description: "Conjured weapons are 10% stronger.",
            maxPoints: 1,
            effect: (player) => {
                console.log(player);
                if (!player.permanentEffects.some(effect => effect.name === "Conjure+")) {
                    player.permanentEffects.push({
                        name: "Conjure+",
                        applyEffect: (player) => {

                            // i think something is bugged here >:()
                            if (player.weapon.at(-1).name === "Conjured weapon") {
                                player.weapon.at(-1).damage *= 1.1;
                                console.log(`Conjured weapon damage increased to ${player.weapon.at(-1).damage}`);
                                console.log(player);
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
        }
    ]
};

export default talentConfig;