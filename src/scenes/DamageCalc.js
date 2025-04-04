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

            if (attacker.weapon.name === "Snowman’s Bane" && target.name === "Snowman") {
                target.health = 0;
                console.log("The Snowman’s Bane is mercilessly wielded to bring an end to the reign of the snowman, ensuring its icy demise.");
            } else {
                if (isCrit(attacker.stats.critChance)) {
                    target.health -= attacker.weapon.damage * attacker.stats.strength * 0.1 * attacker.stats.critDamage;
                    console.log(`${attacker.name} attacks ${target.name} with ${attacker.weapon.name} for ${attacker.weapon.damage * attacker.stats.critDamage} damage.`);
                } else {
                    target.health -= attacker.weapon.damage * attacker.stats.strength * 0.1;
                    console.log(`${attacker.name} attacks ${target.name} with ${attacker.weapon.name} for ${attacker.weapon.damage} damage.`);
                }
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

            if (spell.damage) {
                // If the spell deals damage
                if (isCrit(attacker.stats.critChance)) {
                    target.health -= spell.damage(attacker.stats) * attacker.stats.critDamage;
                    console.log(`${attacker.name} casts ${spell.name} on ${target.name} for ${spell.damage(attacker.stats) * attacker.stats.critDamage} damage.`);
                } else {
                    target.health -= spell.damage(attacker.stats);
                    console.log(`${attacker.name} casts ${spell.name} on ${target.name} for ${spell.damage(attacker.stats)} damage.`);
                }
            }

            if (spell.effect) {
                // If the spell has an effect
                spell.effect(attacker, target, scene);
                scene.battleUI.displayStats(scene.player, scene.enemy, scene.playerStartHP, scene.enemyStartHP);
                console.log(`${attacker.name} casts ${spell.name}.`);
            }

            scene.battleUI.displayStats(scene.player, scene.enemy, scene.playerStartHP, scene.enemyStartHP);
            resolve();
        });
    });
}