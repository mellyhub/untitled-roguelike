import weapons from '../data/weapons.js';
import spells from '../data/spells.js';
import seedrandom from 'seedrandom';
import assets from '../assets/assets.json'; // Import the assets.json file

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
                    // dynamically loads image asset
                    this.load.image(asset.key, assetPath);
                }
            });
        });
    }

    create(data) {
        this.player = data.player;
        this.seed = data.seed;

        this.weaponKeys = Object.keys(weapons);
        this.statKeys = Object.keys(this.player.stats);
        this.spellKeys = Object.keys(spells);

        // generate 3 random rewards
        this.rewards = [];
        for (let i = 0; i < 3; i++) {
            const reward = this.getRandomReward(this.seed + Math.random(), this.weaponKeys, this.statKeys, this.spellKeys, this.player);
            this.rewards.push(reward);
        }

        // track currently selected card
        this.currentSelection = 0;

        // cards are rendered once
        this.cardElements = [];
        this.rewards.forEach((reward, index) => {
            const xPosition = 560 + index * 400; // position cards horizontally
            const yPosition = 400;

            const card = this.add.image(xPosition, yPosition, 'card').setScale(1.5);

            const rewardType = reward.name.includes('Weapon') ? 'weapon' : reward.name.includes('spell') ? 'spell' : 'stat';

            const iconKey = this.getIconForReward(rewardType, reward.name);

            this.add.image(xPosition, yPosition - 100, 'common-item-frame'); // add icon border

            if (iconKey && this.textures.exists(iconKey)) {
                this.add.image(xPosition, yPosition - 100, iconKey); // add icon if it exists
            }
            else {
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

    getRandomReward(seed, weaponKeys, statKeys, spellKeys, player) {
       
        // not quite sure how to implement seeded randomness in this function
        // have to work on this later
        //const rng = seedrandom(seed);

        // all reward types are weighted equally for now
        const rewardWeights = {
            weapon: 50,
            stat: 50,
            spell: 50,
        };

        const result = this.getWeightedRandom(rewardWeights);
        
        if (result === 'weapon') {
            const randomKey = weaponKeys[Math.floor(Math.random() * weaponKeys.length)];
            const randomWeapon = weapons[randomKey];
            return {
                name: randomWeapon.name,
                description: "Equip a new weapon.",
                effect: () => { player.addWeapon(randomWeapon) }
            }
        }
    
        else if (result === 'stat') {

            // weights for individual stats
            const statWeights = {
                agility: 50,
                strength: 50,
                intelligence: 50,
                defense: 25,
            };
            
            const randomKey = this.getWeightedRandom(statWeights);

            console.log(`Random stat key: ${randomKey}`); // this shit bugged fr
            return {
                name: randomKey,
                description: `Increase ${randomKey} by 5.`,
                effect: () => {
                    if (player.stats[randomKey] !== undefined) {
                        player.stats[randomKey] += 5;
                    }
                    else {
                        console.error(`Stat key "${randomKey}" does not exist in player.stats.`);
                    }
                }
            }
        }
    
        else if (result === 'spell') {
            console.log(spellKeys);
            const randomKey = spellKeys[Math.floor(Math.random() * spellKeys.length)];
            const randomSpell = spells[randomKey];
            return {
                name: randomSpell.name,
                description: `Learns the ${randomSpell.name} spell`,
                effect: () => { player.spells.push(randomSpell) }
            }
        }
    }
    
    getWeightedRandom(weights) {
        const totalWeight = Object.values(weights).reduce((sum, weight) => sum + weight, 0);
        const random = Math.random() * totalWeight;
    
        let cumulativeWeight = 0;
        for (const [key, weight] of Object.entries(weights)) {
            cumulativeWeight += weight;
            if (random < cumulativeWeight) {
                return key;
            }
        }
    }

    // helper function to format the reward name for getIconForReward()
    formatRewardName(name) {
        const formattedName = name
            .toLowerCase()
            .replace(/\s+/g, '-')     // replace spaces with dashes
            .replace(/[^a-z-]/g, ''); // remove all non-letters except dashes
        return formattedName;
    }
    
    getIconForReward(rewardType, rewardName) {
        const formattedName = this.formatRewardName(rewardName);
        const iconMapping = {
            weapon: formattedName + '-icon',
            stat: formattedName + '-icon',
            spell: formattedName + '-icon',
        };
    
        const iconKey = iconMapping[rewardType];
        return iconKey;
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