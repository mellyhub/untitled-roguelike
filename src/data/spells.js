const spells = {
    stab: {
        name: "Stab",
        damage: 70,
    },
    frostbolt: {
        name: "Frostbolt",
        damage: function(attackerStats){
            return attackerStats.strength * 5;
        }
    },
    fireball: {
        name: "Fireball",
        damage: function(attackerStats){
            return attackerStats.strength * 5;
        }
    },
    fire_breath: {
        name: "Fire Breath",
        damage: function(attackerStats){
            return attackerStats.strength * 5;
        }
    },
    tail_whip: {
        name: "Tail Whip",
        damage: function(attackerStats){
            return attackerStats.strength * 5;
        }
    },
    bite: {
        name: "Bite",
        damage: function(attackerStats){
            return attackerStats.strength * 5;
        }
    },
    heavy_swing: {
        name: "Heavy Swing",
        damage: function(attackerStats){
            return attackerStats.strength * 5;
        }
    },
};

export default spells;