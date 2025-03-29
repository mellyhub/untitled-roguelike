import weapons from "./weapons.js"; // importerar vapen från weapons.js
import classes from "./classes.js"; // importerar klasser från classes.js

const player = {
		name: "Player",
		health: 100,
		weapon: weapons.big_axe, // sätter spelarens vapen till dagger från weapons.js
		class: classes.warrior, // sätter spelarens klass till warrior
		stats: {
			...classes.warrior.stats, // Spread operator to copy warrior stats
			strength: 0,
			agility: 0,
			intelligence: 0,
		},
		talentPoints: 0,
		level: 1,
		
};

export default player;