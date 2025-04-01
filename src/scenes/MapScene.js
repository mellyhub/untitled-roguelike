import levels from '../data/levels.js';

class MapScene extends Phaser.Scene {
    constructor() {
        super('MapScene');
    }

    preload() {
        // Load assets (images, sounds, etc.)
        this.load.image('map', 'src/assets/images/map.png');
    }

    create(data) {
        this.player = data.player; // gets player object that we created in MainMenu
        this.add.image(0, 0, 'map').setOrigin(0).setScale(1.25);

        // levelNodes kanske bör ligga i en separat fil?
        this.levelNodes = [
            {
                level: levels[0],
                render: this.add.rectangle(440, 300, 50, 50, 0x000000, 0.7),
                text: this.add.text(440, 300, "1", { fontSize: '20px' }),
                completed: levels[0].completed
            },
            {
                level: levels[1],
                render: this.add.rectangle(600, 420, 50, 50, 0x000000, 0.7),
                text: this.add.text(600, 420, "2", { fontSize: '20px' }),
                completed: levels[1].completed
            },
            {
                level: levels[2],
                render: this.add.rectangle(770, 420, 50, 50, 0x000000, 0.7),
                text: this.add.text(770, 420, "3", { fontSize: '20px' }),
                completed: levels[2].completed
            },
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
            this.scene.switch('TalentScene');
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
            node.render.setFillStyle(0xffff00, 0.7); // highlightar vald node
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
        this.scene.start('BattleScene', { level: this.levelNodes[index].level, player: this.player });

        // markerar banan som completed efter att den startas
        // lite fult skrivet kanske?
        this.levelNodes[index].completed = true;

        this.updateNodeAppearance(index);
    }
}
export default MapScene;