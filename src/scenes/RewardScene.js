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
        this.load.image('card', 'src/assets/images/ui/card.png'); // loads the card image (placeholder)
        this.load.image('frostbolt-icon', 'src/assets/images/spell-icons/frostbolt-icon.png'); // loads frostbolt spell icon (placerholder)
        this.load.image('fireball-icon', 'src/assets/images/spell-icons/fireball-icon.png'); // loads fireball spell icon
        this.load.image('bite-icon', 'src/assets/images/spell-icons/bite-icon.png'); // loads bite spell icon
        this.load.image('jens-sword-icon', 'src/assets/images/item-icons/jens-sword-icon.png'); // loads jens sword icon
        this.load.image('strength-icon', 'src/assets/images/stat-icons/strength-icon.png'); // loads strength icon
        this.load.image('agility-icon', 'src/assets/images/stat-icons/agility-icon.png'); // loads agility icon
        this.load.image('intelligence-icon', 'src/assets/images/stat-icons/intelligence-icon.png'); // loads intelligence icon
    }

    create(data) {
        this.player = data.player;
        this.seed = data.seed;
        this.randomStat = getRandomStat(this.player, this.seed);
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

        this.renderCards(this.randomWeapon, this.randomStat, this.randomSpell);

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
        console.log(spell);
        console.log(weapon)
        this.cardElements = this.rewards.map((reward, index) => {
            const xPosition = 560 + index * 400; // position cards horizontally
            const yPosition = 400;

            const card = this.add.image(xPosition, yPosition, 'card').setScale(1.5);

            // Add icons to cards
            switch (index) {
                case 0: // Weapon card
                    if (weapon.icon) {
                        this.add.image(xPosition, yPosition - 100, weapon.icon);
                    } else {
                        console.warn(`Weapon ${weapon.name} is missing an icon.`);
                    }
                    break;
                case 1: // Stat card
                    this.add.image(xPosition, yPosition - 100, 'strength-icon'); // Use a generic stat icon
                    break;
                case 2: // Spell card
                    if (spell.icon) {
                        this.add.image(xPosition, yPosition - 100, spell.icon);
                    } else {
                        console.warn(`Spell ${spell.name} is missing an icon.`);
                    }
                    break;
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
        this.renderCards(this.randomWeapon,this.randomStat,this.randomSpell);

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