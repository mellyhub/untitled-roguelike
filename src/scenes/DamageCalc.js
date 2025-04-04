function isCrit(critChance) {
    const critRoll = Math.random();
    if (critChance > critRoll) {
        console.log("Critical hit!");
        return true;
    };
    return false;
}

export function processActiveEffects(unit) {
    if (!unit.activeEffects) return;

    // iterates through active effects and applies them
    unit.activeEffects = unit.activeEffects.filter(effect => {
        effect.applyEffect();
        effect.remainingTurns--;

        // remove effect if expired
        if (effect.remainingTurns <= 0) {
            console.log(`${effect.name} effect on ${unit.name} has expired.`);
            return false; // remove effect
        }

        return true; // keep effect
    });
}

export function executeAttack(scene, attacker, target) {
    return new Promise((resolve) => {
        const animationText = scene.add.text(700, 500, `${attacker.name} attacks...`, { fontSize: '52px', fill: '#fff' });

        scene.time.delayedCall(1000, () => {
            animationText.destroy();

            let damage = 0;

            if (attacker.weapon.name === "Snowman’s Bane" && target.name === "Snowman") {
                target.health = 0;
                console.log("The Snowman’s Bane is mercilessly wielded to bring an end to the reign of the snowman, ensuring its icy demise.");
            }

            if (isCrit(attacker.stats.critChance)) {
                damage = attacker.weapon.damage * attacker.stats.strength * 0.1 * attacker.stats.critDamage;
            }
            else {
                damage = attacker.weapon.damage * attacker.stats.strength * 0.1;
            }

            // handle rogue combo points scaling
            if (attacker.class && attacker.class.name === "Rogue" && attacker.lastAction === 'attack') {
                attacker.class.resource.comboPoints = Math.min(attacker.class.resource.comboPoints - 1, 3); // cap at 3 FP
                console.log(`${attacker.name} uses 1 combo point. Total combo points: ${attacker.class.resource.comboPoints}`);
                damage *= 1 + attacker.class.resource.comboPoints * 0.1;
                console.log(damage);
            }
            else if (attacker.class && attacker.class.name === "Rogue") {
                attacker.class.resource.comboPoints++;
            }

            // handle mage focus points scaling
            if (attacker.class && attacker.class.name === "Mage" && attacker.lastAction === 'attack') {
                attacker.class.resource.focusPoints = Math.min(attacker.class.resource.focusPoints + 1, 3); // cap at 3 FP
                console.log(`${attacker.name} gains 1 focus point. Total focus points: ${attacker.class.resource.focusPoints}`);
                damage *= 1 + attacker.class.resource.focusPoints * 0.1; // increase by 10% per focus point
                console.log(damage);
            }
            else if (attacker.class && attacker.class.name === "Mage") {
                attacker.class.resource.focusPoints = 0; // reset focus points if different action is performed
            }

            // handle warrior rage scaling
            if (attacker.class && attacker.class.name === 'Warrior') {
                const rageMultiplier = 1 + attacker.class.resource.rage * 0.002;
                console.log(`Rage multiplier: ${rageMultiplier}`);
                damage *= rageMultiplier;
            }

            attacker.lastAction = 'attack'; // update last action

            // rounds to nearest integer
            damage = Math.round(damage);
            target.health -= damage;
            console.log(`${attacker.name} attacks ${target.name} with ${attacker.weapon.name} for ${damage} damage.`);

            // warrior rage gain on hit
            if (target.class && target.class.name === 'Warrior') {
                const rageAmount = 10; // amount of rage gained when hit
                target.class.resource.rage = Math.min(target.class.resource.rage + rageAmount, 100); // cap rage at 100
                console.log(`${target.name} gains ${rageAmount} rage. Total rage: ${target.class.resource.rage}`);
            }

            scene.battleUI.displayStats(scene.player, scene.enemy, scene.playerStartHP, scene.enemyStartHP);
            resolve();
        });
    });
}

export function executeSpell(scene, attacker, spell, target) {
    return new Promise((resolve) => {
        const animationText = scene.add.text(700, 500, `${attacker.name} casts ${spell.name}...`, { fontSize: '52px', fill: '#fff' });

        scene.time.delayedCall(1000, () => {
            animationText.destroy();

            let damage = 0;

            if (spell.damage) {
                // If the spell deals damage
                if (isCrit(attacker.stats.critChance)) {
                    damage = spell.damage(attacker.stats) * attacker.stats.critDamage;
                }
                else {
                    damage = spell.damage(attacker.stats);
                }

                // handle rogue combo points scaling
                if (attacker.class && attacker.class.name === "Rogue" && attacker.lastAction === spell.name) {
                    console.log(attacker.class.resource.comboPoints);
                    attacker.class.resource.comboPoints--;
                    
                    console.log(`${attacker.name} uses 1 combo point. Total combo points: ${attacker.class.resource.comboPoints}`);
                    damage *= 1 + attacker.class.resource.comboPoints * 0.1;
                    console.log(damage);
                }
                else if (attacker.class && attacker.class.name === "Rogue") {
                    attacker.class.resource.comboPoints++;
                    console.log(`${attacker.name} gains 1 combo point. Total combo points: ${attacker.class.resource.comboPoints}`);
                }

                // handle mage focus points scaling
                if (attacker.class.name === "Mage" && attacker.lastAction === spell.name) {
                    attacker.class.resource.focusPoints = Math.min(attacker.class.resource.focusPoints + 1, 3); // cap at 3 FP
                    console.log(`${attacker.name} gains 1 focus point. Total focus points: ${attacker.class.resource.focusPoints}`);
                    damage *= 1 + attacker.class.resource.focusPoints * 0.1; // increase by 10% per focus point
                    console.log(damage);
                }
                else if (attacker.class.name === "Mage") {
                    attacker.class.resource.focusPoints = 0; // reset focus points if different action is performed
                    console.log(`${attacker.name} loses all focus points.`);
                }
                attacker.lastAction = spell.name; // update last action

                // handle warrior rage scaling
                if (attacker.class && attacker.class.name === 'Warrior') {
                    const rageMultiplier = 1 + attacker.class.resource.rage * 0.002;
                    console.log(`Rage multiplier: ${rageMultiplier}`);
                    damage *= rageMultiplier;
                }

                // warrior rage gain on hit
                if (target.class && target.class.name === 'Warrior') {
                    const rageAmount = 10; // amount of rage gained when hit
                    target.class.resource.rage = Math.min(target.class.resource.rage + rageAmount, 100); // cap rage at 100
                    console.log(`${target.name} gains ${rageAmount} rage. Total rage: ${target.class.resource.rage}`);
                }

                // rounds to nearest integer
                damage = Math.round(damage);
                target.health -= damage;
                console.log(`${attacker.name} casts ${spell.name} on ${target.name} for ${damage} damage.`);
            }

            if (spell.effect) {
                spell.effect(attacker, target, scene);
                scene.battleUI.displayStats(scene.player, scene.enemy, scene.playerStartHP, scene.enemyStartHP);
                console.log(`${attacker.name} casts ${spell.name}.`);
            }

            scene.battleUI.displayStats(scene.player, scene.enemy, scene.playerStartHP, scene.enemyStartHP);
            resolve();
        });
    });
}