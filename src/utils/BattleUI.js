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

        // Use object properties for caching
        this.cachedDisplayElements = new Map();

        // Bind methods to ensure correct 'this' context
        this.renderMenu = this.renderMenu.bind(this);
        this.renderStatsMenu = this.renderStatsMenu.bind(this);
        this.renderBagMenu = this.renderBagMenu.bind(this);
        this.renderSpellMenu = this.renderSpellMenu.bind(this);
        this.changeSelection = this.changeSelection.bind(this);
        this.getSelectedItem = this.getSelectedItem.bind(this);
        this.selectMenuItem = this.selectMenuItem.bind(this);
        this.switchMenu = this.switchMenu.bind(this);
        this.destroy = this.destroy.bind(this);
        this.displayStats = this.displayStats.bind(this);

        // Listen for shutdown to clean up resources
        this.scene.events.once('shutdown', this.destroy, this);
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
        try {
            // Store scene reference to avoid 'this.scene is undefined' errors
            const scene = this.scene;
            if (!scene) {
                console.error("Scene is undefined in displayStats");
                return;
            }

            const COLOR_CODES = {
                GREEN: Phaser.Display.Color.GetColor32(0, 255, 0, 255),
                RED: Phaser.Display.Color.GetColor32(255, 0, 0, 255),
                YELLOW: Phaser.Display.Color.GetColor32(255, 255, 0, 255),
                WHITE: Phaser.Display.Color.GetColor32(255, 255, 255, 255),
                BLACK: Phaser.Display.Color.GetColor32(0, 0, 0, 255)
            };

            // Destroy previous containers if they exist
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

            // Create containers to group related elements
            this.statsContainer = scene.add.container(0, 0);
            this.playerUnitFrame = scene.add.container(400, 175);
            this.enemyUnitFrame = scene.add.container(1520, 175);
            this.actionBarContainer = scene.add.container(960, 910);

            // Score and turn counter
            this.statsContainer.add(scene.add.text(0, 0, `Score: ${player.score}`, { fontSize: '32px', fill: '#fff' }));
            this.statsContainer.add(scene.add.text(0, 50, `Turn: ${turnCounter}`, { fontSize: '32px', fill: '#fff' }));

            // Player unit frame
            this.playerUnitFrame.add(scene.add.image(0, 0, 'warrior-unitframe-back'));
            this.playerUnitFrame.add(scene.add.rectangle(-153, 20, playerRageBarSize.width, playerRageBarSize.height, COLOR_CODES.RED).setOrigin(0));
            this.playerUnitFrame.add(scene.add.rectangle(-162, -116, playerHealthBarSize.width, playerHealthBarSize.height, COLOR_CODES.GREEN).setOrigin(0));
            this.playerUnitFrame.add(scene.add.rectangle(-162, -32, playerEnergyBarSize.width, playerEnergyBarSize.height, COLOR_CODES.YELLOW).setOrigin(0));
            this.playerUnitFrame.add(scene.add.text(0, -74, `${Math.max(0, player.getHealth())}/${playerStartHP}`, { fontSize: '52px', fill: '#000' }).setOrigin(0.5));
            this.playerUnitFrame.add(scene.add.text(200, -120, `${player.getName()}`, { fontSize: '40px' }));
            this.playerUnitFrame.add(scene.add.text(200, -60, `Class: ${player.class}`, { fontSize: '40px' }));
            this.playerUnitFrame.add(scene.add.text(200, 0, `Level: ${player.getLevel()}`, { fontSize: '40px' }));
            this.playerUnitFrame.add(scene.add.image(0, 0, 'warrior-unitframe-front'));

            // Enemy unit frame
            this.enemyUnitFrame.add(scene.add.image(0, 0, 'enemy-unitframe-back'));
            this.enemyUnitFrame.add(scene.add.rectangle(-162, -116, enemyHealthBarSize.width, enemyHealthBarSize.height, COLOR_CODES.RED).setOrigin(0));
            this.enemyUnitFrame.add(scene.add.rectangle(-162, -32, enemyEnergyBarSize.width, enemyEnergyBarSize.height, COLOR_CODES.YELLOW).setOrigin(0));
            this.enemyUnitFrame.add(scene.add.text(0, -74, `${Math.max(0, enemy.getHealth())}/${enemyStartHP}`, { fontSize: '52px', fill: '#000' }).setOrigin(0.5));
            this.enemyUnitFrame.add(scene.add.text(-200, -120, `${enemy.getName()}`, { fontSize: '40px' }).setOrigin(1, 0));
            this.enemyUnitFrame.add(scene.add.image(0, 0, 'enemy-unitframe-front'));

            // Action bar with player stats
            this.actionBarContainer.add(scene.add.image(0, 0, 'action-bar').setScale(0.9, 0.4));

            const statsIcons = [];
            statsIcons.push(scene.add.image(400, -70, 'strength-icon').setScale(0.4));
            statsIcons.push(scene.add.image(400, -70, 'uncommon-item-frame').setScale(0.4));
            statsIcons.push(scene.add.image(400, 0, 'agility-icon').setScale(0.4));
            statsIcons.push(scene.add.image(400, 0, 'uncommon-item-frame').setScale(0.4));
            statsIcons.push(scene.add.image(400, 70, 'intelligence-icon').setScale(0.4));
            statsIcons.push(scene.add.image(400, 70, 'uncommon-item-frame').setScale(0.4));

            statsIcons.forEach(icon => {
                this.actionBarContainer.add(icon);
            });

            // Add dynamic text elements that change with stats
            this.actionBarContainer.add(scene.add.text(450, -70, `${player.stats.strength}`, { fontSize: '32px', fill: '#fff' }).setOrigin(0.5));
            this.actionBarContainer.add(scene.add.text(450, 0, `${player.stats.agility}`, { fontSize: '32px', fill: '#fff' }).setOrigin(0.5));
            this.actionBarContainer.add(scene.add.text(450, 70, `${player.stats.intelligence}`, { fontSize: '32px', fill: '#fff' }).setOrigin(0.5));

            // Weapon info
            const weapon = player.getCurrentWeapon();
            this.actionBarContainer.add(scene.add.text(500, -100, `Weapon:\n${weapon.name}`, { fontSize: '40px' }));

            if (weapon.coatings && weapon.coatings.length > 0) {
                this.actionBarContainer.add(scene.add.text(500, 0, `Coating:\n${weapon.coatings[0].name}`, { fontSize: '40px' }));
            }
        } catch (error) {
            console.error("Error in displayStats:", error);
        }
    }

    renderMenu(menu) {
        try {
            const scene = this.scene;
            if (!scene) {
                console.error("Scene is undefined in renderMenu");
                return;
            }
            
            // Clear previous menu items
            if (this.menuItems) {
                this.menuItems.forEach(item => {
                    if (item && item.destroy) item.destroy();
                });
            }

            this.currentMenu = menu;
            this.menuItems = [];

            if (!menu) {
                console.error("Menu is undefined in renderMenu");
                return;
            }

            // Render menu items
            this.menuItems = menu.map((menuItem) => {
                // Check if the menu is the spell menu
                const isSpellMenu = menuItem.x === 0 && this.currentMenu.some(item => item.text === 'Back');
                const xPosition = isSpellMenu ? 960 : 300 + menuItem.x * 200; // Center horizontally for spell menu, original position for main menu
                const yPosition = isSpellMenu ? 300 + menuItem.y * 50 : 850 + menuItem.y * 100; // Adjust vertical spacing for spell menu or main menu

                const text = scene.add.text(xPosition, yPosition, menuItem.text, { fontSize: '48px', fill: '#fff' }).setOrigin(0.5).setDepth(10);

                // Highlight selected item
                if (menuItem.x === this.currentSelection.x && menuItem.y === this.currentSelection.y) {
                    text.setColor('#ff0000');
                }

                // Make text interactive for mouse controls
                text.setInteractive({ useHandCursor: true })
                    .on('pointerover', () => {
                        // Only highlight if not already selected
                        if (menuItem.x !== this.currentSelection.x || menuItem.y !== this.currentSelection.y) {
                            text.setColor('#ffff00'); // Yellow hover color
                        }
                    })
                    .on('pointerout', () => {
                        // Restore original color or selected color
                        if (menuItem.x === this.currentSelection.x && menuItem.y === this.currentSelection.y) {
                            text.setColor('#ff0000'); // Selected color
                        } else {
                            text.setColor('#ffffff'); // Default color
                        }
                    })
                    .on('pointerdown', () => {
                        // Check for input lock
                        if (this.scene.inputLocked) {
                            return;
                        }
                        
                        // Update selection and highlight
                        this.currentSelection = { x: menuItem.x, y: menuItem.y };
                        
                        // Play sound effect
                        if (this.sfx && this.sfx.click) {
                            this.sfx.click.play();
                        }
                        
                        this.renderMenu(this.currentMenu);
                        
                        const selectedItem = this.getSelectedItem();
                        if (selectedItem) {
                            const executeTurn = this.scene.executeTurn ? this.scene.executeTurn.bind(this.scene) : null;
                            const player = this.scene.player;
                            const mainMenu = this.scene.mainMenu;
                            
                            // Simulate selection with equivalent to keyboard selection
                            this.selectMenuItem(
                                player,
                                executeTurn,
                                this.switchMenu.bind(this),
                                null,
                                mainMenu
                            );
                        }
                    });

                return text;
            });
        } catch (error) {
            console.error("Error in renderMenu:", error);
        }
    }

    renderStatsMenu(player) {
        try {
            const scene = this.scene;
            if (!scene) {
                console.error("Scene is undefined in renderStatsMenu");
                return;
            }

            // Clear current menu
            this.currentMenu = [];
            this.currentMenuType = 'stats'; // Set menu type to "stats"

            // Reset selection
            this.currentSelection = { x: 0, y: 0 };

            // Adding player stats to the menu
            this.currentMenu.push({ x: 0, y: 0, text: `Name: ${player.getName()}` });
            this.currentMenu.push({ x: 0, y: 1, text: `Class: ${player.class}` });
            this.currentMenu.push({ x: 0, y: 2, text: `Level: ${player.getLevel()}` });
            this.currentMenu.push({ x: 0, y: 3, text: `Health: ${player.getHealth()}/${player.getMaxHealth()}` });
            this.currentMenu.push({ x: 0, y: 4, text: `Energy: ${player.getEnergy()}/${player.getMaxEnergy()}` });
            this.currentMenu.push({ x: 0, y: 5, text: `Strength: ${player.stats.strength}` });
            this.currentMenu.push({ x: 0, y: 6, text: `Agility: ${player.stats.agility}` });
            this.currentMenu.push({ x: 0, y: 7, text: `Intelligence: ${player.stats.intelligence}` });
            this.currentMenu.push({ x: 0, y: 8, text: `Defense: ${player.stats.defense}` });
            this.currentMenu.push({ x: 0, y: 9, text: `Evasion: ${(player.stats.evasion * 100).toFixed(1)}%` });
            this.currentMenu.push({ x: 0, y: 10, text: `Crit Chance: ${(player.stats.critChance * 100).toFixed(1)}%` });
            this.currentMenu.push({ x: 0, y: 11, text: `Crit Damage: ${player.stats.critDamage}x` });
            this.currentMenu.push({ x: 0, y: 12, text: `Omnivamp: ${(player.stats.omnivamp * 100).toFixed(1)}%` });

            // Adding weapon information
            const weapon = player.getCurrentWeapon();
            if (weapon) {
                this.currentMenu.push({ x: 0, y: 13, text: `Weapon: ${weapon.name}` });
                this.currentMenu.push({ x: 0, y: 14, text: `Damage: ${weapon.damage}` });

                // Display weapon coatings if any
                if (weapon.coatings) {
                    weapon.coatings.forEach((coating, index) => {
                        this.currentMenu.push({ x: 0, y: 15 + index, text: `Coating: ${coating.name} (${(coating.chance * 100).toFixed(1)}% chance)` });
                    });
                }
            }
            else {
                this.currentMenu.push({ x: 0, y: 12, text: `Weapon: None` });
            }

            // Add back option
            this.currentMenu.push({ x: 0, y: this.currentMenu.length, text: 'Back' });

            // Create a background for the stats menu
            if (!this.statsMenuBackground) {
                this.statsMenuBackground = scene.add.graphics();
                this.statsMenuBackground.fillStyle(0x000000, 0.7);
                this.statsMenuBackground.fillRect(650, 200, 620, 680);
            } else {
                this.statsMenuBackground.setVisible(true);
            }

            this.renderMenu(this.currentMenu);
        } catch (error) {
            console.error("Error in renderStatsMenu:", error);
        }
    }

    renderBagMenu(player) {
        try {
            const scene = this.scene;
            if (!scene) {
                console.error("Scene is undefined in renderBagMenu");
                return;
            }

            // Clear current menu
            this.currentMenu = [];
            this.currentMenuType = 'bag'; // Set menu type to "bag"

            // Reset selection
            this.currentSelection = { x: 0, y: 0 };

            // Adding items to the menu
            if (player.items && player.items.length > 0) {
                player.items.forEach((item, index) => {
                    this.currentMenu.push({ x: 0, y: index, text: item.name, item: item });
                });
            } else {
                this.currentMenu.push({ x: 0, y: 0, text: "No items in bag" });
            }

            // Add back option
            this.currentMenu.push({ x: 0, y: this.currentMenu.length, text: 'Back' });

            // Create a background for the items menu
            if (!this.bagMenuBackground) {
                this.bagMenuBackground = scene.add.graphics();
                this.bagMenuBackground.fillStyle(0x000000, 0.7);
                this.bagMenuBackground.fillRect(650, 200, 620, 580);
            } else {
                this.bagMenuBackground.setVisible(true);
            }

            this.renderMenu(this.currentMenu);
        } catch (error) {
            console.error("Error in renderBagMenu:", error);
        }
    }

    renderSpellMenu(player) {
        try {
            const scene = this.scene;
            if (!scene) {
                console.error("Scene is undefined in renderSpellMenu");
                return;
            }

            // Clear current menu
            this.currentMenu = [];
            this.currentMenuType = 'spell';

            // Reset selection
            this.currentSelection = { x: 0, y: 0 };

            // Adding spells to the menu
            if (player.spells && player.spells.length > 0) {
                player.spells.forEach((spell, index) => {
                    // Check if player has enough energy to cast the spell
                    const canCast = player.getEnergy() >= spell.cost;
                    const spellText = canCast ?
                        `${spell.name} (${spell.cost} energy)` :
                        `${spell.name} (${spell.cost} energy) - Not enough energy!`;

                    this.currentMenu.push({ x: 0, y: index, text: spellText, spell: spell, canCast: canCast });
                });
            } else {
                this.currentMenu.push({ x: 0, y: 0, text: "No spells available" });
            }

            // Add back option
            this.currentMenu.push({ x: 0, y: this.currentMenu.length, text: 'Back' });

            // Create a background for the spell menu
            if (!this.spellMenuBackground) {
                this.spellMenuBackground = scene.add.graphics();
                this.spellMenuBackground.fillStyle(0x000000, 0.7);
                this.spellMenuBackground.fillRect(650, 200, 620, 580);
            } else {
                this.spellMenuBackground.setVisible(true);
            }

            this.renderMenu(this.currentMenu);
        } catch (error) {
            console.error("Error in renderSpellMenu:", error);
        }
    }

    changeSelection(deltaX, deltaY) {
        try {
            const scene = this.scene;
            if (!scene) {
                console.error("Scene is undefined in changeSelection");
                return;
            }

            // Get current menu bounds
            const menuWidth = this.currentMenu.reduce((max, item) => Math.max(max, item.x), 0) + 1;
            const menuHeight = this.currentMenu.reduce((max, item) => Math.max(max, item.y), 0) + 1;

            // Calculate new selection
            const newX = (this.currentSelection.x + deltaX + menuWidth) % menuWidth;
            const newY = (this.currentSelection.y + deltaY + menuHeight) % menuHeight;

            // Check if the position exists in the menu
            const newPosition = { x: newX, y: newY };
            const positionExists = this.currentMenu.some(item => item.x === newPosition.x && item.y === newPosition.y);

            if (positionExists) {
                // Update selection
                this.currentSelection = newPosition;

                // Play selection sound
                if (this.sfx && this.sfx.menuMove) {
                    this.sfx.menuMove.play();
                }

                // Re-render menu with new selection
                this.renderMenu(this.currentMenu);
            }
        } catch (error) {
            console.error("Error in changeSelection:", error);
        }
    }

    getSelectedItem() {
        try {
            const scene = this.scene;
            if (!scene) {
                console.error("Scene is undefined in getSelectedItem");
                return null;
            }

            if (!this.currentMenu) {
                return null;
            }

            // Find and return the selected menu item
            return this.currentMenu.find(
                item => item.x === this.currentSelection.x && item.y === this.currentSelection.y
            ) || null;
        } catch (error) {
            console.error("Error in getSelectedItem:", error);
            return null;
        }
    }

    selectMenuItem(player, executeTurn, switchMenu, bagMenu, mainMenu) {
        try {
            const scene = this.scene;
            if (!scene) {
                console.error("Scene is undefined in selectMenuItem");
                return;
            }
            
            // Check if input is locked
            if (scene.inputLocked) {
                return; // Don't process selection when inputs are locked
            }

            // Get the currently selected menu item
            const selectedItem = this.getSelectedItem();

            // Handle different menu types
            if (this.currentMenuType === 'main') {
                if (selectedItem.text === 'Attack') {
                    // Handle attack action
                    if (this.sfx.click) this.sfx.click.play();
                    executeTurn('attack');
                }
            }
            else if (this.currentMenuType === 'spell') {
                if (selectedItem.text === 'Back') {
                    // Return to the main menu
                    if (this.sfx.click) this.sfx.click.play();
                    if (this.spellMenuBackground) {
                        this.spellMenuBackground.setVisible(false);
                    }
                    this.currentMenuType = 'main';
                    this.currentSelection = { x: 0, y: 0 };
                    this.renderMenu(mainMenu);
                }
                else if (selectedItem.spell) {
                    // Check if player has enough energy
                    if (selectedItem.canCast) {
                        // Handle spell casting
                        if (this.sfx.spell_cast) this.sfx.spell_cast.play();

                        // Hide the menu background
                        if (this.spellMenuBackground) {
                            this.spellMenuBackground.setVisible(false);
                        }

                        // Reset menu state to main before executing turn
                        this.currentMenuType = 'main';
                        this.currentSelection = { x: 0, y: 0 };

                        // Execute the spell cast
                        executeTurn('cast', selectedItem.spell);

                        // Render the main menu after casting
                        this.renderMenu(mainMenu);
                    } else {
                        // Play error sound if not enough energy
                        if (this.sfx.error) this.sfx.error.play();
                    }
                }
            }
            else if (this.currentMenuType === 'bag') {
                if (selectedItem.text === 'Back') {
                    // Return to the main menu
                    if (this.sfx.click) this.sfx.click.play();
                    if (this.bagMenuBackground) {
                        this.bagMenuBackground.setVisible(false);
                    }
                    this.currentMenuType = 'main';
                    this.currentSelection = { x: 0, y: 0 };
                    this.renderMenu(mainMenu);
                }
                else if (selectedItem.item) {
                    // Handle item use
                    if (this.sfx.click) this.sfx.click.play();
                    this.bagMenuBackground.setVisible(false);
                    // Use the item
                    player.useItem(selectedItem.item);
                    // Update stats
                    this.displayStats(player, player.currentTarget, player.getMaxHealth(), player.currentTarget.getMaxHealth(), 0);
                    // Go back to main menu
                    this.currentMenuType = 'main';
                    this.currentSelection = { x: 0, y: 0 };
                    this.renderMenu(mainMenu);
                }
            }
            else if (this.currentMenuType === 'stats') {
                if (selectedItem.text === 'Back') {
                    // Return to the main menu
                    if (this.sfx.click) this.sfx.click.play();
                    if (this.statsMenuBackground) {
                        this.statsMenuBackground.setVisible(false);
                    }
                    this.currentMenuType = 'main';
                    this.currentSelection = { x: 0, y: 0 };
                    this.renderMenu(mainMenu);
                }
            }
        } catch (error) {
            console.error("Error in selectMenuItem:", error);
        }
    }

    switchMenu(menu) {
        try {
            const scene = this.scene;
            if (!scene) {
                console.error("Scene is undefined in switchMenu");
                return;
            }

            // Hide all menu backgrounds
            if (this.spellMenuBackground) {
                this.spellMenuBackground.setVisible(false);
            }
            if (this.bagMenuBackground) {
                this.bagMenuBackground.setVisible(false);
            }
            if (this.statsMenuBackground) {
                this.statsMenuBackground.setVisible(false);
            }

            // Reset menu state
            this.currentMenu = menu;
            this.currentSelection = { x: 0, y: 0 };
            this.currentMenuType = 'main';

            // Render the new menu
            this.renderMenu(menu);

            // Play click sound
            if (this.sfx.click) this.sfx.click.play();
        } catch (error) {
            console.error("Error in switchMenu:", error);
        }
    }

    // Cleanup resources when scene is destroyed
    destroy() {
        try {
            // Store scene reference to avoid 'this.scene is undefined' errors
            const scene = this.scene;

            // If scene is already gone, just return
            if (!scene) {
                return;
            }

            // Clean up graphics resources
            if (this.spellMenuBackground) {
                this.spellMenuBackground.destroy();
            }
            if (this.bagMenuBackground) {
                this.bagMenuBackground.destroy();
            }
            if (this.statsMenuBackground) {
                this.statsMenuBackground.destroy();
            }

            // Clean up text elements
            if (this.menuItems) {
                this.menuItems.forEach(item => {
                    if (item && item.destroy) item.destroy();
                });
            }

            // Clean up containers
            if (this.statsContainer) {
                this.statsContainer.destroy();
            }
            if (this.playerUnitFrame) {
                this.playerUnitFrame.destroy();
            }
            if (this.enemyUnitFrame) {
                this.enemyUnitFrame.destroy();
            }
            if (this.actionBarContainer) {
                this.actionBarContainer.destroy();
            }

            // Clear cached elements
            this.cachedDisplayElements.clear();
        } catch (error) {
            console.error("Error in destroy:", error);
        }
    }
}

export default BattleUI;