import seedrandom from 'seedrandom';
import BattleUI from './BattleUI';
import { executeAttack, executeSpell, processActiveEffects } from './DamageCalc';

class BattleScene extends Phaser.Scene {
  constructor() {
    super('BattleScene');
  }

  preload() {
    // Load assets (images, sounds, etc.)
    this.load.image('background', 'src/assets/images/backgrounds/bg.png');
    this.load.image('player', 'src/assets/images/player-model/warrior-prototyp1.png');
    this.load.image('Goblin', 'src/assets/images/enemy-sprites/goblin-prototyp1.png');
    this.load.image('Jens', 'src/assets/images/enemy-sprites/jens.jpg');
    this.load.image('Snowman', 'src/assets/images/enemy-sprites/snowman.png');
    this.load.image('Megadraken', 'src/assets/images/enemy-sprites/night-glider.png');
    this.load.image('battleUi', 'src/assets/images/ui/fight-ui-prototyp1.png');

  }

  create(data) {
    this.player = data.player;
    this.levelData = data.level;
    this.seed = data.seed;

    this.playerStartHP = this.player.health;

    this.getEnemy();
    this.enemyStartHP = this.enemy.health;

    this.turnOrder = [this.player, this.enemy];
    this.totalTurns = 0;
    this.currentTurn = this.totalTurns % 2;

    this.cursors = this.input.keyboard.createCursorKeys(); // lägger till arrow keys
    this.enterKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.ENTER); // lägger till enter key

    this.add.image(960, 540, 'background').setAlpha(0.1);
    this.add.image(480, 540, 'player').setScale(0.4);
    this.add.image(1440, 540, this.enemy.name).setScale(0.7);
    this.add.image(960, 540, 'battleUi');

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


    // hårdkodat deluxe
    this.castMenu = [
      { x: 0, y: 0, text: this.player.spells.length === 0 ? "None" : this.player.spells[0].name },
      { x: 1, y: 0, text: this.player.spells.length === 0 ? "None" : this.player.spells[1].name },
      { x: 0, y: 1, text: this.player.spells.length === 0 ? "None" : this.player.spells[2].name },
      { x: 1, y: 1, text: 'Back' },
    ];

    this.hitAnimation;

    // render initial stats and menu
    this.currentMenu = this.mainMenu;
    this.currentSelection = { x: 0, y: 0 };
    this.battleUI.renderMenu(this.currentMenu, this.currentSelection);
    this.battleUI.displayStats(this.player, this.enemy, this.playerStartHP, this.enemyStartHP);
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
          this.castMenu,
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
  renderedElements = [];
  playerStartHP = 0;
  enemyStartHP = 0;

  async executeTurn(action, selectedSpell = null) {
    this.inputLocked = true;
    processActiveEffects(this.player);

    if (action === 'attack') {
      await executeAttack(this, this.player, this.enemy);
    }
    else if (action === 'cast') {
      if (selectedSpell) {
        await executeSpell(this, this.player, selectedSpell, this.enemy);
      }
      else {
        console.warn('No spell selected!');
      }
    }

    if (this.enemy.health > 0) {
      processActiveEffects(this, this.enemy);

      // ai for opponent
      if(this.enemy.name === 'Megadraken') {
        await executeSpell(this, this.enemy, this.enemy.spells[0], this.player);
      }
      else {
        await executeAttack(this, this.enemy, this.player);
      }
    }

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

      this.player.score += 100; // example: add 100 points for defeating an enemy
      console.log(`Player score: ${this.player.score}`);

      await this.switchScene();

      return;
    }

    if (this.player.health <= 0) {
      this.add.text(960, 540, 'You lose!', { fontSize: '64px', fill: '#fff' }).setOrigin(0.5);
      this.scene.pause();
    }
    this.totalTurns++;
    this.inputLocked = false;
  }

  getEnemy() {
    const rng = seedrandom(this.seed);
    const random = rng();
    this.enemy = this.levelData.enemies[Math.floor(random * this.levelData.enemies.length)];
  }
}
export default BattleScene;