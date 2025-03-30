import weapons from "./weapons.js"; // importerar vapen från weapons.js
import classes from "./classes.js"; // importerar klasser från classes.js

const player = {
	name: "Player",
	health: 1000,
	weapon: weapons.big_axe, // spelaren börjar alltid med big_axe
	class: null,
	stats: null,
	talentPoints: 0,
	level: 1,
};

export function initializePlayer(selectedClass) {
	player.class = selectedClass;
	player.stats = selectedClass.stats;
}

export default player;