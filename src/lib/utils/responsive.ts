
export enum Breakpoint {
  MOBILE = 480,
  TABLET = 768,
  DESKTOP = 1024,
  LARGE_DESKTOP = 1280
}


 @param query 
 @returns 

export function matchesMediaQuery(query: string): boolean {
  if (typeof window === 'undefined' || !window.matchMedia) {
    return false;
  }
  return window.matchMedia(query).matches;
}


@returns

export function isMobileView(): boolean {
  return matchesMediaQuery(`(max-width: ${Breakpoint.MOBILE}px)`);
}


@returns 

export function isTabletView(): boolean {
  return matchesMediaQuery(`(max-width: ${Breakpoint.TABLET}px)`);
}


@param breakpoint 
@param callback 
@returns 

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
