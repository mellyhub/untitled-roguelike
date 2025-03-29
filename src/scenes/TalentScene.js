class TalentScene extends Phaser.Scene {
    constructor() {
      super('TalentScene');
    }
  
    preload() {
      // Load assets (images, sounds, etc.)

    }
  
    create() {
        // lägger till keyboard inputs
        this.cursors = this.input.keyboard.createCursorKeys();

        // "N" byter mellan kartan och TalentScene
        this.input.keyboard.on('keydown-N', () => {
            this.scene.switch('MapScene');
        });

        this.add.text(960, 540, 'Talent Scene', { fontSize: '64px', fill: '#fff' }).setOrigin(0.5);
    }
  
    update() {

    }
  }
  export default TalentScene;