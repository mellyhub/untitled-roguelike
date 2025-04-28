class MapScene extends Phaser.Scene {
    constructor() {
        super('MapScene');
    }

    preload() {
        // Load assets (images, sounds, etc.)
        this.load.image('portal', 'src/assets/images/backgrounds/portal.png');
    }

    create(data) {
        this.player = data.player; // gets player object that we created in MainMenu
        this.seed = data.seed;
        this.add.image(0, -50, 'portal').setOrigin(0);

        // highlightar node[0] som default
        //this.currentNodeIndex = 0;
        //this.highlightNode(this.currentNodeIndex);

        // lägger till keyboard inputs
        this.cursors = this.input.keyboard.createCursorKeys();
        this.enterKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.ENTER);

        // "N" switches to talent scene
        this.input.keyboard.on('keydown-N', () => {
            this.scene.switch('TalentScene', { player: this.player });
        });

        // Add start level button for mouse users
        this.startButton = this.add.text(900, 650, 'ENTER PORTAL', {
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
                this.startCombat();
            });

            this.talentsButton = this.add.text(1800, 1000, 'TALENTS', {
                fontSize: '40px',
                fill: '#fff',
                backgroundColor: '#4a1',
                padding: { x: 30, y: 10 }
            }).setOrigin(0.5).setInteractive({ useHandCursor: true });
    
            // Add hover and click effects for start button
            this.talentsButton
                .on('pointerover', () => {
                    this.talentsButton.setStyle({ fill: '#ff0' });
                })
                .on('pointerout', () => {
                    this.talentsButton.setStyle({ fill: '#fff' });
                })
                .on('pointerdown', () => {
                    this.talentsButton.setStyle({ fill: '#f80' });
                })
                .on('pointerup', () => {
                    this.talentsButton.setStyle({ fill: '#ff0' });
                    this.scene.switch('TalentScene', { player: this.player });
                });
    }

    update() {
        if (Phaser.Input.Keyboard.JustDown(this.enterKey)) {
            this.startCombat();
        }
    }

    startCombat() {
        this.scene.start('BattleScene', { player: this.player, seed: this.seed });
    }
}
export default MapScene;