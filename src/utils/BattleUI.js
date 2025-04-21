class BattleUI {
    constructor(scene, sfx) {
        this.scene = scene;
        this.sfx = sfx;
        this.menuItems = [];
        this.currentMenu = null;
        this.currentSelection = { x: 0, y: 0 };
        this.currentMenuType = 'main';
        this.spellMenuBackground = null;
        this.bagMenuBackground = null;
        this.statsMenuBackground = null;
        this.actionBarContainer = null;
        this.statsContainer = null;
        this.playerUnitFrame = null;
        this.enemyUnitFrame = null;
    }

    calculateHealthBarSize(maxUnitHealth, currentUnitHealth) {
        const MAX_WIDTH = 324;
        const clampedHealth = Phaser.Math.Clamp(currentUnitHealth, 0, maxUnitHealth);
        let width = (clampedHealth / maxUnitHealth) * MAX_WIDTH;

        return { width, height: 84 };
    }

    calculateEnergyBarSize(maxUnitEnergy, currentUnitEnergy) {
        const MAX_WIDTH = 324;
        const clampedEnergy = Phaser.Math.Clamp(currentUnitEnergy, 0, maxUnitEnergy);
        let width = (clampedEnergy / maxUnitEnergy) * MAX_WIDTH;

        return { width, height: 50 };
    }

    calculateRageBarSize(maxUnitEnergy, currentUnitEnergy) {
        const MAX_WIDTH = 302;
        const clampedEnergy = Phaser.Math.Clamp(currentUnitEnergy, 0, maxUnitEnergy);
        let width = (clampedEnergy / maxUnitEnergy) * MAX_WIDTH;

        return { width, height: 40 };
    }

    displayStats(player, enemy, playerStartHP, enemyStartHP, turnCounter) {
        const COLOR_CODES = {
            GREEN: Phaser.Display.Color.GetColor32(0, 255, 0, 255),
            RED: Phaser.Display.Color.GetColor32(255, 0, 0, 255),
            YELLOW: Phaser.Display.Color.GetColor32(255, 255, 0, 255),
            WHITE: Phaser.Display.Color.GetColor32(255, 255, 255, 255),
            BLACK: Phaser.Display.Color.GetColor32(0, 0, 0, 255)
        };

        if (this.statsContainer) {
            this.actionBarContainer.destroy(true);
            this.statsContainer.destroy(true);
            this.playerUnitFrame.destroy(true);
            this.enemyUnitFrame.destroy(true);
        }

        const playerHealthBarSize = this.calculateHealthBarSize(playerStartHP, player.getHealth());
        const playerEnergyBarSize = this.calculateEnergyBarSize(player.getMaxEnergy(), player.getEnergy());
        const playerRageBarSize = this.calculateRageBarSize(100, player.getResource());
        const enemyHealthBarSize = this.calculateHealthBarSize(enemyStartHP, enemy.getHealth());
        const enemyEnergyBarSize = this.calculateEnergyBarSize(enemy.getMaxEnergy(), enemy.getEnergy());

        // score and turn counter
        this.statsContainer = this.scene.add.container(0, 0);
        this.statsContainer.add(this.scene.add.text(0, 0, `Score: ${player.score}`, { fontSize: '32px', fill: '#fff' }));
        this.statsContainer.add(this.scene.add.text(0, 50, `Turn: ${turnCounter}`, { fontSize: '32px', fill: '#fff' }));

        // player unit frame
        this.playerUnitFrame = this.scene.add.container(400, 175);
        this.playerUnitFrame.add(this.scene.add.image(0, 0, 'warrior-unitframe-back'));
        this.playerUnitFrame.add(this.scene.add.rectangle(-153, 20, playerRageBarSize.width, playerRageBarSize.height, COLOR_CODES.RED).setOrigin(0));
        this.playerUnitFrame.add(this.scene.add.rectangle(-162, -116, playerHealthBarSize.width, playerHealthBarSize.height, COLOR_CODES.GREEN).setOrigin(0));
        this.playerUnitFrame.add(this.scene.add.rectangle(-162, -32, playerEnergyBarSize.width, playerEnergyBarSize.height, COLOR_CODES.YELLOW).setOrigin(0));
        this.playerUnitFrame.add(this.scene.add.text(0, -74, `${Math.max(0, player.getHealth())}/${playerStartHP}`, { fontSize: '52px', fill: '#000' }).setOrigin(0.5));
        this.playerUnitFrame.add(this.scene.add.text(200, -120, `${player.name}`, { fontSize: '40px' }));
        this.playerUnitFrame.add(this.scene.add.text(200, -60, `Class: ${player.class}`, { fontSize: '40px' }));
        this.playerUnitFrame.add(this.scene.add.text(200, 0, `Level: ${player.level}`, { fontSize: '40px' }));
        this.playerUnitFrame.add(this.scene.add.image(0, 0, 'warrior-unitframe-front'));

        // enemy unit frame
        this.enemyUnitFrame = this.scene.add.container(1520, 175);
        this.enemyUnitFrame.add(this.scene.add.image(0, 0, 'enemy-unitframe-back'));
        this.enemyUnitFrame.add(this.scene.add.rectangle(-162, -116, enemyHealthBarSize.width, enemyHealthBarSize.height, COLOR_CODES.RED).setOrigin(0));
        this.enemyUnitFrame.add(this.scene.add.rectangle(-162, -32, enemyEnergyBarSize.width, enemyEnergyBarSize.height, COLOR_CODES.YELLOW).setOrigin(0));
        this.enemyUnitFrame.add(this.scene.add.text(0, -74, `${Math.max(0, enemy.getHealth())}/${enemyStartHP}`, { fontSize: '52px', fill: '#000' }).setOrigin(0.5));
        this.enemyUnitFrame.add(this.scene.add.text(-200, -120, `${enemy.name}`, { fontSize: '40px' }).setOrigin(1, 0));
        this.enemyUnitFrame.add(this.scene.add.image(0, 0, 'enemy-unitframe-front'));

        // action bar
        this.actionBarContainer = this.scene.add.container(960, 910);
        this.actionBarContainer.add(this.scene.add.image(0, 0, 'action-bar').setScale(0.9, 0.4));
        this.actionBarContainer.add(this.scene.add.image(400, -70, 'strength-icon').setScale(0.4));
        this.actionBarContainer.add(this.scene.add.image(400, -70, 'uncommon-item-frame').setScale(0.4));
        this.actionBarContainer.add(this.scene.add.text(450, -70, `${player.stats.strength}`, { fontSize: '32px', fill: '#fff' }).setOrigin(0.5));
        this.actionBarContainer.add(this.scene.add.image(400, 0, 'agility-icon').setScale(0.4));
        this.actionBarContainer.add(this.scene.add.image(400, 0, 'uncommon-item-frame').setScale(0.4));
        this.actionBarContainer.add(this.scene.add.text(450, 0, `${player.stats.agility}`, { fontSize: '32px', fill: '#fff' }).setOrigin(0.5));
        this.actionBarContainer.add(this.scene.add.image(400, 70, 'intelligence-icon').setScale(0.4));
        this.actionBarContainer.add(this.scene.add.text(450, 70, `${player.stats.intelligence}`, { fontSize: '32px', fill: '#fff' }).setOrigin(0.5));
        this.actionBarContainer.add(this.scene.add.image(400, 70, 'uncommon-item-frame').setScale(0.4));

        // for debugging
        const weapon = player.getCurrentWeapon();
        this.actionBarContainer.add(this.scene.add.text(500, -100, `Weapon:\n${weapon.name}`, { fontSize: '40px' }));

        if (weapon.coatings && weapon.coatings.length > 0) {
            this.actionBarContainer.add(this.scene.add.text(500, 0, `Coating:\n${weapon.coatings[0].name}`, { fontSize: '40px' }));
        }
    }

    // Target is a Character object
    displayDamageText(target, damage) {
        let x = target.animations.properties.idleAnimPos.x;
        let y = target.animations.properties.idleAnimPos.y;

        const damageText = this.scene.add.text(x, y, `${damage}`, {
            fontSize: "72px",
            fill: "#ffffff",
        }).setOrigin(0.5);

        // animate the text to move upward and fade out
        this.scene.tweens.add({
            targets: damageText,
            y: y - 50, // move upward
            alpha: 0, // fade out
            duration: 4000, // 4 seconds
            ease: 'Power1',
            onComplete: () => {
                damageText.destroy(); // remove text after animation
            },
        });
    }

    renderMenu(menu) {
        // clear previous menu items
        if (this.menuItems) {
            this.menuItems.forEach(item => item.destroy());
        }

        this.currentMenu = menu;

        // render menu items
        this.menuItems = menu.map(menuItem => {

            // check if the menu is the spell menu
            const isSpellMenu = menuItem.x === 0 && this.currentMenu.some(item => item.text === 'Back');
            const xPosition = isSpellMenu ? 960 : 300 + menuItem.x * 200; // center horizontally for spell menu, original position for main menu
            const yPosition = isSpellMenu ? 300 + menuItem.y * 50 : 850 + menuItem.y * 100; // adjust vertical spacing for spell menu or main menu

            const text = this.scene.add.text(xPosition, yPosition, menuItem.text, { fontSize: '48px', fill: '#fff' }).setOrigin(0.5);

            // highlight selected item
            if (menuItem.x === this.currentSelection.x && menuItem.y === this.currentSelection.y) {
                text.setColor('#ff0000');
            }

            return text;
        });
    }

    renderStatsMenu(player) {
        // clear current menu
        this.currentMenu = [];
        this.currentMenuType = 'stats'; // set menu type to "stats"

        // reset selection
        this.currentSelection = { x: 0, y: 0 };

        // adding player stats to the menu
        this.currentMenu.push({ x: 0, y: 0, text: `Name: ${player.name}` });
        this.currentMenu.push({ x: 0, y: 1, text: `Class: ${player.class}` });
        this.currentMenu.push({ x: 0, y: 2, text: `Level: ${player.level}` });
        this.currentMenu.push({ x: 0, y: 3, text: `Health: ${player.getHealth()}/${player.maxHealth}` });
        this.currentMenu.push({ x: 0, y: 4, text: `Energy: ${player.getEnergy()}/${player.getMaxEnergy()}` });
        this.currentMenu.push({ x: 0, y: 5, text: `Strength: ${player.stats.strength}` });
        this.currentMenu.push({ x: 0, y: 6, text: `Agility: ${player.stats.agility}` });
        this.currentMenu.push({ x: 0, y: 7, text: `Intelligence: ${player.stats.intelligence}` });
        this.currentMenu.push({ x: 0, y: 8, text: `Defense: ${player.stats.defense}` });
        this.currentMenu.push({ x: 0, y: 9, text: `Evasion: ${(player.stats.evasion * 100).toFixed(1)}%` });
        this.currentMenu.push({ x: 0, y: 10, text: `Crit Chance: ${(player.stats.critChance * 100).toFixed(1)}%` });
        this.currentMenu.push({ x: 0, y: 11, text: `Crit Damage: ${player.stats.critDamage}x` });
        this.currentMenu.push({ x: 0, y: 12, text: `Omnivamp: ${(player.stats.omnivamp * 100).toFixed(1)}%` });

        // adding weapon information
        const weapon = player.weapon.at(-1);
        if (weapon) {
            this.currentMenu.push({ x: 0, y: 13, text: `Weapon: ${weapon.name}` });
            this.currentMenu.push({ x: 0, y: 14, text: `Damage: ${weapon.damage}` });

            // display weapon coatings if any
            if (weapon.coatings) {
                weapon.coatings.forEach((coating, index) => {
                    this.currentMenu.push({ x: 0, y: 15 + index, text: `Coating: ${coating.name} (${(coating.chance * 100).toFixed(1)}% chance)` });
                });
            }
        }
        else {
            this.currentMenu.push({ x: 0, y: 12, text: `Weapon: None` });
        }

        this.currentMenu.push({ x: 0, y: this.currentMenu.length, text: 'Back' });

        const backgroundWidth = 500;
        const backgroundHeight = 50 * this.currentMenu.length + 20; // adjust height based on number of items
        const backgroundX = 960 - backgroundWidth / 2; // center horizontally
        const backgroundY = 300 - 25; // start slightly above the first item

        if (this.statsMenuBackground) {
            this.statsMenuBackground.destroy();
        }

        this.statsMenuBackground = this.scene.add.rectangle(
            backgroundX,
            backgroundY,
            backgroundWidth,
            backgroundHeight,
            Phaser.Display.Color.GetColor(100, 100, 100)
        ).setOrigin(0);

        this.statsMenuBackground.setAlpha(0.8);

        this.renderMenu(this.currentMenu);
    }

    renderBagMenu(player) {
        // clear current menu
        this.currentMenu = [];
        this.currentMenuType = 'bag'; // set menu type to "bag"

        // hardcoded back button
        this.currentMenu.push({ x: 0, y: 0, text: 'Alchemy' });
        this.currentMenu.push({ x: 0, y: 1, text: 'Runes' });
        this.currentMenu.push({ x: 0, y: 2, text: 'Back' });

        // reset selection
        this.currentSelection = { x: 0, y: 0 };

        const backgroundWidth = 400;
        const backgroundHeight = 50 * this.currentMenu.length + 20; // adjust height based on number of items
        const backgroundX = 960 - backgroundWidth / 2; // center horizontally
        const backgroundY = 300 - 25; // start slightly above the first item

        if (this.bagMenuBackground) {
            this.bagMenuBackground.destroy();
        }

        this.bagMenuBackground = this.scene.add.rectangle(
            backgroundX,
            backgroundY,
            backgroundWidth,
            backgroundHeight,
            Phaser.Display.Color.GetColor(100, 100, 100)
        ).setOrigin(0);

        this.bagMenuBackground.setAlpha(0.8);

        this.renderMenu(this.currentMenu);
    }

    renderSpellMenu(player) {
        // clear current menu
        this.currentMenu = [];
        this.currentMenuType = 'spell'; // set menu type to "spell"

        // dynamically adding the spells
        player.spells.forEach((spell, index) => {
            this.currentMenu.push({ x: 0, y: index, text: spell.name });
        });

        // hardcoded back button
        this.currentMenu.push({ x: 0, y: player.spells.length, text: 'Back' }); // Place "Back" at the end of the list

        // reset selection
        this.currentSelection = { x: 0, y: 0 };

        // render the spell menu background
        const backgroundWidth = 400;
        const backgroundHeight = 50 * this.currentMenu.length + 20; // adjust height based on number of items
        const backgroundX = 960 - backgroundWidth / 2; // center horizontally
        const backgroundY = 300 - 25; // start slightly above the first item

        if (this.spellMenuBackground) {
            this.spellMenuBackground.destroy();
        }

        this.spellMenuBackground = this.scene.add.rectangle(
            backgroundX,
            backgroundY,
            backgroundWidth,
            backgroundHeight,
            Phaser.Display.Color.GetColor(100, 100, 100)
        ).setOrigin(0);

        this.spellMenuBackground.setAlpha(0.8);

        // render spell menu
        this.renderMenu(this.currentMenu);
    }

    changeSelection(deltaX, deltaY) {
        this.sfx.menu.play();
        let newX = this.currentSelection.x + deltaX;
        let newY = this.currentSelection.y + deltaY;

        // handle vertical wrapping
        const menuItemsInColumn = this.currentMenu.filter(item => item.x === this.currentSelection.x);
        const minY = Math.min(...menuItemsInColumn.map(item => item.y));
        const maxY = Math.max(...menuItemsInColumn.map(item => item.y));

        if (newY < minY) {
            newY = maxY; // wrap to the bottom
        } else if (newY > maxY) {
            newY = minY; // wrap to the top
        }

        // handle horizontal wrapping if needed
        const menuItemsInRow = this.currentMenu.filter(item => item.y === this.currentSelection.y);
        const minX = Math.min(...menuItemsInRow.map(item => item.x));
        const maxX = Math.max(...menuItemsInRow.map(item => item.x));

        if (newX < minX) {
            newX = maxX; // wrap to the right
        } else if (newX > maxX) {
            newX = minX; // wrap to the left
        }

        // prevent out of bounds selection
        const isValidSelection = this.currentMenu.some(item => item.x === newX && item.y === newY);
        if (isValidSelection) {
            // update current selection
            this.currentSelection = { x: newX, y: newY };

            this.renderMenu(this.currentMenu);
        }
    }

    getSelectedItem() {
        return this.currentMenu.find(
            item => item.x === this.currentSelection.x && item.y === this.currentSelection.y
        );
    }

    selectMenuItem(player, executeTurn, switchMenu, bagMenu, mainMenu, statsMenu) {
        const selectedItem = this.getSelectedItem();
        this.sfx.select.play();
        if (selectedItem) {
            if (this.currentMenuType === 'main') {
                if (selectedItem.text === 'Attack') {
                    console.log('Attack selected!');
                    // plays attack after 1 second delay to match health bar animation
                    setTimeout(() => {
                        this.sfx.hit1.play();
                    }, 1000);
                    executeTurn('attack');
                }
                else if (selectedItem.text === 'Cast') {
                    console.log('Cast selected!');
                    this.renderSpellMenu(player, switchMenu, mainMenu);
                }
                else if (selectedItem.text === 'Bag') {
                    console.log('Bag selected!');
                    this.renderBagMenu(player, switchMenu, mainMenu);
                }
                else if (selectedItem.text === 'Back') {
                    console.log('Back selected!');
                    switchMenu(mainMenu);
                }
            }
            else if (this.currentMenuType === 'spell') {
                if (selectedItem.text === 'Back') {
                    console.log('Back selected!');
                    switchMenu(mainMenu);
                    this.currentMenuType = 'main'; // return to main menu
                }
                else {
                    // check if selected item is a spell
                    const selectedSpell = player.spells.find(spell => spell.name === selectedItem.text);
                    if (selectedSpell) {
                        setTimeout(() => {
                            this.sfx.hit2.play();
                        }, 1000);
                        console.log(`Cast ${selectedSpell.name} selected!`);
                        executeTurn('cast', selectedSpell);

                        // closes spell menu and returns to main menu
                        switchMenu(mainMenu);
                        this.currentMenuType = 'main';
                    }
                }
            }
            else if (this.currentMenuType === "bag") {
                if (selectedItem.text === 'Back') {
                    console.log('Back selected!');
                    switchMenu(mainMenu);
                    this.currentMenuType = 'main'; // return to main menu
                }
            }
            else if (this.currentMenuType === "stats") {
                if (selectedItem.text === 'Back') {
                    console.log('Back selected!');
                    switchMenu(mainMenu);
                    this.currentMenuType = 'main'; // return to main menu
                }
            }
        }
    }

    switchMenu(menu) {
        // clear the spell menu background if it exists
        if (this.spellMenuBackground) {
            this.spellMenuBackground.destroy();
            this.spellMenuBackground = null;
        }
        if (this.bagMenuBackground) {
            this.bagMenuBackground.destroy();
            this.bagMenuBackground = null;
        }
        if (this.statsMenuBackground) {
            this.statsMenuBackground.destroy();
            this.statsMenuBackground = null;
        }

        this.currentMenu = menu;
        this.currentSelection = { x: 0, y: 0 };
        this.renderMenu(menu);
    }
}

export default BattleUI;