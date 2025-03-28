// hårdkodade vapen

const weapons = {
    dagger: {
        name: "Dagger",
        castable:
        {
            stab: {
                name: "Stab",
                damage: 10
            }
        }
    },
    staff: {
        name: "Staff",
        castable:
        {
            frostbolt: {
                name: "Frostbolt",
                damage: 10
            },
            fireball: {
                name: "Fireball",
                damage: 20
            }
        }
    },
    dragon: {
        name: "Dragon",
        castable:
        {
            fire_breath: {
                name: "Fire Breath",
                damage: 30
            },
            tail_whip: {
                name: "Tail Whip",
                damage: 10
            },
            bite: {
                name: "Bite",
                damage: 20
            }
        }
    },
};

export default weapons;