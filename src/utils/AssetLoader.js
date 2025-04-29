/**
 * AssetLoader - Centralizes asset loading and management for improved performance
 * Handles preloading assets for all scenes and manages texture atlases
 */
class AssetLoader {
  constructor() {
    this.assetsLoaded = false;
  }

  /**
   * Preload all assets at game startup
   * @param {Phaser.Scene} scene - The scene to use for loading assets
   */
  preloadAssets(scene) {
    scene.load.json("sfxConfig", "src/assets/audio/sfx/sfx.json");
    
    scene.load.once('filecomplete-json-sfxConfig', () => {
      const sfxConfig = scene.cache.json.get('sfxConfig');
      this.loadAudio(scene, sfxConfig);
    });
    
    // Load assets.json
    scene.load.json('assetsConfig', 'src/assets/assets.json');
    
    // When assets.json is loaded, load all the assets defined in it
    scene.load.once('filecomplete-json-assetsConfig', () => {
      const assets = scene.cache.json.get('assetsConfig');
      this.loadAllAssets(scene, assets);
    });
    
    // Set flag when loading is complete
    scene.load.on('complete', () => {
      this.assetsLoaded = true;
    });
  }
  
  /**
   * Load all assets defined in the assets configuration
   * @param {Phaser.Scene} scene - The scene to use for loading
   * @param {Array} assets - Asset configuration array
   */
  loadAllAssets(scene, assets) {
    // Process each asset group
    assets.forEach(assetGroup => {
      assetGroup.assets.forEach(asset => {
        const assetPath = `${assetGroup.path}/${asset.url}`;
        
        // Load images and optimize them using texture atlases where possible
        if (asset.type === 'image') {
          scene.load.image(asset.key, assetPath);
        }
        
        // Load sprite sheets with optimized configuration
        if (asset.type === 'sheet') {
          scene.load.spritesheet(asset.key, assetPath, {
            frameWidth: asset.frameWidth,
            frameHeight: asset.frameHeight,
            spacing: asset.spacing || 0, // Add spacing if defined
            margin: asset.margin || 0    // Add margin if defined
          });
        }
        
        // Add texture atlas support
        if (asset.type === 'atlas') {
          scene.load.atlas(asset.key, assetPath, `${assetGroup.path}/${asset.atlasURL}`);
        }
      });
    });
  }
  
  /**
   * Load audio assets
   * @param {Phaser.Scene} scene - The scene to use for loading
   * @param {Object} sfxConfig - Sound effect configuration
   */
  loadAudio(scene, sfxConfig) {
    // Verify the config is loaded
    if (!sfxConfig) {
      console.error('SFX configuration not found in cache');
      return;
    }

    // Load each audio file
    for (const [key, path] of Object.entries(sfxConfig)) {
      try {
        console.log(`Loading audio: ${key} from ${path}`);
        
        // Add error handling for the audio load
        scene.load.once(`filecomplete-audio-${key}`, () => {
          console.log(`Successfully loaded audio: ${key}`);
        });
        
        scene.load.once(`loaderror-audio-${key}`, (file) => {
          console.error(`Error loading audio ${key}:`, file);
        });
        
        // Load MP3 files with specific settings
        scene.load.audio(key, path, {
          instances: 1,
          xhrSettings: {
            responseType: 'arraybuffer'
          },
          audioType: 'audio/mpeg' // Specify MP3 type
        });
      } catch (error) {
        console.error(`Error setting up audio load for ${key}:`, error);
      }
    }
  }
  
  /**
   * Check if all assets have been loaded
   * @returns {boolean} True if assets are loaded
   */
  isLoaded() {
    return this.assetsLoaded;
  }
}

// Export singleton instance
export default new AssetLoader(); 