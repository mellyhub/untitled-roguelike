import levels from '../data/levels.js';
import weapons from '../data/weapons.js';

class BattleScene extends Phaser.Scene {
  constructor() {
    super('BattleScene');
  }

  preload() {
    // Load assets (images, sounds, etc.)
    this.load.image('background', 'src/assets/images/bg.png');
  }

  init(data) {
    console.log(data);
    this.levelData = data.level;
  }

  addMenuItem(x, y, text) {
    return this.add.text(x, y, text)
  }

  handleSelection(direction) {
    if (direction == "down") {
      this.currentSelection = (this.currentSelection + 1) % this.menuItems.length;
    }
    else if (direction == "up") {
      this.currentSelection = (this.currentSelection - 1 + this.menuItems.length) % this.menuItems.length;
    }

    // resetar färg på alla menu items
    this.menuItems.forEach(item => item.setColor('#ffffff'));

    // markerar vald menu item
    this.menuItems[this.currentSelection].setColor('#ff0000');
  }

  displayStats() {
    // grafisk design är min passion
    this.add.rectangle(150, 180, 180, 20, 0x2d3a80).setOrigin(0);
    this.add.rectangle(500, 180, 180, 20, 0x2d3a80).setOrigin(0);
    this.add.text(150, 180, `${this.player.name}: ${this.player.health} HP`, { fontSize: '20px' });
    this.add.text(500, 180, `${this.enemy.name}: ${this.enemy.health} HP`, { fontSize: '20px' });
  }

  passTurn() {
    this.currentTurn = (this.currentTurn + 1) % 2;
  }

  executeAttack(attacker, defender) {
    // pausar alla meny inputs medan attacken sker
    this.menuItems.forEach(item => item.disableInteractive());
    defender.health -= attacker.weapon.castable[0].damage;
    if (defender.health <= 0) {
      console.log(`${defender.name} is defeated!`);
    }
    else {
      console.log(`${attacker.name} attacks ${defender.name} with ${attacker.weapon.castable[0].name} for ${attacker.weapon.castable[0].damage} damage!`);
    }

    this.displayStats();

    // paausar scenen i en sekund för att spelaren ska se attacken
    this.time.delayedCall(1000, () => {
      this.passTurn();

      // ai attackerar spelaren varje gång det är deras turn
      if (this.currentTurn === 1) {
        this.executeAttack(this.enemy, this.player);
      }

      // tillåter inputs igen efter attacken
      this.menuItems.forEach(item => item.setInteractive());

      this.checkBattleOutcome();
    });
  }

  checkBattleOutcome() {
    if (this.enemy.health <= 0) {
      this.add.text(400, 300, 'You win!', { fontSize: '32px', fill: '#fff' }).setOrigin(0.5);
      this.time.delayedCall(1000, () => {
        this.scene.switch('MapScene');
      });
    }
    else if (this.player.health <= 0) {
      this.add.text(400, 300, 'You lose!', { fontSize: '32px', fill: '#fff' }).setOrigin(0.5);
      this.scene.pause();
    }
  }

  create() {
    // skapar spelaren
    this.player = {
      name: "Player",
      health: 100,
      weapon: weapons[0] // sätter spelarens vapen till dagger från weapons.js
    }

    this.enemy = this.levelData.enemies[0]; // hämtar fiende från första banan levels.js

    this.turnOrder = [this.player, this.enemy];
    this.currentTurn = 0;

    this.cursors = this.input.keyboard.createCursorKeys(); // lägger till arrow keys
    this.enterKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.ENTER); // lägger till enter key

    this.add.image(400, 300, 'background');
    const menuWidth = 800;
    const menuHeight = 150;
    this.menuItems = [];
    this.currentSelection = 0;
    const container = this.add.container(0, 450, [
      this.add.rectangle(0, 0, menuWidth, menuHeight, 0x4e818e).setOrigin(0),
      // hårdkodade menu items för tillfället
      this.menuItems[0] = this.addMenuItem(60, 20, 'Slåss'),
      this.menuItems[1] = this.addMenuItem(60, 40, 'Menu2'),
      this.menuItems[2] = this.addMenuItem(60, 60, 'Menu3'),
      this.menuItems[3] = this.addMenuItem(60, 80, 'Menu4'),
    ]);
    // markerar menuItem[0] som default
    this.handleSelection();
    this.displayStats();
  }

  update() {
    if (Phaser.Input.Keyboard.JustDown(this.cursors.down)) {
      // går ner i listan
      this.handleSelection("down");
    }
    if (Phaser.Input.Keyboard.JustDown(this.cursors.up)) {
      // går upp i listan
      this.handleSelection("up");
    }
    if (Phaser.Input.Keyboard.JustDown(this.enterKey)) {
      if (this.currentSelection == 0) {
        this.executeAttack(this.player, this.enemy);
      }
      else if (this.currentSelection == 1) {
        console.log("Menu2 selected");
      }
      else if (this.currentSelection == 2) {
        console.log("Menu3 selected");
      }
      else if (this.currentSelection == 3) {
        console.log("Menu4 selected");
      }
    }
    // "M" byter mellan kartan och BattleScene
    this.input.keyboard.on('keydown-M', () => {
      this.scene.switch('MapScene');
    });
  }
}
export default BattleScene;