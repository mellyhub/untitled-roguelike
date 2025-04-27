import Phaser from 'phaser';
import AssetLoader from '../utils/AssetLoader';

/**
 * BootScene - First scene to run that handles asset preloading
 * Centralized loading for all game assets to avoid loading in individual scenes
 */
class BootScene extends Phaser.Scene {
  constructor() {
    super('BootScene');
    this.loadingText = null;
    this.progressBar = null;
    this.progressBarContainer = null;
  }

  preload() {
    // Create loading UI
    this.createLoadingUI();
    
    // Start asset loading
    AssetLoader.preloadAssets(this);
    
    // Update progress bar
    this.load.on('progress', (value) => {
      this.progressBar.clear();
      this.progressBar.fillStyle(0xffffff, 1);
      this.progressBar.fillRect(0, 0, 700 * value, 30);
      
      const percent = Math.round(value * 100);
      this.loadingText.setText(`Loading: ${percent}%`);
    });
    
    // Handle loading errors
    this.load.on('loaderror', (file) => {
      console.error(`Error loading asset: ${file.key}`);
    });
  }
  
  create() {
    // Add a slight delay before starting the main menu
    this.time.delayedCall(500, () => {
      // Destroy loading UI
      if (this.progressBar) this.progressBar.destroy();
      if (this.progressBarContainer) this.progressBarContainer.destroy();
      if (this.loadingText) this.loadingText.destroy();
      
      // Transition to MainMenuScene
      this.scene.start('MainMenuScene');
    });
  }
  
  createLoadingUI() {
    const width = this.cameras.main.width;
    const height = this.cameras.main.height;
    
    // Create progress bar background
    this.progressBarContainer = this.add.graphics();
    this.progressBarContainer.fillStyle(0x222222, 0.8);
    this.progressBarContainer.fillRect((width - 700) / 2, (height - 30) / 2, 700, 30);
    
    // Create progress bar
    this.progressBar = this.add.graphics();
    this.progressBar.x = (width - 700) / 2;
    this.progressBar.y = (height - 30) / 2;
    
    // Add loading text
    this.loadingText = this.add.text(
      width / 2, 
      height / 2 - 50,
      'Loading: 0%',
      { fontSize: '32px', fill: '#ffffff' }
    ).setOrigin(0.5);
    
    // Add loading title
    this.add.text(
      width / 2,
      height / 2 - 100,
      'Untitled Roguelike',
      { fontSize: '64px', fill: '#ffffff', fontStyle: 'bold' }
    ).setOrigin(0.5);
  }
}

export default BootScene; 