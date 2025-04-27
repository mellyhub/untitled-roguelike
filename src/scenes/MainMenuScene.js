import classes from "../data/classes";
import { getCookie } from "../utils/cookieUtils.js";

class MainMenuScene extends Phaser.Scene {
  constructor() {
    super('MainMenuScene');
  }

  preload() {
    // Load assets (images, sounds, etc.)
    this.load.image('background-img', 'src/assets/images/backgrounds/main-menu.png');
  }

  create() {
    this.cursors = this.input.keyboard.createCursorKeys();
    this.enterKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.ENTER);

    //const music = this.sound.add("background", { loop: true, volume: 0.1 });
    this.add.image(960, 540, 'background-img').setScale(1);


    const highestScore = getCookie('highestScore') || 0; // get highscore
    this.add.text(960, 300, `Highest Score: ${highestScore}`, { fontSize: '32px', fill: '#fff' }).setOrigin(0.5);

    this.add.text(960, 400, 'Choose Class', { fontSize: '64px', fill: '#fff' }).setOrigin(0.5);

    // konverterar classes till en array för att lättare hantera logik
    this.classArray = Object.values(classes);

    // genererar dynamiskt de olika klassvalen
    this.menuItems = this.classArray.map((classData, index) => {
      const yPosition = 500 + index * 100; // dynamisk positionering av texten
      const text = this.add.text(960, yPosition, classData.name, { fontSize: '48px', fill: '#fff' }).setOrigin(0.5);
      if (index == 0) {
        text.setColor('#ff0000'); // highlightar första valet som default
      }
      
      // Add mouse interactivity
      text.setInteractive({ useHandCursor: true })
        .on('pointerover', () => {
          if (this.currentSelection !== index) {
            text.setColor('#ffff00'); // Yellow hover color
          }
        })
        .on('pointerout', () => {
          if (this.currentSelection === index) {
            text.setColor('#ff0000'); // Selected color
          } else {
            text.setColor('#ffffff'); // Default color
          }
        })
        .on('pointerdown', () => {
          // Update selection
          this.menuItems[this.currentSelection].setColor('#fff');
          this.currentSelection = index;
          text.setColor('#ff0000');
          this.updateDescription();
          
          // Double-click detection (select on double click)
          if (text.lastClickTime && (this.time.now - text.lastClickTime < 300)) {
            this.selectClass();
          }
          text.lastClickTime = this.time.now;
        });
      
      return text;
    });

    this.currentSelection = 0;

    this.descriptionText = this.add.text(960, 800, '', { fontSize: '32px', fill: '#fff', wordWrap: { width: 800 } }).setOrigin(0.5);
    this.updateDescription();
    
    // Add Play button for mouse users
    const playButton = this.add.text(960, 900, 'PLAY', { 
      fontSize: '56px', 
      fill: '#fff',
      backgroundColor: '#4a1',
      padding: { x: 20, y: 10 }
    }).setOrigin(0.5).setInteractive({ useHandCursor: true });
    
    // Add hover and click effects
    playButton
      .on('pointerover', () => {
        playButton.setStyle({ fill: '#ff0' });
      })
      .on('pointerout', () => {
        playButton.setStyle({ fill: '#fff' });
      })
      .on('pointerdown', () => {
        playButton.setStyle({ fill: '#f80' });
      })
      .on('pointerup', () => {
        playButton.setStyle({ fill: '#ff0' });
        this.selectClass();
      });
  }

  update() {
    if (Phaser.Input.Keyboard.JustDown(this.cursors.up)) {
      this.changeSelection(-1);
    } else if (Phaser.Input.Keyboard.JustDown(this.cursors.down)) {
      this.changeSelection(1);
    }

    if (Phaser.Input.Keyboard.JustDown(this.enterKey)) {
      this.selectClass();
    }
  }

  changeSelection(direction) {
    // reset färg
    this.menuItems[this.currentSelection].setColor('#fff');

    // uppdaterar vald index
    this.currentSelection = (this.currentSelection + direction + this.menuItems.length) % this.menuItems.length;

    // highlightar nya select
    this.menuItems[this.currentSelection].setColor('#ff0000');

    // uppdaterar class beskrivningen
    this.updateDescription();
  }

  updateDescription() {
    // hämtar classen som är selectad
    const selectedClass = this.classArray[this.currentSelection];
    this.descriptionText.setText(`${selectedClass.description}`);
  }

  selectClass() {
    // hämtar classen som är selectad
    const selectedClass = this.classArray[this.currentSelection];
    console.log(`Selected class: ${selectedClass.name}`);
    
    //const classes = [Warrior, Mage, Rogue];
    //const PlayerClass = classes[this.currentSelection];
    //this.player = new PlayerClass();
    this.player = classes.warrior.createClass();

    // setting the seed for the run
    const seed = String(Date.now());
    console.log(`Seed: ${seed}`);

    this.scene.start('MapScene', { player: this.player, seed: this.seed });
  }
}

export default MainMenuScene;