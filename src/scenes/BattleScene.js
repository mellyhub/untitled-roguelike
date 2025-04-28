import seedrandom from 'seedrandom';
import BattleUI from '../utils/BattleUI.js';
import { setCookie, getCookie } from '../utils/cookieUtils.js';
import { get_random_enemy } from '../data/enemies.js';

class BattleScene extends Phaser.Scene {
  constructor() {
    super('BattleScene');
    
    // Bind methods to ensure correct 'this' context
    this.displayDamageText = this.displayDamageText.bind(this);
    this.executeTurn = this.executeTurn.bind(this);
    this.checkRoundOutcome = this.checkRoundOutcome.bind(this);
    this.switchScene = this.switchScene.bind(this);
    this.updatePerfStats = this.updatePerfStats.bind(this);
  }

  preload() {
    // Assets already loaded in BootScene
  }

  create(data) {
    this.player = data.player;
    this.seed = data.seed;

    this.playerAnimation;
    this.playerStartHP = this.player.getMaxHealth();

    const EnemyClass = get_random_enemy(this.seed);
    this.enemy = EnemyClass.createEnemy();
    this.enemyStartHP = this.enemy.getHealth();

    this.turnCounter = 0;
    this.currentTurn = this.turnCounter % 2;

    // Setup input
    this.cursors = this.input.keyboard.createCursorKeys();
    this.enterKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.ENTER);

    // Setup sound effects
    this.sfx = {};
    const sfxConfig = this.cache.json.get('sfxConfig');
    for (const [key, path] of Object.entries(sfxConfig)) {
      this.sfx[key] = this.sound.add(key, { volume: 0.2 });
    }

    // Add background
    this.add.image(960, 540, 'ice-cave-background');

    // Add player animations
    this.player.animations.createAnimations(this);
    this.player.animations.playIdleAnimation();

    // Add enemy animations
    this.enemy.animations.createAnimations(this);
    this.enemy.animations.playIdleAnimation();

    // Play the enemy's battle cry
    if (this.sfx[this.enemy.battleCry]) {
      this.sfx[this.enemy.battleCry].play();
    }

    // Initialize battle UI
    this.battleUI = new BattleUI(this, this.sfx);
    
    // Store a reference to avoid any context issues
    const battleUI = this.battleUI;

    this.mainMenu = [
      { x: 0, y: 0, text: 'Attack' },
      { x: 1, y: 0, text: 'Cast' },
      { x: 0, y: 1, text: 'Bag' },
      { x: 1, y: 1, text: 'Stats' },
    ];

    this.hitAnimation;

    // Render initial stats and menu
    this.currentMenu = this.mainMenu;
    this.currentSelection = { x: 0, y: 0 };
    
    // Use the stable reference for displayStats
    battleUI.displayStats(this.player, this.enemy, this.playerStartHP, this.enemyStartHP, this.turnCounter);
    battleUI.renderMenu(this.currentMenu, this.currentSelection);
    
    // Setup performance monitoring
    this.perfText = this.add.text(10, 200, '', { fontSize: '26px', fill: '#ffffff' })
      .setScrollFactor(0)
      .setDepth(1000);
      
    // Monitor FPS only in development mode
    if (process.env.NODE_ENV !== 'production') {
      this.perfTimer = this.time.addEvent({
        delay: 500,
        callback: this.updatePerfStats,
        callbackScope: this,
        loop: true
      });
    }
  }

  update() {
    if (this.inputLocked) {
      return; // ignore inputs
    }

    // Create a stable reference to battleUI 
    const battleUI = this.battleUI;
    
    if (Phaser.Input.Keyboard.JustDown(this.cursors.up)) {
      battleUI.changeSelection(0, -1); // Move up
    }
    else if (Phaser.Input.Keyboard.JustDown(this.cursors.down)) {
      battleUI.changeSelection(0, 1); // Move down
    }
    else if (Phaser.Input.Keyboard.JustDown(this.cursors.left)) {
      battleUI.changeSelection(-1, 0); // Move left
    }
    else if (Phaser.Input.Keyboard.JustDown(this.cursors.right)) {
      battleUI.changeSelection(1, 0); // Move right
    }

    if (Phaser.Input.Keyboard.JustDown(this.enterKey)) {
      const selectedItem = battleUI.getSelectedItem();

      if (battleUI.currentMenuType === 'main' && selectedItem.text === 'Cast') {
        // opens spell menu
        battleUI.renderSpellMenu(
          this.player
        );
      }
      else if (battleUI.currentMenuType === 'main' && selectedItem.text === 'Bag') {
        // opens bag menu
        battleUI.renderBagMenu(
          this.player
        );
      }
      else if (battleUI.currentMenuType === 'main' && selectedItem.text === 'Stats') {
        // opens stats menu
        battleUI.renderStatsMenu(
          this.player
        );
      }
      else {
        // handle other menu actions
        battleUI.selectMenuItem(
          this.player,
          this.executeTurn.bind(this),
          battleUI.switchMenu.bind(battleUI),
          this.bagMenu,
          this.mainMenu
        );
      }
    }
  }

  // Resolve a promise after some time, used to implement delay
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

  // Simple damage text display
  displayDamageText(target, damage, isCritical = false) {
    const x = target.animations.properties.idleAnimPos.x;
    const y = target.animations.properties.idleAnimPos.y;
    
    // Create text with style based on whether it's a critical hit
    const style = isCritical 
      ? { fontSize: '72px', fill: '#ff0000', fontStyle: 'bold' } 
      : { fontSize: '60px', fill: '#ffffff' };
      
    const damageText = this.add.text(x, y, `${damage}`, style).setOrigin(0.5);
    
    // Simple animation: float up and fade out
    this.tweens.add({
      targets: damageText,
      y: y - 100,
      alpha: 0,
      ease: 'Power1',
      duration: 2000,
      onComplete: () => {
        damageText.destroy();
      }
    });
  }

  async executeTurn(action, selectedSpell) {
    this.inputLocked = true;

    const animationText = this.displayAnimationText(this.player.getName(), action, selectedSpell);

    try {
      // Store a reference to battleUI to prevent it from being lost in async operations
      const battleUI = this.battleUI;
      
      if (!this.player || !this.player.effectsHandler) {
        console.error("Player or player.effectsHandler is undefined");
        return;
      }
      
      try {
        this.player.effectsHandler.processActiveEffects();
      }
      catch (error) {
        console.error("Error processing player active effects:", error);
      }
      
      if (action === 'attack') {
        this.player.animations.playAttackAnimation();
        await this.resolveAfterTime(1000);
        
        try {
          this.player.effectsHandler.applyPermanentEffects();
        }
        catch (error) {
          console.error("Error applying player permanent effects before attack:", error);
        }
        
        let damage = 0;
        try {
          damage = this.player.attemptAction("attack", this.enemy, null, this);
        }
        catch (error) {
          console.error("Error in player attack action:", error);
        }
        
        // Apply effects after attack only if there's a valid enemy and damage was dealt
        if (damage > 0 && this.enemy && this.player.effectsHandler) {
          try {
            this.player.effectsHandler.applyPermanentEffects(this.enemy, damage, battleUI);
          }
          catch (error) {
            console.error("Error applying player permanent effects after attack:", error);
          }
        }
      }
      else if (action === 'cast') {
        this.player.animations.playCastAnimation(selectedSpell);
        await this.resolveAfterTime(1000);
        
        try {
          this.player.effectsHandler.applyPermanentEffects();
        }
        catch (error) {
          console.error("Error applying player permanent effects before cast:", error);
        }
        
        let damage = 0;
        try {
          damage = this.player.attemptAction("cast", this.enemy, selectedSpell, this);
        }
        catch (error) {
          console.error("Error in player cast action:", error);
        }
        
        // Apply effects after cast only if there's a valid enemy and damage was dealt
        if (damage > 0 && this.enemy && this.player.effectsHandler) {
          try {
            this.player.effectsHandler.applyPermanentEffects(this.enemy, damage, battleUI);
          }
          catch (error) {
            console.error("Error applying player permanent effects after cast:", error);
          }
        }
      }

      if (animationText) {
        animationText.destroy();
      }

      battleUI.displayStats(this.player, this.enemy, this.playerStartHP, this.enemyStartHP, this.turnCounter);

      // Check for win/loss condition before enemy turn
      if (await this.checkRoundOutcome()) {
        return;
      }

      // Enemy turn
      this.turnCounter++;
      this.currentTurn = this.turnCounter % 2;

      // Give the player a moment to see the enemy's turn begin
      await this.resolveAfterTime(1000);
      
      if (!this.enemy || !this.enemy.effectsHandler) {
        console.error("Enemy or enemy.effectsHandler is undefined");
        return;
      }
      
      try {
        this.enemy.effectsHandler.processActiveEffects();
      }
      catch (error) {
        console.error("Error processing enemy active effects:", error);
      }
      
      if (this.enemy.effectsHandler.isImpaired()) {
        const impairedText = this.add.text(700, 500, `${this.enemy.getName()} is impaired and cannot act!`, { fontSize: '52px', fill: '#fff' });
        await this.resolveAfterTime(2000);
        impairedText.destroy();
      }
      else {
        const enemyAction = "attack";
        const enemyAnimationText = this.displayAnimationText(this.enemy.getName(), enemyAction);

        this.enemy.animations.playAttackAnimation();
        await this.resolveAfterTime(1000);
        
        if (this.enemy.effectsHandler.applyPermanentEffects) {
          try {
            this.enemy.effectsHandler.applyPermanentEffects();
          }
          catch (error) {
            console.error("Error applying enemy permanent effects:", error);
          }
        }
        
        let enemyDamage = 0;
        try {
          enemyDamage = this.enemy.attemptAction("attack", this.player, null, this);
        }
        catch (error) {
          console.error("Error in enemy attack action:", error);
        }
        
        // Make sure player and enemy still exist before applying damage effects
        if (enemyDamage > 0 && this.enemy && this.player && this.player.effectsHandler) {
          try {
            this.player.effectsHandler.applyOnDamageEffects(this.enemy, enemyDamage);
          }
          catch (error) {
            console.error("Error applying player on-damage effects:", error);
          }
        }

        if (enemyAnimationText) {
          enemyAnimationText.destroy();
        }
      }

      battleUI.displayStats(this.player, this.enemy, this.playerStartHP, this.enemyStartHP, this.turnCounter);

      // Check for win/loss condition after enemy turn
      if (await this.checkRoundOutcome()) {
        return;
      }

      this.turnCounter++;
      this.currentTurn = this.turnCounter % 2;
      this.inputLocked = false;
    } catch (error) {
      console.error("Error in executeTurn:", error);
      // Make sure input isn't permanently locked if there's an error
      this.inputLocked = false;
    }
  }

  async switchScene() {
    // Clear all active effects on the player when combat ends
    if (this.player.effectsHandler) {
      this.player.effectsHandler.removeAllActiveEffects();
    }
    
    if (this.enemy.getHealth() <= 0) {
      if (this.player.effectsHandler) {
        this.player.effectsHandler.applyOnKillEffects();
      }
      
      this.player.setScore(this.player.getScore() + 10);
      
      // Update high score in cookies
      const highestScore = getCookie('highestScore') || 0;
      if (this.player.getScore() > highestScore) {
        setCookie('highestScore', this.player.getScore());
      }
      
      // Transition to reward scene
      this.scene.start('RewardScene', { player: this.player, seed: this.seed });
    }
    else {
      // Game over, return to main menu
      this.scene.start('MainMenuScene');
    }
  }

  async checkRoundOutcome() {
    // Store reference to battleUI
    const battleUI = this.battleUI;
    
    if (this.enemy.getHealth() <= 0 || this.player.getHealth() <= 0) {
      // Check if Rebirth should trigger
      if (this.player.getHealth() <= 0) {

        this.player.effectsHandler.applyPermanentEffects();
        
        if (this.player.getHealth() > 0) {
          const rebirthText = this.add.text(700, 500, `${this.player.getName()} has been revived!`, { fontSize: '52px', fill: '#fff' });
          await this.resolveAfterTime(2000);
          rebirthText.destroy();
          
          battleUI.displayStats(this.player, this.enemy, this.playerStartHP, this.enemyStartHP, this.turnCounter);
          this.inputLocked = false;
          return false;
        }
      }
      
      // Update stats one more time before transition
      try {
        battleUI.displayStats(this.player, this.enemy, this.playerStartHP, this.enemyStartHP, this.turnCounter);
      } catch (error) {
        console.error("Error updating final stats:", error);
      }

      await this.resolveAfterTime(2000);
      this.inputLocked = false;
      this.switchScene();
      return true;
    }
    return false;
  }
  
  updatePerfStats() {
    // Get current FPS
    const fps = Math.round(this.game.loop.actualFps);
    this.perfText.setText(`FPS: ${fps}`);
  }
  
  // Cleanup when scene is shutdown
  shutdown() {
    if (this.perfTimer) {
      this.perfTimer.remove();
    }
    
    // Explicitly clean up BattleUI before scene shutdown
    if (this.battleUI) {
      try {
        this.battleUI.destroy();
        this.battleUI = null;  // Remove reference to prevent further use
      } catch (error) {
        console.error("Error cleaning up BattleUI:", error);
      }
    }
    
    // Cleanup any other resources
    if (this.input && this.input.keyboard) {
      this.input.keyboard.shutdown();
    }
  }
}

export default BattleScene;