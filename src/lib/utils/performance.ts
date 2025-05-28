/**
 * Performance optimization utilities
 */

/**
 * Debounce function to limit how often a function can be called
 * @param fn The function to debounce
 * @param delay The delay in milliseconds
 * @returns A debounced version of the function
 */
export function debounce<T extends (...args: any[]) => any>(
  fn: T,
  delay: number
): (...args: Parameters<T>) => void {
  let timeoutId: ReturnType<typeof setTimeout> | undefined;
  
  return function(this: any, ...args: Parameters<T>): void {
    const context = this;
    
    if (timeoutId) {
      clearTimeout(timeoutId);
    }
    
    timeoutId = setTimeout(() => {
      fn.apply(context, args);
      timeoutId = undefined;
    }, delay);
  };
}

/**
 * Throttle function to limit how often a function can be called
 * @param fn The function to throttle
 * @param limit The time limit in milliseconds
 * @returns A throttled version of the function
 */
export function throttle<T extends (...args: any[]) => any>(
  fn: T,
  limit: number
): (...args: Parameters<T>) => void {
  let inThrottle = false;
  let lastArgs: Parameters<T> | null = null;
  let lastContext: any = null;
  
  return function(this: any, ...args: Parameters<T>): void {
    const context = this;
    
    if (!inThrottle) {
      fn.apply(context, args);
      inThrottle = true;
      
      setTimeout(() => {
        inThrottle = false;
        
        if (lastArgs) {
          fn.apply(lastContext, lastArgs);
          lastArgs = null;
          lastContext = null;
        }
      }, limit);
    } else {
      lastArgs = args;
      lastContext = context;
    }
  };
}

/**
 * Memoize function to cache results of expensive function calls
 * @param fn The function to memoize
 * @returns A memoized version of the function
 */
export function memoize<T extends (...args: any[]) => any>(
  fn: T
): (...args: Parameters<T>) => ReturnType<T> {
  const cache = new Map<string, ReturnType<T>>();
  
  return function(this: any, ...args: Parameters<T>): ReturnType<T> {
    const key = JSON.stringify(args);
    
    if (cache.has(key)) {
      return cache.get(key) as ReturnType<T>;
    }
    
    const result = fn.apply(this, args);
    cache.set(key, result);
    return result;
  };
}

/**
 * Lazy loads an image
 * @param imageUrl The URL of the image to load
 * @param onLoad Callback function when the image is loaded
 * @param onError Callback function when the image fails to load
 */
export function lazyLoadImage(
  imageUrl: string,
  onLoad?: () => void,
  onError?: (error: Error) => void
): void {
  if (typeof window === 'undefined') {
    return;
  }
  
  const img = new Image();
  
  if (onLoad) {
    img.onload = onLoad;
  }
  
  if (onError) {
    img.onerror = () => onError(new Error(`Failed to load image: ${imageUrl}`));
  }
  
  img.src = imageUrl;
}

/**
 * Checks if the browser supports the Intersection Observer API
 * @returns True if the browser supports Intersection Observer
 */
export function supportsIntersectionObserver(): boolean {
  return typeof window !== 'undefined' && 'IntersectionObserver' in window;
}
