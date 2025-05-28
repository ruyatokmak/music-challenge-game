/**
 * Utility functions for accessibility
 */

/**
 * Focus trap for modal dialogs
 * @param containerElement The container element to trap focus within
 * @returns Cleanup function to remove the focus trap
 */
export function createFocusTrap(containerElement: HTMLElement): () => void {
  if (typeof document === 'undefined') {
    return () => {};
  }
  
  // Get all focusable elements
  const focusableElements = containerElement.querySelectorAll<HTMLElement>(
    'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
  );
  
  if (focusableElements.length === 0) {
    return () => {};
  }
  
  const firstElement = focusableElements[0];
  const lastElement = focusableElements[focusableElements.length - 1];
  
  // Focus the first element
  firstElement.focus();
  
  // Handle tab key to keep focus within the container
  const handleKeyDown = (event: KeyboardEvent): void => {
    if (event.key !== 'Tab') {
      return;
    }
    
    // Shift + Tab
    if (event.shiftKey) {
      if (document.activeElement === firstElement) {
        event.preventDefault();
        lastElement.focus();
      }
    } 
    // Tab
    else {
      if (document.activeElement === lastElement) {
        event.preventDefault();
        firstElement.focus();
      }
    }
  };
  
  // Add event listener
  document.addEventListener('keydown', handleKeyDown);
  
  // Return cleanup function
  return () => {
    document.removeEventListener('keydown', handleKeyDown);
  };
}

/**
 * Announces a message to screen readers
 * @param message The message to announce
 * @param priority Whether the message is a priority announcement
 */
export function announceToScreenReader(message: string, priority: boolean = false): void {
  if (typeof document === 'undefined') {
    return;
  }
  
  // Look for existing announcement element or create a new one
  let announcer = document.getElementById('screen-reader-announcer');
  
  if (!announcer) {
    announcer = document.createElement('div');
    announcer.id = 'screen-reader-announcer';
    announcer.setAttribute('aria-live', priority ? 'assertive' : 'polite');
    announcer.setAttribute('aria-atomic', 'true');
    announcer.style.position = 'absolute';
    announcer.style.width = '1px';
    announcer.style.height = '1px';
    announcer.style.padding = '0';
    announcer.style.overflow = 'hidden';
    announcer.style.clip = 'rect(0, 0, 0, 0)';
    announcer.style.whiteSpace = 'nowrap';
    announcer.style.border = '0';
    document.body.appendChild(announcer);
  }
  
  // Set the message
  announcer.textContent = message;
  
  // Clear the message after a delay
  setTimeout(() => {
    announcer.textContent = '';
  }, 3000);
}

/**
 * Adds keyboard navigation to a list of items
 * @param containerElement The container element with the list items
 * @param itemSelector The selector for the list items
 * @param onSelect Callback function when an item is selected
 * @returns Cleanup function to remove the keyboard navigation
 */
export function addKeyboardNavigation(
  containerElement: HTMLElement,
  itemSelector: string,
  onSelect: (element: HTMLElement) => void
): () => void {
  if (typeof document === 'undefined') {
    return () => {};
  }
  
  let currentIndex = -1;
  
  const handleKeyDown = (event: KeyboardEvent): void => {
    const items = Array.from(containerElement.querySelectorAll<HTMLElement>(itemSelector));
    
    if (items.length === 0) {
      return;
    }
    
    // Handle arrow keys
    if (event.key === 'ArrowDown' || event.key === 'ArrowRight') {
      event.preventDefault();
      currentIndex = (currentIndex + 1) % items.length;
      items[currentIndex].focus();
    } else if (event.key === 'ArrowUp' || event.key === 'ArrowLeft') {
      event.preventDefault();
      currentIndex = (currentIndex - 1 + items.length) % items.length;
      items[currentIndex].focus();
    } else if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      if (currentIndex >= 0) {
        onSelect(items[currentIndex]);
      }
    }
  };
  
  // Add event listener
  containerElement.addEventListener('keydown', handleKeyDown);
  
  // Return cleanup function
  return () => {
    containerElement.removeEventListener('keydown', handleKeyDown);
  };
}
