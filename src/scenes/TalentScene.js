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

    this.talents = [];
    this.talentRows = 5;
    this.talentColumns = 5;
    for (let i = 0; i < this.talentRows; i++) {
      for (let j = 0; j < this.talentColumns; j++) {
        this.talents.push({
          x: i,
          y: j,
          name: `T ${i * this.talentColumns + j + 1}`,
          value: 0,
        });
      }
    }
    console.log(this.talents);

    this.currentSelection = { x: 0, y: 0 };

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

    var talentText;

    for (let i = 0; i < this.talentRows; i++) {
      for (let j = 0; j < this.talentColumns; j++) {
        talentText = this.add.text(100 + j * 200, 300 + i * 100, `${this.talents[i * this.talentColumns + j].name}: ${this.talents[i * this.talentColumns + j].value}`, {
          fontSize: '32px',
          fill: '#fff',
        }).setOrigin(0.5);

        this.uiElements.push(talentText);
      }
    }

    if (this.talents.x === this.currentSelection.x && this.talents.y === this.currentSelection.y) {
      talentText.setColor('#ff0000');
    }
    this.uiElements.push(talentText);
  }

  update() {
    // navigerar menyn med pilarna
    if (Phaser.Input.Keyboard.JustDown(this.cursors.up)) {
      this.changeSelection(0, -1);
      console.log(this.currentSelection);
    }
    else if (Phaser.Input.Keyboard.JustDown(this.cursors.down)) {
      this.changeSelection(0, 1);
      console.log(this.currentSelection);
      console.log(this.talents[0][0].y);
    }
    else if (Phaser.Input.Keyboard.JustDown(this.cursors.left)) {
      this.changeSelection(-1, 0);
      console.log(this.currentSelection);
    }
    else if (Phaser.Input.Keyboard.JustDown(this.cursors.right)) {
      this.changeSelection(1, 0);
      console.log(this.currentSelection);
    }

    // allokerar poäng med enter
    if (Phaser.Input.Keyboard.JustDown(this.enterKey)) {
      this.allocatePoint(this.currentSelection);
    }
  }

  changeSelection(xDirection, yDirection) {
    // uppdaterar vald selection
    this.currentSelection = {
      x: (this.currentSelection.x + xDirection + this.talentColumns) % this.talentColumns,
      y: (this.currentSelection.y + yDirection + this.talentRows) % this.talentRows,
    };

    // uppdaterar ui för att visa nya valet
    this.renderUI();
  }

  allocatePoint(currentSelection) {
    // kolla ifall det finns tillgängliga poäng
    if (this.player.talentPoints > 0) {
      // ökar värde på valt attribut
      this.talents[currentSelection.x][currentSelection.y].value += 1;

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