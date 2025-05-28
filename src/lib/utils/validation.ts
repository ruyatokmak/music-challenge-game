/**
 * Utility functions for form validation
 */

/**
 * Validates if a string is not empty
 * @param value The string to validate
 * @returns True if the string is not empty
 */
export function isNotEmpty(value: string): boolean {
  return value.trim().length > 0;
}

/**
 * Validates if a string meets minimum length requirement
 * @param value The string to validate
 * @param minLength The minimum length required
 * @returns True if the string meets the minimum length
 */
export function hasMinLength(value: string, minLength: number): boolean {
  return value.trim().length >= minLength;
}

/**
 * Validates if two strings match
 * @param value1 First string
 * @param value2 Second string
 * @returns True if the strings match
 */
export function valuesMatch(value1: string, value2: string): boolean {
  return value1 === value2;
}

/**
 * Validates if a string is a valid email format
 * @param email The email string to validate
 * @returns True if the email format is valid
 */
export function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

/**
 * Validates password strength
 * @param password The password to validate
 * @returns True if the password meets strength requirements
 */
export function isStrongPassword(password: string): boolean {
  // At least 8 characters, 1 uppercase, 1 lowercase, 1 number
  const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/;
  return passwordRegex.test(password);
}

/**
 * Returns validation error message or empty string if valid
 * @param value The value to validate
 * @param validationFn The validation function
 * @param errorMessage The error message to return if validation fails
 * @returns Error message or empty string
 */
export function getValidationError(
  value: string, 
  validationFn: (value: string) => boolean, 
  errorMessage: string
): string {
  return validationFn(value) ? '' : errorMessage;
}
