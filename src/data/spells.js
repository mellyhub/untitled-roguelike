const spells = {
    stab: {
        name: "Stab",
        icon: "src/assets/images/spell-icons/frostbolt-icon.png",
        damage(attackerStats){
            return 25 + attackerStats.agility * 2 + attackerStats.strength * 2;
        }
    },
    frostbolt: {
        name: "Frostbolt",
        icon: "src/assets/images/spell-icons/frostbolt-icon.png",
        damage(attackerStats){
            return 10 + attackerStats.intelligence * 3;
        }
    },
    fireball: {
        name: "Fireball",
        icon: "src/assets/images/spell-icons/frostbolt-icon.png",
        damage(attackerStats){
            return 25 + attackerStats.strength * 2;
        }
    },
    fire_breath: {
        name: "Fire Breath",
        icon: "src/assets/images/spell-icons/frostbolt-icon.png",
        damage(attackerStats){
            return 25 + attackerStats.strength * 2;
        }
    },
    tail_whip: {
        name: "Tail Whip",
        icon: "src/assets/images/spell-icons/frostbolt-icon.png",
        damage(attackerStats){
            return 25 + attackerStats.strength * 2;
        }
    },
    bite: {
        name: "Bite",
        icon: "src/assets/images/spell-icons/frostbolt-icon.png",
        damage(attackerStats){
            return 25 + attackerStats.strength * 2;
        }
    },
    heavy_swing: {
        name: "Heavy Swing",
        icon: "src/assets/images/spell-icons/frostbolt-icon.png",
        damage(attackerStats){
            return 25 + attackerStats.strength * 2;
        }
    },
    aura_of_might: {
        name: "Aura of Might",
        icon: "src/assets/images/spell-icons/frostbolt-icon.png",
        effect(attacker) {
            attacker.stats.strength += 10;
            console.log(`${attacker.name} is empowered, increasing their strength by 10.`);
        },
        description: "Permanently increases strength by 10."
    },
};

export default spells;