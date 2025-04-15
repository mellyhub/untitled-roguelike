const talentConfig = [
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
    },
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
];

export default talentConfig;