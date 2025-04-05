class BattleUI {
    constructor(scene) {
        this.scene = scene;
        this.renderedElements = [];
        this.menuItems = [];
        this.currentMenu = null;
        this.currentSelection = { x: 0, y: 0 };
        this.currentMenuType = 'main';
        this.spellMenuBackground = null;
    }

    calculateHealthBarSize(maxUnitHealth, currentUnitHealth) {
        const MAX_WIDTH = 500;
        const clampedHealth = Phaser.Math.Clamp(currentUnitHealth, 0, maxUnitHealth);
        let width = (clampedHealth / maxUnitHealth) * MAX_WIDTH;

        return { width, height: 50 };
    }

    displayHealthBarBorder(x, y, width, height) {
        const borderSize = 4;
        this.scene.add.rectangle(
            x - borderSize / 2,
            y - borderSize / 2,
            width + borderSize,
            height + borderSize,
            Phaser.Display.Color.GetColor32(0, 0, 0, 255)
        ).setOrigin(0);
    }

    displayStats(player, enemy, playerStartHP, enemyStartHP, turnCounter) {
        const COLOR_CODES = {
            GREEN: Phaser.Display.Color.GetColor32(0, 255, 0, 255),
            RED: Phaser.Display.Color.GetColor32(255, 0, 0, 255),
            WHITE: Phaser.Display.Color.GetColor32(255, 255, 255, 255),
            BLACK: Phaser.Display.Color.GetColor32(0, 0, 0, 255)
        };

        // cleanup old renders
        this.renderedElements.forEach(render => render.destroy());

        // score
        this.renderedElements.push(this.scene.add.text(0, 0, `Score: ${player.score}`, { fontSize: '32px', fill: '#fff' }));

        // turn counter
        this.renderedElements.push(this.scene.add.text(0, 50, `Turn: ${turnCounter}`, { fontSize: '32px', fill: '#fff' }));

        // players health bar
        const playerHealthBarSize = this.calculateHealthBarSize(playerStartHP, player.health);
        this.displayHealthBarBorder(400, 200, 500, 50);
        this.renderedElements.push(this.scene.add.rectangle(400, 200, playerHealthBarSize.width, playerHealthBarSize.height, COLOR_CODES.GREEN).setOrigin(0));
        this.renderedElements.push(this.scene.add.text(400, 100, `Class: ${player.class.name}`, { fontSize: '52px' }));
        this.renderedElements.push(this.scene.add.text(400, 150, `Level: ${player.level}`, { fontSize: '52px' }));
        this.renderedElements.push(this.scene.add.text(400, 200, `${player.name}: ${Math.max(0, player.health)} HP`, { fontSize: '52px' }));

        // enemy health bar
        const enemyHealthBarSize = this.calculateHealthBarSize(enemyStartHP, enemy.health);
        this.displayHealthBarBorder(1220, 200, 500, 50);
        this.renderedElements.push(this.scene.add.rectangle(1220, 200, enemyHealthBarSize.width, enemyHealthBarSize.height, COLOR_CODES.RED).setOrigin(0));
        this.renderedElements.push(this.scene.add.text(1220, 200, `${enemy.name}: ${Math.max(0, enemy.health)} HP`, { fontSize: '52px' }));

        // player stats
        this.renderedElements.push(this.scene.add.text(1100, 820, `Strength: ${player.stats.strength}`, { fontSize: '24px', fill: '#fff' }).setOrigin(0.5));
        this.renderedElements.push(this.scene.add.text(1100, 870, `Agility: ${player.stats.agility}`, { fontSize: '24px', fill: '#fff' }).setOrigin(0.5));
        this.renderedElements.push(this.scene.add.text(1100, 920, `Intelligence: ${player.stats.intelligence}`, { fontSize: '24px', fill: '#fff' }).setOrigin(0.5));
        this.renderedElements.push(this.scene.add.rectangle(1250, 800, 400, 200, Phaser.Display.Color.GetColor32(79, 52, 41, 255)).setOrigin(0));
    }

    renderMenu(menu) {
        // clear previous menu items
        if (this.menuItems) {
            this.menuItems.forEach(item => item.destroy());
        }

        this.renderedElements = [];
        this.currentMenu = menu;

        // render menu items
        this.menuItems = menu.map(menuItem => {
            // check if the menu is the spell menu
            const isSpellMenu = menuItem.x === 0 && this.currentMenu.some(item => item.text === 'Back');
            const xPosition = isSpellMenu ? 960 : 300 + menuItem.x * 200; // center horizontally for spell menu, original position for main menu
            const yPosition = isSpellMenu ? 400 + menuItem.y * 50 : 850 + menuItem.y * 100; // adjust vertical spacing for spell menu or main menu

            const text = this.scene.add.text(xPosition, yPosition, menuItem.text, { fontSize: '48px', fill: '#fff' }).setOrigin(0.5);

            // highlight selected item
            if (menuItem.x === this.currentSelection.x && menuItem.y === this.currentSelection.y) {
                text.setColor('#ff0000');
            }

            return text;
        });
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
        const backgroundY = 400 - 25; // start slightly above the first item

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
        const newX = this.currentSelection.x + deltaX;
        const newY = this.currentSelection.y + deltaY;

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

    selectMenuItem(player, executeTurn, switchMenu, bagMenu, mainMenu) {
        const selectedItem = this.getSelectedItem();

        if (selectedItem) {
            if (this.currentMenuType === 'main') {
                if (selectedItem.text === 'Attack') {
                    console.log('Attack selected!');
                    executeTurn('attack');
                }
                else if (selectedItem.text === 'Bag') {
                    console.log('Bag selected!');
                    switchMenu(bagMenu);
                }
                else if (selectedItem.text === 'Back') {
                    console.log('Back selected!');
                    switchMenu(mainMenu);
                }
                else if (selectedItem.text === 'Cast') {
                    console.log('Cast selected!');
                    this.renderSpellMenu(player, switchMenu, mainMenu);
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
                        console.log(`Cast ${selectedSpell.name} selected!`);
                        executeTurn('cast', selectedSpell);

                        // closes spell menu and returns to main menu
                        switchMenu(mainMenu);
                        this.currentMenuType = 'main';
                    }
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

        this.currentMenu = menu;
        this.currentSelection = { x: 0, y: 0 };
        this.renderMenu(menu);
    }
}

export default BattleUI;