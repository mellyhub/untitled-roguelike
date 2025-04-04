import weapons from "./weapons.js"; // Import weapons from weapons.js
import spells from "./spells.js"; // Import spells from spells.js

const player = {
    name: "Player",
    health: 200,
    energy: 100,
    weapon: weapons.big_axe, // The player starts with big_axe
    inventory: [],
    spells: [spells.frostbolt, spells.aura_of_might, spells.ignite], // Initialize an empty spells array
    spellbook: [],
    class: null,
    stats: null,
    talentPoints: 50,
    level: 1,
};

export default player;