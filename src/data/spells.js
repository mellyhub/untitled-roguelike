const spells = {
    stab: {
        name: "Stab",
        icon: null,
        damage(attackerStats){
            return 25 + attackerStats.agility * 2 + attackerStats.strength * 2;
        }
    },
    frostbolt: {
        name: "Frostbolt",
        icon: "frostbolt-icon",
        damage(attackerStats){
            return 10 + attackerStats.intelligence * 3;
        }
    },
    fireball: {
        name: "Fireball",
        icon: "fireball-icon",
        damage(attackerStats){
            return 25 + attackerStats.strength * 2;
        }
    },
    fire_breath: {
        name: "Fire Breath",
        icon: "fireball-icon",
        damage(attackerStats){
            return 25 + attackerStats.strength * 2;
        }
    },
    tail_whip: {
        name: "Tail Whip",
        icon: "frostbolt-icon",
        damage(attackerStats){
            return 25 + attackerStats.strength * 2;
        }
    },
    bite: {
        name: "Bite",
        icon: "bite-icon",
        damage(attackerStats){
            return 25 + attackerStats.strength * 2;
        }
    },
    heavy_swing: {
        name: "Heavy Swing",
        icon: "frostbolt-icon",
        damage(attackerStats){
            return 25 + attackerStats.strength * 2;
        }
    },
    aura_of_might: {
        name: "Aura of Might",
        icon: "strength-icon",
        effect(attacker) {
            attacker.stats.strength += 10;
            console.log(`${attacker.name} is empowered, increasing their strength by 10.`);
        },
        description: "Permanently increases strength by 10."
    },
};

export default spells;