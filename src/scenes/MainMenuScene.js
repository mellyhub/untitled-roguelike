import classes from "../data/classes";
import player from "../data/player";

class MainMenuScene extends Phaser.Scene {
  constructor() {
    super('MainMenuScene');
  }

  preload() {
    // Load assets (images, sounds, etc.)
    this.load.audio("background", "src/assets/audio/soundtest.mp3");
  }

  create() {
    this.player = player;
    this.cursors = this.input.keyboard.createCursorKeys();
    this.enterKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.ENTER);

    const music = this.sound.add("background", { loop: true, volume: 0.1 });
    music.play();

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
      return text;
    });

    this.currentSelection = 0;

    this.descriptionText = this.add.text(960, 700, '', { fontSize: '32px', fill: '#fff', wordWrap: { width: 800 } }).setOrigin(0.5);
    this.updateDescription();
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
    this.player.class = selectedClass;
    this.player.stats = selectedClass.stats;

    // setting the seed for the run
    const seed = String(Date.now());
    console.log(`Seed: ${seed}`);

    this.scene.start('MapScene', { player: this.player, seed: this.seed });
  }
}

export default MainMenuScene;