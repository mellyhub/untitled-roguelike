import seedrandom from 'seedrandom';
import BattleUI from './BattleUI';
import assets from '../assets/assets.json'; // Import the assets.json file
import { executeAttack, executeSpell, processActiveEffects } from './DamageCalc';
import { setCookie, getCookie } from './cookieUtils.js';
import { Goblin } from '../data/goblin.js';

class BattleScene extends Phaser.Scene {
  constructor() {
    super('BattleScene');
  }

  preload() {
    // Load assets (images, sounds, etc.)
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
    this.levelData = data.level;
    this.seed = data.seed;

    this.playerStartHP = this.player.health;

    //this.getEnemy();

    this.enemy = new Goblin();
    this.enemyStartHP = this.enemy.health;

    this.turnCounter = 0;
    this.currentTurn = this.turnCounter % 2;

    this.cursors = this.input.keyboard.createCursorKeys(); // lägger till arrow keys
    this.enterKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.ENTER); // lägger till enter key

    this.add.image(960, 540, 'ice-cave-background');
    this.add.image(480, 540, 'warrior-prototyp1').setScale(0.4);
    this.add.image(1440, 540, 'night-glider').setScale(0.7);

    // initialize battle ui
    this.battleUI = new BattleUI(this);

    this.mainMenu = [
      { x: 0, y: 0, text: 'Attack' },
      { x: 1, y: 0, text: 'Cast' },
      { x: 0, y: 1, text: 'Bag' },
      { x: 1, y: 1, text: 'Menu4' },
    ];

    this.bagMenu = [
      { x: 0, y: 0, text: 'Potion' },
      { x: 1, y: 0, text: 'Elixir' },
      { x: 0, y: 1, text: 'Bomb' },
      { x: 1, y: 1, text: 'Back' },
    ];

    this.hitAnimation;

    // render initial stats and menu
    this.currentMenu = this.mainMenu;
    this.currentSelection = { x: 0, y: 0 };
    this.battleUI.displayStats(this.player, this.enemy, this.playerStartHP, this.enemyStartHP, this.turnCounter);
    this.battleUI.renderMenu(this.currentMenu, this.currentSelection);
  }

  update() {
    if (this.inputLocked) {
      return; // ignorerar inputs (funkar lowkey inte lol)
    }

    if (Phaser.Input.Keyboard.JustDown(this.cursors.up)) {
      this.battleUI.changeSelection(0, -1); // Move up
    }
    else if (Phaser.Input.Keyboard.JustDown(this.cursors.down)) {
      this.battleUI.changeSelection(0, 1); // Move down
    }
    else if (Phaser.Input.Keyboard.JustDown(this.cursors.left)) {
      this.battleUI.changeSelection(-1, 0); // Move left
    }
    else if (Phaser.Input.Keyboard.JustDown(this.cursors.right)) {
      this.battleUI.changeSelection(1, 0); // Move right
    }

    if (Phaser.Input.Keyboard.JustDown(this.enterKey)) {
      const selectedItem = this.battleUI.getSelectedItem();

      if (this.battleUI.currentMenuType === 'main' && selectedItem.text === 'Cast') {
        // opens spell menu
        this.battleUI.renderSpellMenu(
          this.player,
          this.battleUI.switchMenu.bind(this.battleUI),
          this.mainMenu
        );
      }
      else {
        // handle other menu actions
        this.battleUI.selectMenuItem(
          this.player,
          this.executeTurn.bind(this),
          this.battleUI.switchMenu.bind(this.battleUI),
          this.bagMenu,
          this.mainMenu
        );
      }
    }

    // "M" byter mellan kartan och BattleScene
    this.input.keyboard.on('keydown-M', () => {
      this.scene.switch('MapScene');
    });
  }
  // Array of rendered elements (healthbar, text, etc..), used for removing elements before rerendering
  playerStartHP = 0;
  enemyStartHP = 0;

  // Wait for player or enemy to finish attacking
  resolveAfterTime(ms) {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve();
      }, ms);
    })
  }

  displayAnimationText(name, action, selectedSpell) {
    if (action == "attack") {
      return this.add.text(700, 500, `${name} attacks...`, { fontSize: '52px', fill: '#fff' });
    } else if (action == "cast") {
      return this.add.text(700, 500, `${name} casts ${selectedSpell.name}...`, { fontSize: '52px', fill: '#fff' });
    }
  }

  async executeTurn(action, selectedSpell) {
    this.inputLocked = true;
    processActiveEffects(this.player);

    if (action === 'attack') {
      this.player.attack(this.enemy);
    }
    else if (action === 'cast') {
      if (selectedSpell) {
        this.player.cast(this.enemy, selectedSpell);
      }
      else {
        console.warn('No spell selected!');
      }
    }

    const animationText = this.displayAnimationText(this.player.name, action, selectedSpell);
    await this.resolveAfterTime(1000);
    animationText.destroy();

    this.battleUI.displayStats(this.player, this.enemy, this.playerStartHP, this.enemyStartHP, this.turnCounter);
    this.battleUI.renderMenu(this.currentMenu, this.currentSelection);

    if (this.enemy.health > 0) {
      processActiveEffects(this.enemy);
      this.enemy.attack(this.player);
      const animationText = this.displayAnimationText(this.enemy.name, "attack", selectedSpell);
      await this.resolveAfterTime(1000);
      animationText.destroy();
    }

    this.turnCounter++;
    console.log(this.turnCounter);

    this.battleUI.displayStats(this.player, this.enemy, this.playerStartHP, this.enemyStartHP, this.turnCounter);
    this.battleUI.renderMenu(this.currentMenu, this.currentSelection);

    this.checkRoundOutcome();
  }

  async switchScene() {
    await new Promise(resolve => this.time.delayedCall(3000, resolve));
    this.scene.start('RewardScene', { player: this.player, seed: this.seed });
    this.inputLocked = false;
  }

  async checkRoundOutcome() {
    if (this.enemy.health <= 0) {
      this.add.text(960, 640, 'You win!', { fontSize: '64px', fill: '#fff' }).setOrigin(0.5);
      this.player.level++;
      this.levelData.completed = true;

      this.turnCounter = 0;
      this.player.score += 100; // example: add 100 points for defeating an enemy
      console.log(`Player score: ${this.player.score}`);

      const highestScore = parseInt(getCookie('highestScore')) || 0;
      if (this.player.score > highestScore) {
        setCookie('highestScore', this.player.score, 365); // Save the new high score for 1 year
        console.log(`New highest score: ${this.player.score}`);
      }

      await this.switchScene();

      return;
    }

    if (this.player.health <= 0) {
      this.add.text(960, 540, 'You lose!', { fontSize: '64px', fill: '#fff' }).setOrigin(0.5);
      this.scene.pause();
    }
    this.inputLocked = false;
  }

  getEnemy() {
    const rng = seedrandom(this.seed);
    const random = rng();
    this.enemy = this.levelData.enemies[Math.floor(random * this.levelData.enemies.length)];
  }
}
export default BattleScene;