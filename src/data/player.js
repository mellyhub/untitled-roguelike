import weapons from "./weapons.js"; // importerar vapen från weapons.js
import classes from "./classes.js"; // importerar klasser från classes.js

const player = {
		name: "Player",
		health: 1000,
		weapon: weapons.big_axe, // sätter spelarens vapen till dagger från weapons.js
		class: classes.warrior, // sätter spelarens klass till warrior
		stats: classes.warrior.stats,
		talentPoints: 0,
		level: 1,
		
};

export default player;