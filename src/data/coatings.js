// Coating configuration
export const coatingConfig = {
    toxic: {
        name: "Toxic Coating",
        description: "Poisons the target, dealing damage over time",
        chance: 1, // Hardcoded to trigger every time, used for testing
        //chance: 0.2, // 20% chance to trigger
        effect: (attacker, target) => {
            try {
                if (!target || !target.effectsHandler) {
                    console.error("Invalid target for Toxic Coating");
                    return;
                }

                // Ensure we're not poisoning the attacker
                if (attacker === target) {
                    console.error("Cannot apply Toxic Coating to self!");
                    return;
                }

                console.log(`${attacker.getName()} attempts to poison ${target.getName()} with Toxic Coating!`);
                target.effectsHandler.tryApplyStatusEffect({
                    name: "Poisoned",
                    type: "Status",
                    remainingTurns: 5,
                    applyEffect: () => {
                        const damage = 20;
                        target.setHealth(target.getHealth() - damage);
                        console.log(`${target.getName()} takes ${damage} damage from poison`);
                    },
                    removeEffect: () => {
                        console.log(`${target.getName()} is no longer poisoned`);
                    }
                });
            }
            catch (error) {
                console.error("Error applying Toxic Coating:", error);
            }
        }
    },
    paralysis: {
        name: "Paralysis Coating",
        description: "Chance to paralyze the target, preventing them from acting",
        chance: 1, // Hardcoded to trigger every time, used for testing
        //chance: 0.2, // 20% chance to trigger
        effect: (attacker, target) => {
            try {
                if (!target || !target.effectsHandler) {
                    console.error("Invalid target for Paralysis Coating");
                    return;
                }

                // Ensure we're not paralyzing the attacker
                if (attacker === target) {
                    console.error("Cannot apply Paralysis Coating to self!");
                    return;
                }

                console.log(`${attacker.getName()} attempts to paralyze ${target.getName()} with Paralysis Coating!`);
                target.effectsHandler.tryApplyStatusEffect({
                    name: "Paralyzed",
                    type: "Status",
                    remainingTurns: 3,
                    applyEffect: () => {
                        console.log(`${target.getName()} is paralyzed and cannot act`);
                    },
                    removeEffect: () => {
                        console.log(`${target.getName()} is no longer paralyzed`);
                    }
                });
            }
            catch (error) {
                console.error("Error applying Paralysis Coating:", error);
            }
        }
    }
};

// Coating management functions
export const Coatings = {
    // Apply a coating to a weapon
    applyCoating(weapon, coatingName) {
        try {
            if (!weapon) {
                console.error("No weapon equipped to apply coating!");
                return false;
            }

            const coating = coatingConfig[coatingName];
            if (!coating) {
                console.error(`Invalid coating name: ${coatingName}`);
                return false;
            }

            // Initialize coatings array if it doesn't exist
            if (!weapon.coatings) {
                weapon.coatings = [];
            }

            // Check if coating is already applied
            if (weapon.coatings.some(c => c.name === coating.name)) {
                console.log(`${coating.name} is already applied to the weapon.`);
                return false;
            }

            // Add the coating
            weapon.coatings.push({
                name: coating.name,
                description: coating.description,
                chance: coating.chance,
                effect: coating.effect
            });

            console.log(`Applied ${coating.name} to ${weapon.name}`);
            return true;
        }
        catch (error) {
            console.error("Error applying coating:", error);
            return false;
        }
    },

    // Remove a coating from a weapon
    removeCoating(weapon, coatingName) {
        try {
            if (!weapon || !weapon.coatings) {
                return false;
            }

            const initialLength = weapon.coatings.length;
            weapon.coatings = weapon.coatings.filter(coating => coating.name !== coatingName);
            
            if (weapon.coatings.length < initialLength) {
                console.log(`Removed ${coatingName} from ${weapon.name}`);
                return true;
            }
            
            return false;
        }
        catch (error) {
            console.error("Error removing coating:", error);
            return false;
        }
    },

    // Remove all coatings from a weapon
    removeAllCoatings(weapon) {
        try {
            if (!weapon || !weapon.coatings) {
                return false;
            }

            const hadCoatings = weapon.coatings.length > 0;
            weapon.coatings = [];
            
            if (hadCoatings) {
                console.log(`Removed all coatings from ${weapon.name}`);
                return true;
            }
            
            return false;
        }
        catch (error) {
            console.error("Error removing all coatings:", error);
            return false;
        }
    },

    // Process coatings during an attack
    processCoatings(weapon, attacker, target) {
        try {
            if (!weapon || !weapon.coatings) {
                return;
            }

            console.log(`Processing coatings for ${attacker.getName()}'s attack on ${target.getName()}`);
            weapon.coatings.forEach(coating => {
                if (Math.random() < coating.chance) {
                    console.log(`${attacker.getName()}'s ${coating.name} triggered!`);
                    coating.effect(attacker, target);
                }
            });
        }
        catch (error) {
            console.error("Error processing coatings:", error);
        }
    }
}; 