const talentConfig = [
    {
        name: "Max HP",
        description: "Increases player's max HP by 10 per point.",
        effect: (player) => {
            player.maxHealth += 10;
            console.log(`Player's max HP increased to ${player.maxHealth}`);
        }
    },
    {
        name: "Energy",
        description: "Gain 5 energy when attacking.",
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
];

export default talentConfig;