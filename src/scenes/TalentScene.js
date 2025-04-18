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

    // Initialize talents in the player object
    this.player.talents = {};
    Object.entries(talentConfig).forEach(([treeName, talents]) => {
      this.player.talents[treeName] = talents.map(talent => ({
        ...talent,
        value: 0 // Initialize all talents with 0 points
      }));
    });

    // lägger till keyboard inputs
    this.cursors = this.input.keyboard.createCursorKeys();
    this.enterKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.ENTER);

    // "N" byter mellan kartan och TalentScene
    this.input.keyboard.on('keydown-N', () => {
      this.scene.switch('MapScene');
    });
    this.input.keyboard.on('keydown-ESC', () => {
      this.scene.switch('MapScene');
    });

    this.currentTree = "magic"; // default to first tree
    this.currentSelection = 0;

    // Create a tooltip for displaying talent information
    this.tooltip = this.add.text(0, 0, '', {
      fontSize: '20px',
      fill: '#fff',
      backgroundColor: '#000',
      padding: { x: 10, y: 5 },
      align: 'center',
    }).setOrigin(0.5).setDepth(10).setVisible(false);

    this.renderUI();
  }

  update() {
    // navigerar menyn med pilarna
    if (Phaser.Input.Keyboard.JustDown(this.cursors.up)) {
      this.changeSelection(0, -1);
    }
    else if (Phaser.Input.Keyboard.JustDown(this.cursors.down)) {
      this.changeSelection(0, 1);
    }
    else if (Phaser.Input.Keyboard.JustDown(this.cursors.left)) {
      this.changeSelection(-1, 0);
    }
    else if (Phaser.Input.Keyboard.JustDown(this.cursors.right)) {
      this.changeSelection(1, 0);
    }

    // allokerar poäng med enter
    if (Phaser.Input.Keyboard.JustDown(this.enterKey)) {
      this.allocatePoint();
    }
  }

  renderUI() {
    // rensar gamla ui elements
    if (this.uiElements) {
      this.uiElements.forEach(element => element.destroy());
    }

    // visa tillgängliga talent points
    this.uiElements = [];
    const talentPointsText = this.add.text(960, 50, `Talent Points: ${this.player.talentPoints}`, {
      fontSize: '48px',
      fill: '#fff',
    }).setOrigin(0.5);
    this.uiElements.push(talentPointsText);

    // define position for rendering
    const treePositions = {
      magic: { x: 180, y: 200 },
      physical: { x: 660, y: 200 },
      defense: { x: 1140, y: 200 },
      utility: { x: 1620, y: 200 }
    };

    // render each tree
    Object.entries(this.player.talents).forEach(([treeName, talents]) => {
      const { x, y } = treePositions[treeName];

      // display tree name
      const treeNameText = this.add.text(x, y - 50, treeName.toUpperCase(), {
        fontSize: '32px',
        fill: '#fff',
      }).setOrigin(0.5);
      this.uiElements.push(treeNameText);

      // render talents
      talents.forEach((talent, index) => {
        //const talentX = x + (index % 2) * 200; // two columns per tree
        //const talentY = y + Math.floor(index / 2) * 100; // rows for talents
        const talentX = x + (index % 1) * 200; // two columns per tree
        const talentY = y + Math.floor(index / 1) * 100; // rows for talents

        const talentText = this.add.text(talentX, talentY, `${talent.name}: ${talent.value}/${talent.maxPoints}`, {
          fontSize: '20px',
          fill: '#fff',
        }).setOrigin(0.5);

        // Highlight the currently selected talent
        if (treeName === this.currentTree && index === this.currentSelection) {
          talentText.setColor('#ff0000'); // Highlight in red
        }

        // Make the talent interactive
        talentText.setInteractive();

        // mouse hover
        talentText.on('pointerover', (pointer) => {
          this.tooltip.setText(`${talent.name}\n${talent.description}`)
            .setPosition(pointer.worldX, pointer.worldY - 20)
            .setVisible(true);
          talentText.setStyle({ fill: '#ffff00' }); // highlight in yellow on hover
        });
        talentText.on('pointerout', () => {
          this.tooltip.setVisible(false); // hide tooltip when not hovered
          talentText.setStyle({ fill: '#fff' }); // reset to white when not hovered
          if (treeName === this.currentTree && index === this.currentSelection) {
            talentText.setColor('#ff0000'); // keep red if selected
          }
        });

        // handle click to select and allocate points
        talentText.on('pointerdown', () => {
          this.currentTree = treeName;
          this.currentSelection = index;
          this.allocatePoint();
        });

        this.uiElements.push(talentText);
      });
    });
  }

  changeSelection(treeDirection, talentDirection) {
    // Update selected tree
    console.log(this.player.talents);
    const treeNames = Object.keys(this.player.talents);
    const currentTreeIndex = treeNames.indexOf(this.currentTree || treeNames[0]);
    const newTreeIndex = (currentTreeIndex + treeDirection + treeNames.length) % treeNames.length;
    this.currentTree = treeNames[newTreeIndex];
    console.log("Updated Tree:", this.currentTree);

    // Ensure the current tree is valid
    if (!this.player.talents[this.currentTree]) {
      console.error(`Invalid tree selected: ${this.currentTree}`);
      return;
    }

    // Update selected talent
    const talents = this.player.talents[this.currentTree];
    const newTalentIndex = (this.currentSelection + talentDirection + talents.length) % talents.length;
    this.currentSelection = newTalentIndex;

    this.renderUI();
  }

  allocatePoint() {
    // Check if there are available talent points
    if (this.player.talentPoints > 0) {
      // Ensure the current tree is valid
      if (!this.currentTree || !this.player.talents[this.currentTree]) {
        console.error(`Invalid current tree: ${this.currentTree}`);
        return;
      }

      const talents = this.player.talents[this.currentTree];
      const selectedTalent = talents[this.currentSelection];

      // Check if the talent has reached its maximum points
      if (selectedTalent.value >= selectedTalent.maxPoints) {
        console.log(`Cannot allocate more points to ${selectedTalent.name}. Maximum points reached.`);
        return;
      }

      // Increase the value of the selected talent
      selectedTalent.value += 1;

      // Apply the talent's effect
      if (selectedTalent.effect) {
        selectedTalent.effect(this.player);
      }

      // Trigger max effect if max points are reached
      if (selectedTalent.value === selectedTalent.maxPoints && selectedTalent.maxEffect) {
        selectedTalent.maxEffect(this.player);
      }

      // Spend one talent point
      this.player.talentPoints -= 1;

      // Re-render the UI to reflect the changes
      this.renderUI();
    }
    else {
      console.log('No talent points available!');
    }
  }
}
export default TalentScene;