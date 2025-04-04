// ett förslag på hur klasser kan se ut

const classes = {
    warrior: {
        name: "Warrior",
        description: "En mäktig krigare med stor svärd",
        stats: {
            strength: 10,
            agility: 5,
            intelligence: 2,
            critChance: 0.5,
            critDamage: 1.5
        },  
        resource: {
            rage: 0
        }
    },
    mage: {
        name: "Mage",
        description: "En mäktig magiker med stor stav",
        stats: {
            strength: 2,
            agility: 3,
            intelligence: 12,
            critChance: 0.05,
            critDamage: 1.5
        },
        resource: {
            focusPoints: 0
        }
    },
    rogue: {
        name: "Rogue",
        description: "En snabb och smidig tjuv med stor kniv",
        stats: {
            strength: 3,
            agility: 10,
            intelligence: 4,
            critChance: 0.1,
            critDamage: 1.5
        },
        resource: {
            comboPoints: 3
        }
    },
};

export default classes;