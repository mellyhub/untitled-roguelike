class MerchantScene extends Phaser.Scene {
    constructor() {
        super('MerchantScene');
    }

    create(data) {
        this.player = data.player;

        this.add.text(960, 100, "dummy interface for merchant/shop.", {
            fontSize: '32px',
            fill: '#fff',
        }).setOrigin(0.5);

        this.goldText = this.add.text(960, 150, `Gold: ${this.player.gold || 0}`, {
            fontSize: '28px',
            fill: '#fff',
        }).setOrigin(0.5);

        // consumables for sale
        this.itemsForSale = [
            // dummy items, will be replaced later
            { name: "Health Potion", cost: 50, effect: () => this.player.health = Math.min(this.player.health + 50, this.player.maxHealth) },
            { name: "Energy Potion", cost: 30, effect: () => this.player.energy = Math.min(this.player.energy + 50, this.player.maxEnergy) },
            { name: "Strength Elixir", cost: 100, effect: () => this.player.stats.strength += 5 },
        ];

        this.currentSelection = 0;

        // render items
        this.itemElements = [];
        this.itemsForSale.forEach((item, index) => {
            const y = 250 + index * 50;

            const text = this.add.text(960, y, `${item.name} - ${item.cost} Gold`, {
                fontSize: '24px',
                fill: '#fff',
            }).setOrigin(0.5);

            this.itemElements.push(text);
        });

        // highlight the first item
        this.updateSelection();

        // adding inputs
        this.cursors = this.input.keyboard.createCursorKeys();
        this.enterKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.ENTER);
        this.escKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.ESC);
    }

    update() {
        if (Phaser.Input.Keyboard.JustDown(this.cursors.up)) {
            this.changeSelection(-1);
        }
        else if (Phaser.Input.Keyboard.JustDown(this.cursors.down)) {
            this.changeSelection(1);
        }
        if (Phaser.Input.Keyboard.JustDown(this.enterKey)) {
            this.purchaseItem();
        }
        if (Phaser.Input.Keyboard.JustDown(this.escKey)) {
            this.scene.start('MapScene', { player: this.player });
        }
    }

    changeSelection(direction) {
        this.itemElements[this.currentSelection].setColor('#fff');
        this.currentSelection = (this.currentSelection + direction + this.itemsForSale.length) % this.itemsForSale.length;
        this.updateSelection();
    }

    updateSelection() {
        this.itemElements[this.currentSelection].setColor('#ff0000');
    }

    purchaseItem() {
        const selectedItem = this.itemsForSale[this.currentSelection];

        if (this.player.gold >= selectedItem.cost) {
            this.player.gold -= selectedItem.cost;
            selectedItem.effect();
            this.goldText.setText(`Gold: ${this.player.gold}`);
            console.log(`Purchased ${selectedItem.name}`);
        }
        else {
            console.log("Not enough gold!");
        }
    }
}

export default MerchantScene;