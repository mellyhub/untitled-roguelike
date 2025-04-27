import './style.css';
import Phaser from 'phaser';
import BattleScene from './scenes/BattleScene';
import MapScene from './scenes/MapScene';
import TalentScene from './scenes/TalentScene';
import MainMenuScene from './scenes/MainMenuScene';
import RewardScene from './scenes/RewardScene';
import MerchantScene from './scenes/MerchantScene';
import BootScene from './scenes/BootScene';

const gameWidth = 1920;
const gameHeight = 1080;

const config = {
  type: Phaser.WEBGL,
  width: gameWidth,
  height: gameHeight,
  canvas: gameCanvas,
  physics: {
    default: 'arcade',
    arcade: {
        gravity: { y: 0 },
        debug: false // Set to false in production
    }
  },
  scale: {
    mode: Phaser.Scale.FIT,
    //autoCenter: Phaser.Scale.CENTER_BOTH
  },
  
  // Add BootScene as the first scene to load assets
  scene: [BootScene, MainMenuScene, MapScene, BattleScene, TalentScene, RewardScene, MerchantScene],
  
  // Enable texture compression for WebGL
  renderer: {
    powerPreference: 'high-performance',
    antialias: false, // Disable antialiasing for better performance
    pixelArt: true,   // Enable pixel art mode for better scaling
    roundPixels: true // Round pixel positions to avoid blurring
  },
  
  // Optimize asset loading by enabling audio and image batching
  loader: {
    maxParallelDownloads: 32
  },
  
  // Add FPS display in development
  fps: {
    min: 30,
    target: 60
  }
}

const game = new Phaser.Game(config);