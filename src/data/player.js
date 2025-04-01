import weapons from "./weapons.js"; // importerar vapen från weapons.js

const player = {
	name: "Player",
	health: 1000,
	weapon: weapons.big_axe, // spelaren börjar alltid med big_axe
	class: null,
	stats: null,
	talentPoints: 50,
	level: 1,
};

export default player;