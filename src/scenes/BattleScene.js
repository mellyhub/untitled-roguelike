import player, { initializePlayer } from '../data/player.js';

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
    this.levelData = data.level;
    this.selectedClass = data.selectedClass; // hämtar vald class

    initializePlayer(this.selectedClass);
  }

  addMenuItem(x, y, text) {
    return this.add.text(x, y, text, { fontSize: '52px' })
  }

  displayStats() {
    // grafisk design är min passion
    this.add.rectangle(400, 200, 500, 52, 0x2d3a80).setOrigin(0);
    this.add.rectangle(1220, 200, 500, 52, 0x2d3a80).setOrigin(0);
    this.add.text(400, 100, `Class: ${this.player.class.name}`, { fontSize: '52px' });
    this.add.text(400, 150, `Level: ${this.player.level}`, { fontSize: '52px' });
    this.add.text(400, 200, `${this.player.name}: ${this.player.health} HP`, { fontSize: '52px' });
    this.add.text(1220, 200, `${this.enemy.name}: ${this.enemy.health} HP`, { fontSize: '52px' });
  }

  passTurn() {
    this.currentTurn = (this.currentTurn + 1) % 2;
  }

  executeTurn(currentTurn) {
      this.inputLocked = true;

      if (this.battleEnded) {
        console.log("The battle has already ended. No further actions are allowed.");
        return;
      }
      if (this.enemy.health <= 0) {
        this.battleEnded = true;
        this.inputLocked = false;
        return;
      }

      if (currentTurn == 0) {
        this.executeAttack(this.player, this.player.weapon.castable.heavy_swing, this.enemy);
        this.passTurn();
      }
      else if (currentTurn == 1) {
        const firstSpell = Object.values(this.enemy.weapon.castable)[0];
        this.executeAttack(this.enemy, firstSpell, this.player);
        this.passTurn();
      }

      this.displayStats();
      this.checkBattleOutcome();
      

      this.inputLocked = false;


    }

  executeAttack(attacker, spell, target) {
    target.health -= spell.damage(attacker.stats);

    //this.displayStats();

    this.hitAnimation = {
        text: this.add.text(700, 500, "Animation in progress", { fontSize: '52px' }),
    };

    this.time.delayedCall(1000, () => {
        this.hitAnimation.text.destroy();

        //this.passTurn();

        // AI attacks the player if it's their turn
        /*if (this.currentTurn == 1 && !this.battleEnded) {
            const firstSpell = Object.values(this.enemy.weapon.castable)[0];
            this.executeAttack(this.enemy, firstSpell, this.player);
        }*/

        // Allow inputs again after the attack
        //this.inputLocked = false;
        //resolve("Attacked finished");
    });
  }

    /*
  if (target.health <= 0) {
      console.log(`${target.name} is defeated!`);
      this.battleEnded = true; // Mark the battle as ended
      this.checkBattleOutcome(); // Handle the battle outcome
      this.inputLocked = false;
      resolve("Jens was defeated");
      return; // Exit the function
  }
  

  if (target.health <= 0) {
    this.battleEnded = true;
    this.inputLocked = false;
    resolve("Jens was defeated");
    return;
  }
  */

  checkBattleOutcome() {
    if (this.enemy.health <= 0) {
      this.add.text(960, 640, 'You win!', { fontSize: '64px', fill: '#fff' }).setOrigin(0.5);

      player.level = (player.level || 1) + 1; // copilot type shit
      //console.log(`Player leveled up! Current level: ${player.level}`);

      this.levelData.completed = true;

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
    this.player = player; //hämtar spelaren från player.js

    console.log(`Player initialized with class: ${this.player.class.name}`);
    console.log(`Player stats:`, this.player.stats);

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
      { x: 1, y: 0, text: 'Bag' },
      { x: 0, y: 1, text: 'Menu3' },
      { x: 1, y: 1, text: 'Menu4' },
    ];

    this.bagMenu = [
      { x: 0, y: 0, text: 'Potion' },
      { x: 1, y: 0, text: 'Elixir' },
      { x: 0, y: 1, text: 'Bomb' },
      { x: 1, y: 1, text: 'Back' }
    ];

    this.currentMenu = this.mainMenu; // startar på main menyn
    this.currentSelection = { x: 0, y: 0 }; // default
    this.renderMenu(this.currentMenu);
    this.displayStats();
  }

  renderMenu(menu) {
    if (this.menuItems) {
      this.menuItems.forEach(item => item.destroy());
    }

    this.menuItems = menu.map(menuItem => {
      const xPosition = 300 + menuItem.x * 200; // horisontell spacing
      const yPosition = 850 + menuItem.y * 100; // vertikal spacing
      const text = this.add.text(xPosition, yPosition, menuItem.text, { fontSize: '48px', fill: '#fff' }).setOrigin(0.5);

      // highlightar valt item
      if (menuItem.x == this.currentSelection.x && menuItem.y == this.currentSelection.y) {
        text.setColor('#ff0000');
      }

      return text;
    });
  }

  changeSelection(deltaX, deltaY) {
    // uppdaterar val
    const newX = this.currentSelection.x + deltaX;
    const newY = this.currentSelection.y + deltaY;

    // förhindrar out of bounds
    const isValidSelection = this.currentMenu.some(item => item.x == newX && item.y == newY);
    if (isValidSelection) {
      this.currentSelection = { x: newX, y: newY };
      this.renderMenu(this.currentMenu); // rendrar menyn på nytt
    }
  }

  selectMenuItem() {
    // hittar valt item
    const selectedItem = this.currentMenu.find(
      item => item.x == this.currentSelection.x && item.y == this.currentSelection.y
    );

    //console.log(selectedItem);

    if (selectedItem) {
      //console.log(`Selected menu item: ${selectedItem.text}`);
      // Handle menu item actions here
      if (selectedItem.text == 'Slåss') {
        console.log('Attack selected!');
        this.executeTurn(this.currentTurn);  
      }
      else if (selectedItem.text == 'Bag') {
        console.log('Bag selected!');
        this.switchMenu(this.bagMenu);
      }
      else if (selectedItem.text == 'Back') {
        console.log('Back selected!');
        this.switchMenu(this.mainMenu);
      }
      else {
        console.log(`${selectedItem.text} selected`);
      }
    }
  }

  switchMenu(menu) {
    this.currentMenu = menu;
    this.currentSelection = { x: 0, y: 0 };
    this.renderMenu(menu); // rendrar nya menyn
  }

  switchToBagMenu() {
    this.currentMenu = this.bagMenu;
    this.currentSelection = { x: 0, y: 0 };
    this.renderMenu(this.currentMenu); // rendrar nya menyn
  }

  switchToMainMenu() {
    this.currentMenu = this.mainMenu;
    this.currentSelection = { x: 0, y: 0 };
    this.renderMenu(this.currentMenu); // rendrar nya menyn
  }

  update() {
    if (this.inputLocked) {
      return; // ignorerar inputs (funkar lowkey inte lol)
    }

    if (Phaser.Input.Keyboard.JustDown(this.cursors.up)) {
      this.changeSelection(0, -1); // Move up
    }
    else if (Phaser.Input.Keyboard.JustDown(this.cursors.down)) {
      this.changeSelection(0, 1); // Move down
    }
    else if (Phaser.Input.Keyboard.JustDown(this.cursors.left)) {
      this.changeSelection(-1, 0); // Move left
    }
    else if (Phaser.Input.Keyboard.JustDown(this.cursors.right)) {
      this.changeSelection(1, 0); // Move right
    }

    if (Phaser.Input.Keyboard.JustDown(this.enterKey)) {
      this.selectMenuItem();
    }

    // "M" byter mellan kartan och BattleScene
    this.input.keyboard.on('keydown-M', () => {
      this.scene.switch('MapScene');
    });
  }
}
export default BattleScene;