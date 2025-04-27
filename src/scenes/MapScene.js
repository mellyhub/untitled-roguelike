import generateLevels from '../data/levels.js';

class MapScene extends Phaser.Scene {
    constructor() {
        super('MapScene');
    }

    preload() {
        // Load assets (images, sounds, etc.)
        this.load.image('map', 'src/assets/images/backgrounds/map.png');
    }

    create(data) {
        this.player = data.player; // gets player object that we created in MainMenu
        this.seed = data.seed;
        this.levels = generateLevels(this.seed);
        this.add.image(0, 0, 'map').setOrigin(0);

        
        const LEVELS = {
            Portal: { level: this.levels[0], xPos: 1500, yPos: 715 },
            Town: { level: this.levels[1],  xPos: 200, yPos: 650}
        };

        // Render the level nodes
        this.levelNodes = [
            {
                level: LEVELS.Portal.level,
                render: this.add.circle(LEVELS.Portal.xPos, LEVELS.Portal.yPos, 70, 0x000000, 0.7),
                text: this.add.text(LEVELS.Portal.xPos - 50, LEVELS.Portal.yPos - 10, `${LEVELS.Portal.level.name}`, { fontSize: '30px' }),
                completed: LEVELS.Portal.completed,
            },
            {
                level: LEVELS.Town.level,
                render: this.add.circle(LEVELS.Town.xPos, LEVELS.Town.yPos, 70, 0x000000, 0.7),
                text: this.add.text(LEVELS.Town.xPos - 35, LEVELS.Town.yPos - 10, `${LEVELS.Town.level.name}`, { fontSize: '30px' }),
                completed: LEVELS.Town.completed,
            }
        ];

        // Update the appearance of all nodes based on their completion status
        this.levelNodes.forEach((node, index) => {
            this.updateNodeAppearance(index);
        });

        // highlightar node[0] som default
        this.currentNodeIndex = 0;
        this.highlightNode(this.currentNodeIndex);

        // lägger till keyboard inputs
        this.cursors = this.input.keyboard.createCursorKeys();
        this.enterKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.ENTER);

        // Add enhanced mouse interactivity to nodes
        this.levelNodes.forEach((node, index) => {
            node.render.setInteractive({ useHandCursor: true });
            
            // Hover effects
            node.render.on('pointerover', () => {
                if (!node.completed && this.currentNodeIndex !== index) {
                    node.render.setFillStyle(0x4444ff, 0.7); // Blue hover effect
                    node.text.setColor('#ffff00'); // Yellow text on hover
                }
            });
            
            node.render.on('pointerout', () => {
                if (!node.completed && this.currentNodeIndex !== index) {
                    node.render.setFillStyle(0x000000, 0.7); // Reset to black
                    node.text.setColor('#ffffff'); // Reset text color
                }
            });
            
            // Click to select
            node.render.on('pointerdown', () => {
                if (!node.completed) {
                    this.selectNode(index);
                    
                    // Double-click detection to start level
                    if (node.render.lastClickTime && (this.time.now - node.render.lastClickTime < 300)) {
                        this.startLevel(index);
                    }
                    node.render.lastClickTime = this.time.now;
                }
            });
            
            // Also make text interactive
            node.text.setInteractive({ useHandCursor: true })
                .on('pointerover', () => {
                    if (!node.completed && this.currentNodeIndex !== index) {
                        node.render.setFillStyle(0x4444ff, 0.7);
                        node.text.setColor('#ffff00');
                    }
                })
                .on('pointerout', () => {
                    if (!node.completed && this.currentNodeIndex !== index) {
                        node.render.setFillStyle(0x000000, 0.7);
                        node.text.setColor('#ffffff');
                    }
                })
                .on('pointerdown', () => {
                    if (!node.completed) {
                        this.selectNode(index);
                        
                        // Double-click detection to start level
                        if (node.text.lastClickTime && (this.time.now - node.text.lastClickTime < 300)) {
                            this.startLevel(index);
                        }
                        node.text.lastClickTime = this.time.now;
                    }
                });
        });

        // "M" byter mellan kartan och BattleScene
        this.input.keyboard.on('keydown-M', () => {
            this.scene.switch('BattleScene');
        });

        // "N" byter mellan kartan och BattleScene
        this.input.keyboard.on('keydown-N', () => {
            this.scene.switch('TalentScene', { player: this.player });
        });

        // Add start level button for mouse users
        this.startButton = this.add.text(960, 900, 'ENTER LEVEL', {
            fontSize: '40px',
            fill: '#fff',
            backgroundColor: '#4a1',
            padding: { x: 30, y: 10 }
        }).setOrigin(0.5).setInteractive({ useHandCursor: true });
        
        // Add hover and click effects for start button
        this.startButton
            .on('pointerover', () => {
                this.startButton.setStyle({ fill: '#ff0' });
            })
            .on('pointerout', () => {
                this.startButton.setStyle({ fill: '#fff' });
            })
            .on('pointerdown', () => {
                this.startButton.setStyle({ fill: '#f80' });
            })
            .on('pointerup', () => {
                this.startButton.setStyle({ fill: '#ff0' });
                const selectedNode = this.levelNodes[this.currentNodeIndex];
                if (!selectedNode.completed) {
                    this.startLevel(this.currentNodeIndex);
                }
            });
    }

    update() {
        // navigera nodes med arrow keys
        if (Phaser.Input.Keyboard.JustDown(this.cursors.left)) {
            this.moveSelection(-1);
        }
        else if (Phaser.Input.Keyboard.JustDown(this.cursors.right)) {
            this.moveSelection(1);
        }

        // startar vald node med enter
        if (Phaser.Input.Keyboard.JustDown(this.enterKey)) {
            const selectedNode = this.levelNodes[this.currentNodeIndex];
            if (!selectedNode.completed) {
                this.startLevel(this.currentNodeIndex);
            }
            else {
                console.log("This level has already been completed!");
            }
        }
    }

    moveSelection(direction) {
        // tar bort highlight från nuvarande node
        this.unhighlightNode(this.currentNodeIndex);

        // uppdaterar node index
        this.currentNodeIndex = (this.currentNodeIndex + direction + this.levelNodes.length) % this.levelNodes.length;

        // highlightar den nya noden
        this.highlightNode(this.currentNodeIndex);
    }

    highlightNode(index) {
        const node = this.levelNodes[index];
        if (!node.completed) {
            node.render.setFillStyle(0x008000, 0.7); // highlightar vald node
            node.text.setColor('#ffff00'); // Yellow text for selected node
        }
    }

    unhighlightNode(index) {
        const node = this.levelNodes[index];
        if (!node.completed) {
            node.render.setFillStyle(0x000000, 0.7); // reset färg
            node.text.setColor('#ffffff'); // Reset text color
        }
    }

    updateNodeAppearance(index) {
        const node = this.levelNodes[index];
        if (node.completed) {
            node.render.setFillStyle(0x008000, 0.7); // grön för completed
        }
        else {
            node.render.setFillStyle(0x000000, 0.7);
        }
    }

    selectNode(index) {
        this.unhighlightNode(this.currentNodeIndex);
        this.currentNodeIndex = index;
        this.highlightNode(this.currentNodeIndex);
    }

    startLevel(index) {
        // startar battlescene för vald index
        console.log(`Starting level ${index + 1}`);
        this.scene.start('BattleScene', { level: this.levelNodes[index].level, player: this.player, seed: this.seed });

        // markerar banan som completed efter att den startas
        // lite fult skrivet kanske?
        this.levelNodes[index].completed = true;

        this.updateNodeAppearance(index);
    }
}
export default MapScene;