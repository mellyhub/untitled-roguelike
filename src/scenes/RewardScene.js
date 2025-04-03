import weapons from '../data/weapons.js';
import spells from '../data/spells.js';
import seedrandom from 'seedrandom';
import assets from '../assets/assets.json'; // Import the assets.json file

// generating random health by using the seed
function getRandomStat(seed, player) {
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

function getIconForReward(rewardType, rewardName) {
    const iconMapping = {
        // chatgpt type shit
        weapon: rewardName.toLowerCase().replace(/\s+/g, '-') + '-icon',
        stat: rewardName.toLowerCase() + '-icon',
        spell: rewardName.toLowerCase().replace(/\s+/g, '-') + '-icon',
    };

    const iconKey = iconMapping[rewardType];
    console.log(`Icon key for ${rewardType} (${rewardName}): ${iconKey}`);
    return iconKey;
}

class RewardScene extends Phaser.Scene {
    constructor() {
        super('RewardScene');
    }

    preload() {
        // iterate through assets
        assets.forEach(assetGroup => {
            assetGroup.assets.forEach(asset => {
                if (asset.type === 'image') {
                    const assetPath = `${assetGroup.path}/${asset.url}`;
                    console.log(assetPath)
                    // dynamically loads image asset
                    this.load.image(asset.key, assetPath);
                }
            });
        });
    }

    create(data) {
        this.player = data.player;
        this.seed = data.seed;
        this.randomStat = getRandomStat(this.seed, this.player);
        this.randomWeapon = getRandomWeapon(this.seed);
        this.randomSpell = getRandomSpell(this.seed);

        console.log(this.randomWeapon);
        this.rewards = [
            {
                name: `Weapon:\n${this.randomWeapon.name}`,
                description: "Equip a new weapon.",
                effect: () => { this.player.weapon = this.randomWeapon }
            },
            {
                name: `Gain 5\n${this.randomStat}`,
                description: `Increase ${this.randomStat} by 5.`,
                effect: () => { this.player.stats[this.randomStat] += 5; }
            },
            {
                name: `Gain spell:\n${this.randomSpell.name}`,
                description: `Learns the ${this.randomSpell.name} spell`,
                effect: () => {
                    this.player.spells.push(this.randomSpell);
                }
            },
        ];

        // track currently selected card
        this.currentSelection = 0;

        // cards are rendered once
        this.cardElements = [];
        this.rewards.forEach((reward, index) => {
            const xPosition = 560 + index * 400; // position cards horizontally
            const yPosition = 400;

            const card = this.add.image(xPosition, yPosition, 'card').setScale(1.5);

            let iconKey = null;
            if (index === 0) {
                iconKey = getIconForReward('weapon', this.randomWeapon.name);
            } else if (index === 1) {
                iconKey = getIconForReward('stat', this.randomStat);
            } else if (index === 2) {
                iconKey = getIconForReward('spell', this.randomSpell.name);
            }

            // add icon if it exists
            if (iconKey && this.textures.exists(iconKey)) {
                this.add.image(xPosition, yPosition - 100, iconKey);
            } else {
                console.warn(`Icon not found or not loaded: ${iconKey}`);
            }

            const title = this.add.text(xPosition, yPosition + 100, reward.name, {
                fontSize: '32px',
                color: "#000000",
                align: "center",
            }).setOrigin(0.5, 0.5);

            this.cardElements.push({ card, title });
        });

        // add description text
        this.descriptionText = this.add.text(960, 700, this.rewards[this.currentSelection].description, {
            fontSize: '32px',
            fill: '#fff',
            wordWrap: { width: 800 },
            align: 'center',
        }).setOrigin(0.5);

        this.cursors = this.input.keyboard.createCursorKeys();
        this.enterKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.ENTER);

        this.updateCardHighlights();
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
        
        // update card highlight
        this.updateCardHighlights();

        // update description text
        this.descriptionText.setText(this.rewards[this.currentSelection].description);
    }

    selectCard() {
        const selectedReward = this.rewards[this.currentSelection];
        selectedReward.effect();

        console.log(`Selected reward: ${selectedReward.name}`);

        console.log(this.player);

        this.scene.start('MapScene', { player: this.player });
    }
    updateCardHighlights() {
        this.cardElements.forEach((element, index) => {
            if (index === this.currentSelection) {
                element.card.setTint(0xffff00); // highlight in yellow
            }
            else {
                element.card.clearTint(); // remove highlight
            }
        });
    }
}

export default RewardScene;