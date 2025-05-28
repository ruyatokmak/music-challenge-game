/**
 * Utility functions for responsive design
 */

/**
 * Media query breakpoints
 */
export enum Breakpoint {
  MOBILE = 480,
  TABLET = 768,
  DESKTOP = 1024,
  LARGE_DESKTOP = 1280
}

/**
 * Checks if the current viewport matches a media query
 * @param query The media query to check
 * @returns True if the media query matches
 */
export function matchesMediaQuery(query: string): boolean {
  if (typeof window === 'undefined' || !window.matchMedia) {
    return false;
  }
  return window.matchMedia(query).matches;
}

/**
 * Checks if the current viewport is mobile size
 * @returns True if viewport width is less than or equal to mobile breakpoint
 */
export function isMobileView(): boolean {
  return matchesMediaQuery(`(max-width: ${Breakpoint.MOBILE}px)`);
}

/**
 * Checks if the current viewport is tablet size
 * @returns True if viewport width is less than or equal to tablet breakpoint
 */
export function isTabletView(): boolean {
  return matchesMediaQuery(`(max-width: ${Breakpoint.TABLET}px)`);
}

/**
 * Adds event listener for responsive design changes
 * @param breakpoint The breakpoint to listen for
 * @param callback The callback function to execute when breakpoint changes
 * @returns Cleanup function to remove the event listener
 */
export function onBreakpointChange(
  breakpoint: Breakpoint,
  callback: (matches: boolean) => void
): () => void {
  if (typeof window === 'undefined' || !window.matchMedia) {
    return () => {};
  }
  
  const mediaQuery = window.matchMedia(`(max-width: ${breakpoint}px)`);
  
  // Initial check
  callback(mediaQuery.matches);
  
  // Add listener for changes
  const listener = (event: MediaQueryListEvent) => {
    callback(event.matches);
  };
  
  // Modern browsers
  if (mediaQuery.addEventListener) {
    mediaQuery.addEventListener('change', listener);
    return () => mediaQuery.removeEventListener('change', listener);
  } 
  // Older browsers
  else if (mediaQuery.addListener) {
    mediaQuery.addListener(listener);
    return () => mediaQuery.removeListener(listener);
  }
  
  return () => {};
}
