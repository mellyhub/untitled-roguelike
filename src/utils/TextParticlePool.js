import ObjectPool from './ObjectPool';

/**
 * TextParticlePool - Special pool for damage text and other text effects
 * Extends the basic ObjectPool with specific methods for text creation and animation
 */
class TextParticlePool {
  /**
   * Create a new TextParticlePool
   * @param {Phaser.Scene} scene - The scene this pool belongs to
   * @param {Object} style - The default text style
   */
  constructor(scene, style = { fontSize: '32px', fill: '#ffffff' }) {
    this.scene = scene;
    this.defaultStyle = style;
    
    // Create the object pool with appropriate functions
    this.pool = new ObjectPool(
      // Create function
      () => {
        const text = scene.add.text(0, 0, '', this.defaultStyle);
        text.setActive(false).setVisible(false);
        return text;
      },
      // Reset function
      (text) => {
        text.setActive(true).setVisible(true);
      },
      // Initial size
      20
    );
    
    // Automatically clean up when scene shuts down
    scene.events.on('shutdown', this.destroy, this);
  }
  
  /**
   * Create a floating damage text
   * @param {number} x - X position
   * @param {number} y - Y position
   * @param {string|number} content - The text to display
   * @param {Object} style - Optional style overrides
   * @param {Object} animation - Animation parameters
   * @returns {Phaser.GameObjects.Text} The text object
   */
  createFloatingText(x, y, content, style = {}, animation = {}) {
    // Get text object from pool
    const text = this.pool.get();
    
    // Configure the text
    text.setText(String(content));
    text.setPosition(x, y);
    text.setOrigin(0.5);
    
    // Apply custom style if provided
    if (Object.keys(style).length > 0) {
      text.setStyle({ ...this.defaultStyle, ...style });
    }
    
    // Set up animation defaults
    const anim = {
      y: y - 50,
      alpha: 0,
      duration: 1500,
      ease: 'Power1',
      ...animation
    };
    
    // Animate the text
    this.scene.tweens.add({
      targets: text,
      y: anim.y,
      alpha: anim.alpha,
      duration: anim.duration,
      ease: anim.ease,
      onComplete: () => {
        // Return to pool when animation completes
        text.setActive(false).setVisible(false);
        this.pool.release(text);
      }
    });
    
    return text;
  }
  
  /**
   * Create damage text with pre-defined styling
   * @param {number} x - X position
   * @param {number} y - Y position
   * @param {number} damage - Damage amount
   * @param {boolean} isCritical - Whether this is a critical hit
   * @returns {Phaser.GameObjects.Text} The text object
   */
  createDamageText(x, y, damage, isCritical = false) {
    const style = isCritical 
      ? { fontSize: '48px', fill: '#ff0000', fontStyle: 'bold' }
      : { fontSize: '32px', fill: '#ffffff' };
      
    return this.createFloatingText(x, y, damage, style);
  }
  
  /**
   * Clean up resources
   */
  destroy() {
    // Release all text objects
    this.pool.releaseAll();
    
    // Remove scene event listener
    this.scene.events.off('shutdown', this.destroy, this);
  }
}

export default TextParticlePool; 