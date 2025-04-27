/**
 * ObjectPool - Manages reusable game objects to reduce garbage collection
 * Useful for frequently created and destroyed objects like particle effects,
 * projectiles, damage numbers, etc.
 */
class ObjectPool {
  /**
   * Create a new object pool
   * @param {Function} createFunc - Function to create a new object
   * @param {Function} resetFunc - Function to reset an object for reuse
   * @param {number} initialSize - Initial pool size
   */
  constructor(createFunc, resetFunc, initialSize = 20) {
    this.createFunc = createFunc;
    this.resetFunc = resetFunc;
    this.pool = [];
    this.active = new Set();
    
    // Pre-populate the pool
    this.populate(initialSize);
  }
  
  /**
   * Create initial objects for the pool
   * @param {number} size - Number of objects to create
   */
  populate(size) {
    for (let i = 0; i < size; i++) {
      const obj = this.createFunc();
      obj.active = false;
      this.pool.push(obj);
    }
  }
  
  /**
   * Get an object from the pool
   * @returns {Object} An object from the pool
   */
  get() {
    // First try to reuse an inactive object
    for (let i = 0; i < this.pool.length; i++) {
      if (!this.pool[i].active) {
        this.pool[i].active = true;
        this.resetFunc(this.pool[i]);
        this.active.add(this.pool[i]);
        return this.pool[i];
      }
    }
    
    // If no inactive objects are available, create a new one
    const newObj = this.createFunc();
    newObj.active = true;
    this.pool.push(newObj);
    this.active.add(newObj);
    
    return newObj;
  }
  
  /**
   * Return an object to the pool
   * @param {Object} obj - The object to return to the pool
   */
  release(obj) {
    if (obj && this.active.has(obj)) {
      obj.active = false;
      this.active.delete(obj);
    }
  }
  
  /**
   * Release all active objects
   */
  releaseAll() {
    this.active.forEach(obj => {
      obj.active = false;
    });
    this.active.clear();
  }
  
  /**
   * Get the count of active objects
   * @returns {number} The number of active objects
   */
  getActiveCount() {
    return this.active.size;
  }
  
  /**
   * Get the total size of the pool
   * @returns {number} The total number of objects in the pool
   */
  getSize() {
    return this.pool.length;
  }
}

export default ObjectPool; 