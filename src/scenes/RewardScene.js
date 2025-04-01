import weapons from '../data/weapons.js';
import seedrandom from 'seedrandom';

// generating random health by using the seed
function getRandomStat(player, seed) {
    const rng = seedrandom(seed);
    const statKeys = Object.keys(player.stats);
    return statKeys[Math.floor(rng() * statKeys.length)];
}

class RewardScene extends Phaser.Scene {
    constructor() {
        super('RewardScene');
    }

    preload() {
        // Load assets (images, sounds, etc.)
        this.load.image('card', 'src/assets/images/card.png'); // placeholder
    }

    create(data) {
        this.player = data.player;
        this.seed = data.seed;

        const randomStat = getRandomStat(this.player, this.seed)
        this.rewards = [
            {
                name: "Weapon:\nJens svärd",
                description: "Equips Jens Svärd.",
                effect: () => { this.player.weapon = weapons.jens_sword }
            },
            {
                name: `Gain 5 ${randomStat}`,
                description: `Increase ${randomStat} by 5.`,
                effect: () => { this.player.stats[randomStat] += 5; }
            },
            {
                name: "Gain spell:\nFrostbolt",
                description: "Learns the Frostbolt spell.",
                // how fix ?
                effect: () => {
                    this.player.weapon.castable = {
                        ...this.player.weapon.castable,
                        frostbolt: this.player.weapon.castable.frostbolt,
                    };
                }
            },
        ];

        // track currently selected card
        this.currentSelection = 0;

        this.renderCards();

        this.cursors = this.input.keyboard.createCursorKeys();
        this.enterKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.ENTER);

        this.add.text(960, 700, 'Use Left/Right to navigate and Enter to select', {
            fontSize: '32px',
            fill: '#fff',
        }).setOrigin(0.5);
    }

    renderCards() {
        this.cardElements = this.rewards.map((reward, index) => {
            const xPosition = 560 + index * 400; // position cards horizontally
            const yPosition = 400;

            const card = this.add.image(xPosition, yPosition, 'card').setScale(1.5);

            // highlight selected card
            if (index === this.currentSelection) {
                card.setTint(0xffff00); // highlight in yellow
            } else {
                card.clearTint(); // remove highlight
            }

            const title = this.add.text(xPosition, yPosition, reward.name, {
                fontSize: '32px',
                color: "#000000",
                align: "center",
            }).setOrigin(0.5, 0.5);
            return { card, title };
        });
    }

    update() {
        if (Phaser.Input.Keyboard.JustDown(this.cursors.left)) {
            this.changeSelection(-1);
        }
        else if (Phaser.Input.Keyboard.JustDown(this.cursors.right)) {
            this.changeSelection(1);
        }

        if (Phaser.Input.Keyboard.JustDown(this.enterKey)) {
            this.selectCard();
        }
    }

    changeSelection(direction) {
        // update selection index
        this.currentSelection = (this.currentSelection + direction + this.rewards.length) % this.rewards.length;

        // re-render cards to display the change
        this.renderCards();
    }

    selectCard() {
        const selectedReward = this.rewards[this.currentSelection];
        selectedReward.effect();
        
        console.log(`Selected reward: ${selectedReward.name}`);

        this.scene.start('MapScene', { player: this.player });
    }
}

export default RewardScene;