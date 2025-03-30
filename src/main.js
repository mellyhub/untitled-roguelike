import './style.css';
import Phaser from 'phaser';
import BattleScene from './scenes/BattleScene';
import MapScene from './scenes/MapScene';
import TalentScene from './scenes/TalentScene';
import MainMenuScene from './scenes/MainMenuScene';

const gameWidth = 1920;
const gameHeight = 1080;

const config = {
  type:Phaser.WEBGL,
  width: gameWidth,
  height: gameHeight,
  canvas:gameCanvas,
  physics: {
    default: 'arcade',
    arcade: {
        gravity: { y: 0 },
        debug: true
    }
},
  scale: {
    mode: Phaser.Scale.FIT,
    //autoCenter: Phaser.Scale.CENTER_BOTH
  },

  // scenen som defineras först är den som laddas först
  scene: [MainMenuScene, MapScene, BattleScene, TalentScene]
}

const game = new Phaser.Game(config)