// hårdkodade vapen för tillfället, här kan vi implementera slumpmässighet i framtiden

// valde att dela upp "castable" i en egen array för att kunna ha flera olika casts på samma vapen
// staven har till exempel två olika casts, frostbolt och fireball

const weapons = [
    {
        name: "Dagger",
        castable: [
            {
                name: "Stab",
                damage: 10
            }
        ]
    },
    {
        name: "Staff",
        castable: [
            {
                name: "Frostbolt",
                damage: 10
            },
            {
                name: "Fireball",
                damage: 15
            }
        ]
    },
    {
        name: "Dragon",
        castable: [
            {
                name: "Fire Breath",
                damage: 30
            },
            {
                name: "Tail Whip",
                damage: 10
            },
            {
                name: "Bite",
                damage: 20
            }
        ]
    }
];

export default weapons;