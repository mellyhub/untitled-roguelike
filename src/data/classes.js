// ett förslag på hur klasser kan se ut

const classes = {
    warrior: {
        name: "Warrior",
        description: "En mäktig krigare med stor svärd",
        stats: {
            strength: 10,
            agility: 5,
            intelligence: 2
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
            intelligence: 12
        },
        resource: {
            mana: 100
        }
    },
};

export default classes;