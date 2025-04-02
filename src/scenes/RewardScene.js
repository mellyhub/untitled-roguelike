import weapons from '../data/weapons.js';
import spells from '../data/spells.js';
import seedrandom from 'seedrandom';

// generating random health by using the seed
function getRandomStat(player, seed) {
    const rng = seedrandom(seed);
    const statKeys = Object.keys(player.stats);
    return statKeys[Math.floor(rng() * statKeys.length)];
}

function getRandomWeapon(seed) {
    const rng = seedrandom(seed);
    const weaponKeys = Object.keys(weapons);
    const randomKey = weaponKeys[Math.floor(rng() * weaponKeys.length)];
    const randomWeapon = weapons[randomKey];
    console.log(`Selected weapon: ${randomWeapon.name}`);
    return randomWeapon;
}

function getRandomSpell(seed) {
    const rng = seedrandom(seed);
    const spellKeys = Object.keys(spells);
    const randomKey = spellKeys[Math.floor(rng() * spellKeys.length)];
    const randomSpell = spells[randomKey];
    console.log(`Selected spell: ${randomSpell.name}`);
    return randomSpell;
}

class RewardScene extends Phaser.Scene {
    constructor() {
        super('RewardScene');
    }

    preload() {
        // Load assets (images, sounds, etc.)
        this.load.image('card', 'src/assets/images/card.png'); // placeholder
        this.load.image('frostbolt-icon', 'src/assets/images/spell-icons/frostbolt-icon.png'); // loads frostbolt spell icon
    }

    create(data) {
        this.player = data.player;
        this.seed = data.seed;

        const randomStat = getRandomStat(this.player, this.seed);
        const randomWeapon = getRandomWeapon(this.seed);
        const randomSpell = getRandomSpell(this.seed);

        console.log(randomWeapon);
        this.rewards = [
            {
                name: `Weapon:\n${randomWeapon.name}`,
                description: "Equip a new weapon.",
                effect: () => { this.player.weapon = randomWeapon }
            },
            {
                name: `Gain 5\n${randomStat}`,
                description: `Increase ${randomStat} by 5.`,
                effect: () => { this.player.stats[randomStat] += 5; }
            },
            {
                name: `Gain spell:\n${randomSpell.name}`,
                description: `Learns the ${randomSpell.name} spell`,
                effect: () => {
                    this.player.spells.push(randomSpell);
                }
            },
        ];

        // track currently selected card
        this.currentSelection = 0;

        this.renderCards(randomWeapon, randomStat, randomSpell);

        this.descriptionText = this.add.text(960, 700, this.rewards[this.currentSelection].description, {
            fontSize: '32px',
            fill: '#fff',
            wordWrap: { width: 800 },
            align: 'center',
        }).setOrigin(0.5);

        this.cursors = this.input.keyboard.createCursorKeys();
        this.enterKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.ENTER);
    }

    renderCards(weapon, stat, spell) {
        this.cardElements = this.rewards.map((reward, index) => {
            const xPosition = 560 + index * 400; // position cards horizontally
            const yPosition = 400;

            const card = this.add.image(xPosition, yPosition, 'card').setScale(1.5);

            if (index === 2) {
                this.add.image(xPosition, yPosition - 100, 'frostbolt-icon').setScale(0.8);
            }

            // highlight selected card
            if (index === this.currentSelection) {
                card.setTint(0xffff00); // highlight in yellow
            }
            else {
                card.clearTint(); // remove highlight
            }

            const title = this.add.text(xPosition, yPosition + 100, reward.name, {
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

        this.descriptionText.setText(this.rewards[this.currentSelection].description);
    }

    selectCard() {
        const selectedReward = this.rewards[this.currentSelection];
        selectedReward.effect();
        
        console.log(`Selected reward: ${selectedReward.name}`);

        console.log(this.player);

        this.scene.start('MapScene', { player: this.player });
    }
}

export default RewardScene;