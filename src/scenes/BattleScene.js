import seedrandom from 'seedrandom';

class BattleScene extends Phaser.Scene {
  constructor() {
    super('BattleScene');
  }

  // Array of rendered elements (healthbar, text, etc..), used for removing elements before rerendering
  renderedElements = [];
  playerStartHP = 0;
  enemyStartHP = 0;

  preload() {
    // Load assets (images, sounds, etc.)
    this.load.image('background', 'src/assets/images/bg.png');
    this.load.image('player', 'src/assets/images/warrior-prototyp1.png');
    this.load.image('battleUi', 'src/assets/images/fight-ui-prototyp1.png');
    this.load.image('goblin', 'src/assets/images/goblin-prototyp1.png');
  }

  addMenuItem(x, y, text) {
    return this.add.text(x, y, text, { fontSize: '52px' })
  }

  calculateHealthBarSize(maxUnitHealth, currentUnitHealth) {
    const MAX_WIDTH = 500;
    const clampedHealth = Phaser.Math.Clamp(currentUnitHealth, 0, maxUnitHealth);
    let width = (clampedHealth / maxUnitHealth) * MAX_WIDTH;

    return { width, height: 50 };
  }

  displayHealthBarBorder(x, y, width, height) {
    const borderSize = 4;
    this.add.rectangle(
      x - borderSize / 2, 
      y - borderSize / 2, 
      width + borderSize, 
      height + borderSize, 
      Phaser.Display.Color.GetColor32(0, 0, 0, 255)
    ).setOrigin(0);
  }

  displayStats() {
    const COLOR_CODES = {
      GREEN: Phaser.Display.Color.GetColor32(0, 255, 0, 255),
      RED: Phaser.Display.Color.GetColor32(255, 0, 0, 255),
      WHITE: Phaser.Display.Color.GetColor32(255, 255, 255, 255),
      BLACK: Phaser.Display.Color.GetColor32(0, 0, 0, 255)
    }

    // Remove previous renders so it doesn't overlap
    this.renderedElements.forEach(render => render.destroy());

    const borderSize = 4;

    // Player health bar
    const playerHealthBarSize = this.calculateHealthBarSize(this.playerStartHP, this.player.health);
    this.displayHealthBarBorder(400, 200, 500, 50);
    this.renderedElements.push(this.add.rectangle(400, 200, playerHealthBarSize.width, playerHealthBarSize.height, COLOR_CODES.GREEN).setOrigin(0));
    this.renderedElements.push(this.add.text(400, 100, `Class: ${this.player.class.name}`, { fontSize: '52px' }));
    this.renderedElements.push(this.add.text(400, 150, `Level: ${this.player.level}`, { fontSize: '52px' }));
    this.renderedElements.push(this.add.text(400, 200, `${this.player.name}: ${Math.max(0, this.player.health)} HP`, { fontSize: '52px' }));

    // Enemy health bar
    const enemyHealthBarSize = this.calculateHealthBarSize(this.enemyStartHP, this.enemy.health);
    this.displayHealthBarBorder(1220, 200, 500, 50);
    this.renderedElements.push(this.add.rectangle(1220, 200, enemyHealthBarSize.width, enemyHealthBarSize.height, COLOR_CODES.RED).setOrigin(0));
    this.renderedElements.push(this.add.text(1220, 200, `${this.enemy.name}: ${Math.max(0, this.enemy.health)} HP`, { fontSize: '52px' }));
  }

  async executeTurn(action) {
    this.inputLocked = true;

    if (action === 'attack') {
      await this.executeAttack(this.player, this.enemy);
    } else if (action === 'cast') {
      await this.executeSpell(this.player, this.player.spells[0], this.enemy); // currently hardcoded to always use the first spell
    }

    if (this.enemy.health > 0) {
      // ai for opponent
      // currently hardcoded to always use the first spell *currently not used*
      // const firstSpell = Object.values(this.enemy.weapon.castable)[0];
      await this.executeAttack(this.enemy, this.player);
    }

    this.checkRoundOutcome();
  }

  executeAttack(attacker, target) {
    return new Promise((resolve) => {

      const animationText = this.add.text(700, 500, `${attacker.name} attacks...`, { fontSize: '52px', fill: '#fff'});

      this.time.delayedCall(1000, () => {
        animationText.destroy();
        target.health -= attacker.weapon.attack;
        console.log(`${attacker.name} attacks ${target.name} with ${attacker.weapon.name} for ${attacker.weapon.attack} damage.`);
        this.displayStats();
        resolve();
      });
    });
  }

  executeSpell(attacker, spell, target){
    return new Promise((resolve) => {
      const animationText = this.add.text(700, 500, `${attacker.name} casts ${spell.name}...`, { fontSize: '52px', fill: '#fff'});

      this.time.delayedCall(1000, () => {
        animationText.destroy();
        target.health -= spell.damage(attacker.stats);
        console.log(`${attacker.name} casts ${spell.name} on ${target.name} for ${spell.damage(attacker.stats)} damage.`);
        this.displayStats();
        resolve();
      });
    }); 
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

  create(data) {
    this.player = data.player;
    this.levelData = data.level;
    this.seed = data.seed;

    this.playerStartHP = this.player.health;

    console.log(`Player initialized with class: ${this.player.class.name}`);
    console.log(`Player stats:`, this.player.class.stats);
    console.log('Player spells:', this.player.spells);

    this.getEnemy();
    this.enemyStartHP = this.enemy.health;

    this.turnOrder = [this.player, this.enemy];
    this.totalTurns = 0;
    this.currentTurn = this.totalTurns % 2;

    this.cursors = this.input.keyboard.createCursorKeys(); // lägger till arrow keys
    this.enterKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.ENTER); // lägger till enter key

    this.add.image(960, 540, 'background').setAlpha(0.1);
    this.add.image(960, 540, 'battleUi');
    this.add.image(480, 540, 'player').setScale(0.4);
    this.add.image(1440, 540, 'goblin');
    this.hitAnimation;

    // menyn representeras av en 2d array
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
      { x: 1, y: 0, text: this.player.spells.length === 0 ? "None" : this.player.spells[0].name },
      { x: 0, y: 1, text: this.player.spells.length === 0 ? "None" : this.player.spells[0].name },
      { x: 1, y: 1, text: 'Back' },
    ];

    this.playerStats = [
      { x: 0, y: 0, text: `Strength: ${ this.player.stats.strength }` },
      { x: 0, y: 1, text: `Agility: ${ this.player.stats.agility }`},
      { x: 0, y: 2, text: `Intelligence: ${ this.player.stats.intelligence }` },
      { x: 0, y: 3, text: `Intelligence: ${ this.player.stats.intelligence }` },
    ];

    this.currentMenu = this.mainMenu; // startar på main menyn
    this.currentSelection = { x: 0, y: 0 }; // default
    this.renderMenu(this.currentMenu);
    this.renderPlayerStats();
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

  renderPlayerStats() {
    this.playerStats.map(item => {
      const xPosition = 1100 + item.x * 200; // horisontell spacing
      const yPosition = 820 + item.y * 50; // vertikal spacing
      const text = this.add.text(xPosition, yPosition, item.text, { fontSize: '24px', fill: '#fff' }).setOrigin(0.5);
    })
    this.add.rectangle(1250, 800, 400, 200, Phaser.Display.Color.GetColor32(79, 52, 41, 255)).setOrigin(0);
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

    if (selectedItem) {
      // Handle menu item actions here
      if (selectedItem.text == 'Attack') {
        console.log('Attack selected!');
        this.executeTurn('attack'); // attacks enemy
      }
      else if (selectedItem.text == 'Bag') {
        console.log('Bag selected!');
        this.switchMenu(this.bagMenu);
      }
      else if (selectedItem.text == 'Back') {
        console.log('Back selected!');
        this.switchMenu(this.mainMenu);
      }
      else if (selectedItem.text == 'Cast') {
        console.log('Cast selected!');
        this.switchMenu(this.castMenu);
      }
      else if (selectedItem.text == this.player.spells[0].name) {
        console.log(`Cast ${selectedItem.text} selected!`);
        this.executeTurn('cast'); // casts spell
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