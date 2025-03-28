import './style.css';
import Phaser from 'phaser';
import BattleScene from './scenes/BattleScene';
import MapScene from './scenes/MapScene';

const gameWidth = 800;
const gameHeight = 600;

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
  scene: [MapScene, BattleScene]
}

const game = new Phaser.Game(config)