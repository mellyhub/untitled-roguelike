const spells = {
    stab: {
        name: "Stab",
        damage(attackerStats){
            return 25 + attackerStats.agility * 2 + attackerStats.strength * 2;
        }
    },
    frostbolt: {
        name: "Frostbolt",
        damage(attackerStats){
            return 10 + attackerStats.intelligence * 3;
        }
    },
    fireball: {
        name: "Fireball",
        damage(attackerStats){
            return 25 + attackerStats.strength * 2;
        }
    },
    fire_breath: {
        name: "Fire Breath",
        damage(attackerStats){
            return 25 + attackerStats.strength * 2;
        }
    },
    tail_whip: {
        name: "Tail Whip",
        damage(attackerStats){
            return 25 + attackerStats.strength * 2;
        }
    },
    bite: {
        name: "Bite",
        damage(attackerStats){
            return 25 + attackerStats.strength * 2;
        }
    },
    heavy_swing: {
        name: "Heavy Swing",
        damage(attackerStats){
            return 25 + attackerStats.strength * 2;
        }
    },
};

export default spells;