
@param value 
@returns 

export function isNotEmpty(value: string): boolean {
  return value.trim().length > 0;
}


 @param value 
 @param minLength 
 @returns

export function hasMinLength(value: string, minLength: number): boolean {
  return value.trim().length >= minLength;
}


@param value1 
@param value2 
@returns 

export function valuesMatch(value1: string, value2: string): boolean {
  return value1 === value2;
}


@param email 
@returns 

export function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}


@param password 
@returns

export function isStrongPassword(password: string): boolean {
  // At least 8 characters, 1 uppercase, 1 lowercase, 1 number
  const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/;
  return passwordRegex.test(password);
}


@param value 
@param validationFn 
@param errorMessage
@returns 

export function getValidationError(
  value: string, 
  validationFn: (value: string) => boolean, 
  errorMessage: string
): string {
  return validationFn(value) ? '' : errorMessage;
}
