/**
 * Performance Monitoring and Optimization Utilities
 */

/**
 * Measure function execution time
 * @param {Function} fn - Function to measure
 * @param {string} label - Label for logging
 * @returns {Function} - Wrapped function
 */
export const measurePerformance = (fn, label = 'Function') => {
  return async function measured(...args) {
    const startTime = performance.now();

    try {
      const result = await fn(...args);
      const duration = performance.now() - startTime;

      console.log(`⏱️ ${label} took ${duration.toFixed(2)}ms`);

      // Log slow operations (> 1 second)
      if (duration > 1000) {
        console.warn(`⚠️ Slow operation detected: ${label} (${duration.toFixed(2)}ms)`);
      }

      return result;
    } catch (error) {
      const duration = performance.now() - startTime;
      console.error(`❌ ${label} failed after ${duration.toFixed(2)}ms:`, error);
      throw error;
    }
  };
};

/**
 * Memoize expensive function calls
 * @param {Function} fn - Function to memoize
 * @param {Function} keyGenerator - Custom key generator
 * @returns {Function} - Memoized function
 */
export const memoize = (fn, keyGenerator = JSON.stringify) => {
  const cache = new Map();

  return function memoized(...args) {
    const key = keyGenerator(args);

    if (cache.has(key)) {
      console.log(`📦 Cache hit for: ${key.substring(0, 50)}...`);
      return cache.get(key);
    }

    const result = fn(...args);

    // Handle promises
    if (result instanceof Promise) {
      return result.then(value => {
        cache.set(key, value);
        return value;
      });
    }

    cache.set(key, result);
    return result;
  };
};

/**
 * Throttle function execution
 * @param {Function} fn - Function to throttle
 * @param {number} limit - Time limit in milliseconds
 * @returns {Function} - Throttled function
 */
export const throttle = (fn, limit = 1000) => {
  let inThrottle;

  return function throttled(...args) {
    if (!inThrottle) {
      fn.apply(this, args);
      inThrottle = true;

      setTimeout(() => {
        inThrottle = false;
      }, limit);
    }
  };
};

/**
 * Debounce function execution
 * @param {Function} fn - Function to debounce
 * @param {number} delay - Delay in milliseconds
 * @returns {Function} - Debounced function
 */
export const debounce = (fn, delay = 300) => {
  let timeoutId;

  return function debounced(...args) {
    clearTimeout(timeoutId);

    timeoutId = setTimeout(() => {
      fn.apply(this, args);
    }, delay);
  };
};

/**
 * Lazy load component or module
 * @param {Function} importFn - Dynamic import function
 * @param {Object} options - Loading options
 * @returns {Promise} - Loaded module
 */
export const lazyLoad = async (importFn, options = {}) => {
  const { minDelay = 0, timeout = 30000 } = options;

  const promises = [importFn()];

  // Add minimum delay if specified
  if (minDelay > 0) {
    promises.push(new Promise(resolve => setTimeout(resolve, minDelay)));
  }

  // Add timeout
  const timeoutPromise = new Promise((_, reject) =>
    setTimeout(() => reject(new Error('Lazy load timeout')), timeout)
  );

  try {
    const [module] = await Promise.race([
      Promise.all(promises),
      timeoutPromise
    ]);

    return module;
  } catch (error) {
    console.error('Lazy load failed:', error);
    throw error;
  }
};

/**
 * Track component render performance
 */
export class RenderTracker {
  constructor(componentName) {
    this.componentName = componentName;
    this.renderCount = 0;
    this.totalTime = 0;
    this.startTime = null;
  }

  start() {
    this.startTime = performance.now();
  }

  end() {
    if (this.startTime) {
      const duration = performance.now() - this.startTime;
      this.renderCount++;
      this.totalTime += duration;

      console.log(
        `🎨 ${this.componentName} render #${this.renderCount}: ${duration.toFixed(2)}ms ` +
        `(avg: ${(this.totalTime / this.renderCount).toFixed(2)}ms)`
      );

      this.startTime = null;
    }
  }

  reset() {
    this.renderCount = 0;
    this.totalTime = 0;
    this.startTime = null;
  }

  getStats() {
    return {
      componentName: this.componentName,
      renderCount: this.renderCount,
      totalTime: this.totalTime,
      averageTime: this.renderCount > 0 ? this.totalTime / this.renderCount : 0
    };
  }
}

/**
 * Batch multiple state updates
 * @param {Array<Function>} updates - Array of state update functions
 */
export const batchUpdates = (updates) => {
  // In React 18+, updates are automatically batched
  // This is a utility for older versions or manual batching
  updates.forEach(update => update());
};

/**
 * Check if code is running in production
 * @returns {boolean} - True if production
 */
export const isProduction = () => {
  return import.meta.env.MODE === 'production';
};

/**
 * Log performance metrics
 * @param {string} metric - Metric name
 * @param {number} value - Metric value
 * @param {Object} metadata - Additional metadata
 */
export const logMetric = (metric, value, metadata = {}) => {
  if (!isProduction()) {
    console.log(`📊 Metric: ${metric}`, {
      value,
      ...metadata,
      timestamp: new Date().toISOString()
    });
  }

  // In production, send to analytics service
  // Example: analytics.track(metric, { value, ...metadata });
};

/**
 * Monitor memory usage
 * @returns {Object} - Memory usage info
 */
export const getMemoryUsage = () => {
  if (performance.memory) {
    return {
      usedJSHeapSize: (performance.memory.usedJSHeapSize / 1048576).toFixed(2) + ' MB',
      totalJSHeapSize: (performance.memory.totalJSHeapSize / 1048576).toFixed(2) + ' MB',
      jsHeapSizeLimit: (performance.memory.jsHeapSizeLimit / 1048576).toFixed(2) + ' MB'
    };
  }

  return { error: 'Memory API not available' };
};

/**
 * Get page load metrics
 * @returns {Object} - Page load timing info
 */
export const getPageLoadMetrics = () => {
  if (performance.timing) {
    const timing = performance.timing;

    return {
      domLoading: timing.domLoading - timing.navigationStart,
      domInteractive: timing.domInteractive - timing.navigationStart,
      domComplete: timing.domComplete - timing.navigationStart,
      loadComplete: timing.loadEventEnd - timing.navigationStart
    };
  }

  return { error: 'Performance timing API not available' };
};

export default {
  measurePerformance,
  memoize,
  throttle,
  debounce,
  lazyLoad,
  RenderTracker,
  batchUpdates,
  isProduction,
  logMetric,
  getMemoryUsage,
  getPageLoadMetrics
};
