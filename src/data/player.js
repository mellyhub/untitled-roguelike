import weapons from "./weapons.js"; // Import weapons from weapons.js
import spells from "./spells.js"; // Import spells from spells.js

const player = {
    name: "Player",
    health: 200,
    weapon: weapons.big_axe, // The player starts with big_axe
    spells: [], // Initialize an empty spells array
    class: null,
    stats: null,
    talentPoints: 50,
    level: 1,
};

export default player;