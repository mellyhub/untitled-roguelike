import seedrandom from 'seedrandom';
import BattleUI from '../utils/BattleUI.js';
import assets from '../assets/assets.json'; // Import the assets.json file
import { setCookie, getCookie } from '../utils/cookieUtils.js';
import { get_random_enemy } from '../data/enemies.js';
import { Snowman } from '../data/enemies/Snowman.js';
import { PipeSlime } from '../data/enemies/PipeSlime.js';

class BattleScene extends Phaser.Scene {
  constructor() {
    super('BattleScene');
  }

  preload() {
    // iterate through assets
    assets.forEach(assetGroup => {
      assetGroup.assets.forEach(asset => {
        const assetPath = `${assetGroup.path}/${asset.url}`;

        if (asset.type === 'image') {
          const assetPath = `${assetGroup.path}/${asset.url}`;
          // dynamically loads image asset
          this.load.image(asset.key, assetPath);
        }

        if (asset.type === 'sheet') {
          this.load.spritesheet(asset.key, assetPath, {
            frameWidth: asset.frameWidth,
            frameHeight: asset.frameHeight,
          });
        }
      });

      this.load.json("sfxConfig", "src/assets/audio/sfx/sfx.json");
      this.load.on('filecomplete-json-sfxConfig', () => {
        const sfxConfig = this.cache.json.get('sfxConfig');
        for (const [key, path] of Object.entries(sfxConfig)) {
          this.load.audio(key, path);
        }
      });
    });
  }

  create(data) {
    this.player = data.player;
    this.levelData = data.level;
    this.seed = data.seed;

    // reset rebirth effect at start of combat
    const rebirthEffect = this.player.permanentEffects.find(effect => effect.name === "Rebirth");
    if (rebirthEffect && rebirthEffect.removeEffect) {
        rebirthEffect.removeEffect();
    }

    this.playerAnimation;

    this.playerStartHP = this.player.maxHealth;

    //const EnemyClass = get_random_enemy(this.seed);
    const EnemyClass = PipeSlime;
    this.enemy = new EnemyClass(this.player.level);
    this.enemyStartHP = this.enemy.health;

    this.turnCounter = 0;
    this.currentTurn = this.turnCounter % 2;

    this.cursors = this.input.keyboard.createCursorKeys(); // lägger till arrow keys
    this.enterKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.ENTER); // lägger till enter key

    console.log(this.enemy);

    const sfxConfig = this.cache.json.get('sfxConfig'); // Get the loaded SFX configuration
    this.sfx = {};
    for (const [key, path] of Object.entries(sfxConfig)) {
      this.sfx[key] = this.sound.add(key, { volume: 0.2 });
    }

    this.add.image(960, 540, 'ice-cave-background');

    // Add player animations
    this.player.animations.createAnimations(this);
    this.player.animations.playIdleAnimation();

    // Add enemy image or animation
    if (this.enemy.image) {
      this.add.image(this.enemy.imageXPos, this.enemy.imageYPos, this.enemy.image).setScale(this.enemy.imageScale);
    } else {
      let enemyAnimation = this.createEnemyAnimation();
      enemyAnimation.play(this.enemy.animationKey);
    }

    // play the enemy's battle cry
    if (this.sfx[this.enemy.battleCry]) {
      this.sfx[this.enemy.battleCry].play();
    }

    // initialize battle ui
    this.battleUI = new BattleUI(this, this.sfx);

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

  createEnemyAnimation() {
    this.anims.create({
      key: this.enemy.animationKey,
      frames: this.anims.generateFrameNumbers(this.enemy.animationSheetName),
      frameRate: this.enemy.animationFrameRate,
      repeat: -1,
    });

    return this.add.sprite(this.enemy.imageXPos, this.enemy.imageYPos, this.enemy.animationSheetName).setScale(this.enemy.imageScale);
  }

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
    this.player.processActiveEffects();

    if (action === 'attack') {
      this.player.animations.playAttackAnimation();
      const damage = this.player.attack(this.enemy);
      this.battleUI.displayDamageText('enemy', damage);
    }
    else if (action === 'cast') {
      if (selectedSpell) {
        this.player.animations.playCastAnimation(selectedSpell);
        const damage = this.player.cast(this.enemy, selectedSpell);
        if (damage) {
          this.battleUI.displayDamageText('enemy', damage);
        }
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
      this.enemy.processActiveEffects();
      const damage = this.enemy.attack(this.player);
      this.battleUI.displayDamageText('player', damage);
      const animationText = this.displayAnimationText(this.enemy.name, "attack", selectedSpell);
      await this.resolveAfterTime(1000);
      animationText.destroy();
    }

    this.turnCounter++;

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
      this.player.increaseLevel(1);
      this.player.increaseTalentPoints(1);

      this.player.removeAllActiveEffects();
      console.log("All active effects have been removed");

      this.turnCounter = 0;
      this.player.score += 100; // example: add 100 points for defeating an enemy
      console.log(`Player score: ${this.player.score}`);

      const highestScore = parseInt(getCookie('highestScore')) || 0;
      if (this.player.score > highestScore) {
        setCookie('highestScore', this.player.score, 365); // Save the new high score for 1 year
        (`New highest score: ${this.player.score}`);
      }

      await this.switchScene();

      return;
    }

    if (this.player.health <= 0) {

      // check for rebirth talent
      const rebirthEffect = this.player.permanentEffects.find(effect => effect.name === "Rebirth");
      if (rebirthEffect && !rebirthEffect.hasRevived) {
          rebirthEffect.applyEffect(this.player); // trigger revive
          this.battleUI.displayStats(this.player, this.enemy, this.playerStartHP, this.enemyStartHP, this.turnCounter);
          
          // this causes a bug that makes the menu not render after revived
          return this.checkRoundOutcome();
      }

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