class BattleUI {
    constructor(scene) {
        this.scene = scene;
        this.renderedElements = [];
        this.menuItems = [];
        this.currentMenu = null;
        this.currentSelection = { x: 0, y: 0 };
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

    displayStats(player, enemy, playerStartHP, enemyStartHP) {
        const COLOR_CODES = {
            GREEN: Phaser.Display.Color.GetColor32(0, 255, 0, 255),
            RED: Phaser.Display.Color.GetColor32(255, 0, 0, 255),
            WHITE: Phaser.Display.Color.GetColor32(255, 255, 255, 255),
            BLACK: Phaser.Display.Color.GetColor32(0, 0, 0, 255)
        };

        // cleanup old renders
        this.renderedElements.forEach(render => render.destroy());
        this.renderedElements = [];

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

        this.currentMenu = menu;

        // render menu items
        this.menuItems = menu.map(menuItem => {
            const xPosition = 300 + menuItem.x * 200; // horizontal spacing
            const yPosition = 850 + menuItem.y * 100; // vertical spacing
            const text = this.scene.add.text(xPosition, yPosition, menuItem.text, { fontSize: '48px', fill: '#fff' }).setOrigin(0.5);

            // highlight selected item
            if (menuItem.x === this.currentSelection.x && menuItem.y === this.currentSelection.y) {
                text.setColor('#ff0000');
            }

            return text;
        });
    }

    changeSelection(deltaX, deltaY) {
        const newX = this.currentSelection.x + deltaX;
        const newY = this.currentSelection.y + deltaY;

        // prevent out of bounds selection
        const isValidSelection = this.currentMenu.some(item => item.x === newX && item.y === newY);
        if (isValidSelection) {
            this.currentSelection = { x: newX, y: newY };
            this.renderMenu(this.currentMenu); // re-render menu with updated selection
        }
    }

    getSelectedItem() {
        return this.currentMenu.find(
            item => item.x === this.currentSelection.x && item.y === this.currentSelection.y
        );
    }

    selectMenuItem(player, executeTurn, switchMenu, castMenu, bagMenu, mainMenu) {
        const selectedItem = this.getSelectedItem();

        if (selectedItem) {
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
                switchMenu(castMenu);
            }
            else {
                const selectedSpell = player.spells.find(spell => spell.name === selectedItem.text);
                if (selectedSpell) {
                    console.log(`Cast ${selectedSpell.name} selected!`);
                    executeTurn('cast', selectedSpell);
                }
            }
        }
    }

    switchMenu(menu) {
        this.currentMenu = menu;
        this.currentSelection = { x: 0, y: 0 };
        this.renderMenu(menu);
    }
}

export default BattleUI;