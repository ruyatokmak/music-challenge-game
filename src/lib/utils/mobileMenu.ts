/**
 * Handles mobile menu toggle functionality for the Header component
 * @param {HTMLElement} navMenu - The navigation menu element
 * @param {HTMLElement} toggleButton - The button that toggles the menu
 */
export function setupMobileMenu(navMenu: HTMLElement, toggleButton: HTMLElement): void {
  // Toggle mobile menu visibility
  const toggleMenu = (): void => {
    navMenu.classList.toggle('open');
    
    // Update aria attributes for accessibility
    const isOpen = navMenu.classList.contains('open');
    toggleButton.setAttribute('aria-expanded', isOpen.toString());
  };
  
  // Add click event listener to toggle button
  toggleButton.addEventListener('click', toggleMenu);
  
  // Close menu when clicking outside
  document.addEventListener('click', (event: MouseEvent) => {
    const target = event.target as HTMLElement;
    if (!navMenu.contains(target) && !toggleButton.contains(target) && navMenu.classList.contains('open')) {
      toggleMenu();
    }
  });
  
  // Close menu when pressing escape key
  document.addEventListener('keydown', (event: KeyboardEvent) => {
    if (event.key === 'Escape' && navMenu.classList.contains('open')) {
      toggleMenu();
    }
  });
}
