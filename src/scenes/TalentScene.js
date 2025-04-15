import talentConfig from '../data/talents.js';

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

    this.talents = [];
    let talentIndex = 0;
    this.talentRows = 5;
    this.talentColumns = 5;

    for (let i = 0; i < this.talentRows; i++) {
      const row = [];
      for (let j = 0; j < this.talentColumns; j++) {
        const talent = talentConfig[talentIndex] || { name: `T ${talentIndex + 1}`, description: null, effect: null };
        row.push({
          x: i,
          y: j,
          name: talent.name,
          value: 0,
          description: talent.description,
          effect: talent.effect
        });
        talentIndex++;
      }
      this.talents.push(row);
    }

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
    const descriptionText = this.add.text(1100, 600, this.talents[this.currentSelection.x][this.currentSelection.y].description, {
      fontSize: '32px',
      fill: '#fff',
    }).setOrigin(0, 5);
    this.uiElements.push(talentPointsText);
    this.uiElements.push(descriptionText);

    for (let i = 0; i < this.talentRows; i++) {
      for (let j = 0; j < this.talentColumns; j++) {
        const talent = this.talents[i][j];
        const maxPoints = talentConfig.find(t => t.name === talent.name)?.maxPoints || 0;
        const talentText = this.add.text(100 + i * 200, 300 + j * 100, `${talent.name}: ${talent.value}/${maxPoints}`, {
          fontSize: '32px',
          fill: '#fff',
        }).setOrigin(0.5);

        if (i === this.currentSelection.x && j === this.currentSelection.y) {
          talentText.setColor('#ff0000');
        }

        this.uiElements.push(talentText);
      }
    }
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
      x: (this.currentSelection.x + xDirection + this.talentRows) % this.talentRows,
      y: (this.currentSelection.y + yDirection + this.talentColumns) % this.talentColumns,
    };

    // uppdaterar ui för att visa nya valet
    this.renderUI();
  }

  allocatePoint(currentSelection) {
    // kolla ifall det finns tillgängliga poäng
    if (this.player.talentPoints > 0) {
      const selectedTalent = this.talents[currentSelection.x][currentSelection.y]

      // check if talents has reached max value
      if (selectedTalent.value >= talentConfig.find(t => t.name === selectedTalent.name).maxPoints) {
        console.log(`Cannot allocate more points to ${selectedTalent.name}. Maximum points reached.`);
        return;
      }

      // ökar värde på valt attribut
      selectedTalent.value += 1;
      if (selectedTalent.effect) {
        selectedTalent.effect(this.player);
      }
    }

    // spenderar en talent point
    if (this.player.talentPoints > 0) {
      this.player.talentPoints -= 1;
    }
    else {
      console.log("No available talent points left!")
    }

    console.log(this.player);
    // rendrar ui på nytt för att uppdatera ändringarna
    this.renderUI();
  }
}
export default TalentScene;