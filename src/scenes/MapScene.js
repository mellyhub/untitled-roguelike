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

        this.levelNodes.forEach((node, index) => {
            node.render.setInteractive();
            node.render.on('pointerdown', () => {
                if (!node.completed) {
                    this.selectNode(index);
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
        }
    }

    unhighlightNode(index) {
        const node = this.levelNodes[index];
        if (!node.completed) {
            node.render.setFillStyle(0x000000, 0.7); // reset färg
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