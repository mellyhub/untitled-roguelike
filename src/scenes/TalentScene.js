class TalentScene extends Phaser.Scene {
  constructor() {
    super('TalentScene');
  }

  preload() {
    // Load assets (images, sounds, etc.)

  }

  create(data) {
    this.player = data.player;

    // lägger till keyboard inputs
    this.cursors = this.input.keyboard.createCursorKeys();
    this.enterKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.ENTER);

    // "N" byter mellan kartan och TalentScene
    this.input.keyboard.on('keydown-N', () => {
      this.scene.switch('MapScene');
    });

    // behöver hitta en mer dynamisk lösning på hur vi interagerar med spelare objektet
  
    this.attributes = [
      { name: 'Talent1', value: 0 },
      { name: 'Talent2', value: 0 },
      { name: 'Talent3', value: 0 },
    ];

    this.currentSelection = 0;

    this.renderUI();
  }

  renderUI() {
    // rensar gamla ui elements
    if (this.uiElements) {
      this.uiElements.forEach(element => element.destroy());
    }

    // visa tillgängliga talent points
    this.uiElements = [];
    const talentPointsText = this.add.text(960, 200, `Talent Points: ${this.player.talentPoints}`, {
      fontSize: '48px',
      fill: '#fff',
    }).setOrigin(0.5);
    this.uiElements.push(talentPointsText);

    // visa attribut
    this.attributes.forEach((attribute, index) => {
      const yPosition = 300 + index * 100;
      const text = this.add.text(960, yPosition, `${attribute.name}: ${attribute.value}`, {
        fontSize: '48px',
        fill: '#fff',
      }).setOrigin(0.5);

      // highlightar alternativet med röd färg
      if (index === this.currentSelection) {
        text.setColor('#ff0000');
      }

      this.uiElements.push(text);
    });
  }

  update() {
    // navigerar menyn med pilarna
    if (Phaser.Input.Keyboard.JustDown(this.cursors.up) || Phaser.Input.Keyboard.JustDown(this.cursors.left)) {
      this.changeSelection(-1);
    }
    else if (Phaser.Input.Keyboard.JustDown(this.cursors.down) || Phaser.Input.Keyboard.JustDown(this.cursors.right)) {
      this.changeSelection(1);
    }

    // allokerar poäng med enter
    if (Phaser.Input.Keyboard.JustDown(this.enterKey)) {
      this.allocatePoint();
    }
  }

  changeSelection(direction) {
    // uppdaterar vald selection
    this.currentSelection = (this.currentSelection + direction + this.attributes.length) % this.attributes.length;

    // uppdaterar ui för att visa nya valet
    this.renderUI();
  }

  allocatePoint() {
    // kolla ifall det finns tillgängliga poäng
    if (this.player.talentPoints > 0) {
      // ökar värde på valt attribut
      this.attributes[this.currentSelection].value += 1;

      // spenderar en talent point
      this.player.talentPoints -= 1;

      // rendrar ui på nytt för att uppdatera ändringarna
      this.renderUI();
    }
    else {
      console.log('No talent points available!');
    }
  }
}
export default TalentScene;