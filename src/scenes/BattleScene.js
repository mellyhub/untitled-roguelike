import weapons from '../data/weapons.js';
import classes from '../data/classes.js';

class BattleScene extends Phaser.Scene {
  constructor() {
    super('BattleScene');
  }

  preload() {
    // Load assets (images, sounds, etc.)
    this.load.image('background', 'src/assets/images/bg.png');
    this.load.image('player', 'src/assets/images/warrior-prototyp1.png');
    this.load.image('battleUi', 'src/assets/images/fight-ui-prototyp1.png');
  }

  init(data) {
    console.log(data);
    this.levelData = data.level;
  }

  addMenuItem(x, y, text) {
    return this.add.text(x, y, text, { fontSize: '52px' })
  }

  displayStats() {
    // grafisk design är min passion
    this.add.rectangle(400, 200, 500, 52, 0x2d3a80).setOrigin(0);
    this.add.rectangle(1220, 200, 500, 52, 0x2d3a80).setOrigin(0);
    this.add.text(400, 200, `${this.player.name}: ${this.player.health} HP`, { fontSize: '52px' });
    this.add.text(1220, 200, `${this.enemy.name}: ${this.enemy.health} HP`, { fontSize: '52px' });
  }

  passTurn() {
    this.currentTurn = (this.currentTurn + 1) % 2;
  }

  executeAttack(attacker, spell, defender) {
    // pausar alla inputs medan attacken sker
    this.inputLocked = true;

    defender.health -= spell.damage;
    if (defender.health <= 0) {
      console.log(`${defender.name} is defeated!`);
    }
    else {
      console.log(`${attacker.name} attacks ${defender.name} with ${spell.name} for ${spell.damage} damage!`);
    }

    this.displayStats();

    this.hitAnimation = {
      text: this.add.text(700, 100, "Animation in progress", { fontSize: '52px' }),
    }

    this.time.delayedCall(1000, () => {
      this.hitAnimation.text.destroy();

      this.passTurn();

      this.checkBattleOutcome();

      // ai attackerar spelaren varje gång det är deras turn
      if (this.currentTurn === 1) {
        // hårdkodat så att ai alltid väljer deras första spell
        const firstSpell = Object.values(this.enemy.weapon.castable)[0];
        this.executeAttack(this.enemy, firstSpell, this.player);
      }

      // tillåter inputs igen efter attacken
      this.inputLocked = false;
    });
  }

  checkBattleOutcome() {
    if (this.enemy.health <= 0) {
      this.add.text(960, 540, 'You win!', { fontSize: '64px', fill: '#fff' }).setOrigin(0.5);
      this.time.delayedCall(1000, () => {
        this.scene.switch('MapScene');
      });
    }
    else if (this.player.health <= 0) {
      this.add.text(960, 540, 'You lose!', { fontSize: '64px', fill: '#fff' }).setOrigin(0.5);
      this.scene.pause();
    }
  }

  create() {
    // skapar spelaren
    this.player = {
      name: "Player",
      health: 100,
      weapon: weapons.dagger, // sätter spelarens vapen till dagger från weapons.js
      class: classes.warrior // sätter spelarens klass till warrior
    }

    this.enemy = this.levelData.enemies[0]; // hämtar den första fienden från vald level

    this.turnOrder = [this.player, this.enemy];
    this.currentTurn = 0;

    this.cursors = this.input.keyboard.createCursorKeys(); // lägger till arrow keys
    this.enterKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.ENTER); // lägger till enter key

    this.add.image(960, 540, 'background').setAlpha(0.1);
    this.add.image(960, 540, 'battleUi');
    this.add.image(480, 540, 'player').setScale(0.4);
    this.hitAnimation;

    // menyn representeras av en 2d array
    this.mainMenu = [
      { x: 0, y: 0, text: 'Slåss' },
      { x: 200, y: 0, text: 'Bag' },
      { x: 0, y: 50, text: 'Menu3' },
      { x: 200, y: 50, text: 'Menu4' }
    ];

    this.bagMenu = [
      { x: 0, y: 0, text: 'Potion' },
      { x: 200, y: 0, text: 'Elixir' },
      { x: 0, y: 50, text: 'Bomb' },
      { x: 200, y: 50, text: 'Back' }
    ];

    this.currentMenu = this.mainMenu; // startar på main menyn
    this.currentSelection = 0; // default
    this.renderMenu(this.currentMenu);
    this.displayStats();
  }

  renderMenu(menu) {
    if (this.menuItems) {
      this.menuItems.forEach(item => item.destroy());
    }

    this.menuItems = menu.map((menuItem, index) => {
      const text = this.add.text(menuItem.x, menuItem.y, menuItem.text, { fontSize: '52px' });
      if (index === this.currentSelection) {
        text.setColor('#ff0000');
      }
      return text;
    });
  }

  handleSelection(direction) {
    // resetar färg på alla menuItems
    this.menuItems.forEach(item => item.setColor('#ffffff'));

    // updaterar vald index beroende på input
    if (direction === "down") {
      this.currentSelection = (this.currentSelection + 1) % this.currentMenu.length;
    } else if (direction === "up") {
      this.currentSelection = (this.currentSelection - 1 + this.currentMenu.length) % this.currentMenu.length;
    } else if (direction === "right") {
      this.currentSelection = (this.currentSelection + 1) % this.currentMenu.length;
    } else if (direction === "left") {
      this.currentSelection = (this.currentSelection - 1 + this.currentMenu.length) % this.currentMenu.length;
    }

    // highligtar vald menuItem
    this.menuItems[this.currentSelection].setColor('#ff0000');
  }

  switchToBagMenu() {
    this.currentMenu = this.bagMenu;
    this.currentSelection = 0;
    this.renderMenu(this.currentMenu); // rendrar nya menyn
  }

  switchToMainMenu() {
    this.currentMenu = this.mainMenu;
    this.currentSelection = 0;
    this.renderMenu(this.currentMenu); // rendrar nya menyn
  }

  update() {
    if (this.inputLocked) {
      return; // ignorerar inputs (funkar lowkey inte lol)
    }

    if (Phaser.Input.Keyboard.JustDown(this.cursors.down)) {
      this.handleSelection("down");
    }
    if (Phaser.Input.Keyboard.JustDown(this.cursors.up)) {
      this.handleSelection("up");
    }
    if (Phaser.Input.Keyboard.JustDown(this.cursors.right)) {
      this.handleSelection("right");
    }
    if (Phaser.Input.Keyboard.JustDown(this.cursors.left)) {
      this.handleSelection("left");
    }
    if (Phaser.Input.Keyboard.JustDown(this.enterKey)) {
      const selectedItem = this.currentMenu[this.currentSelection];
      if (selectedItem.text === 'Slåss') {
        this.executeAttack(this.player, this.player.weapon.castable.stab, this.enemy);
      } else if (selectedItem.text === 'Bag') {
        this.switchToBagMenu();
      } else if (selectedItem.text === 'Back') {
        this.switchToMainMenu();
      } else {
        console.log(`${selectedItem.text} selected`);
      }
    }

    // "M" byter mellan kartan och BattleScene
    this.input.keyboard.on('keydown-M', () => {
      this.scene.switch('MapScene');
    });
  }
}
export default BattleScene;