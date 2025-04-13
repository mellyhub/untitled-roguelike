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
    this.talentRows = 5;
    this.talentColumns = 5;

    for (let i = 0; i < this.talentRows; i++) {
      const row = [];
      for (let j = 0; j < this.talentColumns; j++) {
        row.push({
          x: i,
          y: j,
          name: `T ${i * this.talentColumns + j + 1}`,
          value: 0,
          description: null,
        });
      }
      this.talents.push(row);
    }
    this.talents[0][0] = {
      x: 0,
      y: 0,
      name: "Max HP",
      value: 0,
      description: "Increases player's max HP by 10 per point."
    },
      this.talents[1][0] = {
        x: 1,
        y: 0,
        name: "Energy",
        value: 0,
        description: "Gain 5 energy when attacking."
      }
    console.log(this.talents);

    this.currentSelection = { x: 0, y: 0 };

    this.renderUI();
  }

  renderUI() {
    // rensar gamla ui elements
    if (this.uiElements) {
      this.uiElements.forEach(element => {
        if (element) {
          element.destroy();
        }
      });
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

    let talentText;
    for (let i = 0; i < this.talentRows; i++) {
      for (let j = 0; j < this.talentColumns; j++) {
        const talent = this.talents[i][j];
        const talentText = this.add.text(100 + i * 200, 300 + j * 100, `${talent.name}: ${talent.value}`, {
          fontSize: '32px',
          fill: '#fff',
        }).setOrigin(0.5);

        if (i === this.currentSelection.x && j === this.currentSelection.y) {
          talentText.setColor('#ff0000');
        }

        this.uiElements.push(talentText);
      }
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
      // ökar värde på valt attribut
      selectedTalent.value += 1;
      if (selectedTalent.name === "Max HP") {
        this.player.maxHealth += 10;
        console.log(`Player's max HP increased to ${this.player.maxHealth}`);
      }
      else if (selectedTalent.name === "Energy on Attack") {
        if (!this.player.permanentEffects.some(effect => effect.name === "Energy on Attack")) {
            this.player.permanentEffects.push({
                name: "Energy on Attack",
                applyEffect: (player) => {
                    player.energy = Math.min(player.energy + 5, 100); // cap energy at 100
                    console.log(`${player.name} gains 5 energy from "Energy on Attack". Current energy: ${player.energy}`);
                }
            });
        }
      }
    }

    // spenderar en talent point
    this.player.talentPoints -= 1;
    console.log(this.player);
    // rendrar ui på nytt för att uppdatera ändringarna
    this.renderUI();
  }
}
export default TalentScene;