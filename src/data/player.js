import weapons from "./weapons.js"; // Import weapons from weapons.js
import spells from "./spells.js"; // Import spells from spells.js

const player = {
    name: "Player",
    health: 200,
    energy: 100,
    weapon: weapons.big_axe, // The player starts with big_axe
    inventory: [],
    // hardcoded spells for testing
    spells: [spells.frostbolt, spells.aura_of_might, spells.rejuvenation, spells.ignite, spells.fireball], // Initialize an empty spells array
    spellbook: [],
    class: null,
    stats: null,
    lastAction: null,
    talentPoints: 50,
    level: 1,
    score: 0,
};

export default player;