
 Debounce function 
 @param fn 
 @param delay 
 @returns
   
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


 Throttle 
 @param fn 
 @param limit 
 @returns 

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


 @param fn 
 @returns 
   
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


 @param imageUrl 
 @param onLoad 
 @param onError 

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


 @returns

export function supportsIntersectionObserver(): boolean {
  return typeof window !== 'undefined' && 'IntersectionObserver' in window;
}
