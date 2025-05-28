
import type { ThemeMode } from '$lib/types';

// Local storage key for theme preference
const THEME_STORAGE_KEY = 'music-challenge-theme';

@param theme 

export function setTheme(theme: ThemeMode): void {
  if (typeof window === 'undefined' || !window.document) {
    return;
  }
  
  // Save theme preference to local storage
  localStorage.setItem(THEME_STORAGE_KEY, theme);
  
  // Apply theme to document
  if (theme === 'system') {
    const systemTheme = getSystemTheme();
    applyThemeToDocument(systemTheme);
  } else {
    applyThemeToDocument(theme);
  }
}


 @returns The current theme preference

export function getTheme(): ThemeMode {
  if (typeof window === 'undefined' || !window.localStorage) {
    return 'light';
  }
  
  const savedTheme = localStorage.getItem(THEME_STORAGE_KEY) as ThemeMode | null;
  return savedTheme || 'system';
}


 @returns 

export function getSystemTheme(): 'light' | 'dark' {
  if (typeof window === 'undefined' || !window.matchMedia) {
    return 'light';
  }
  
  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
}

 @param theme 

function applyThemeToDocument(theme: 'light' | 'dark'): void {
  if (typeof document === 'undefined') {
    return;
  }
  
  const root = document.documentElement;
  
  if (theme === 'dark') {
    root.classList.add('dark-theme');
    root.classList.remove('light-theme');
  } else {
    root.classList.add('light-theme');
    root.classList.remove('dark-theme');
  }
}


export function initializeTheme(): void {
  const theme = getTheme();
  setTheme(theme);
  
  // Listen for system theme changes if using system theme
  if (theme === 'system' && typeof window !== 'undefined' && window.matchMedia) {
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    
    const handleChange = (): void => {
      const systemTheme = getSystemTheme();
      applyThemeToDocument(systemTheme);
    };
    
    // Modern browsers
    if (mediaQuery.addEventListener) {
      mediaQuery.addEventListener('change', handleChange);
    } 
    // Older browsers
    else if (mediaQuery.addListener) {
      mediaQuery.addListener(handleChange);
    }
  }
}
