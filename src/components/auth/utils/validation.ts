export function validatePassword(password: string): { isValid: boolean; error?: string } {
  if (password.length < 20) {
    return { 
      isValid: false, 
      error: 'Password must be at least 20 characters long' 
    };
  }
  
  if (!/\d/.test(password)) {
    return { 
      isValid: false, 
      error: 'Password must contain at least one number' 
    };
  }

  return { isValid: true };
}

export function validatePasswordMatch(password: string, confirmPassword: string): { isValid: boolean; error?: string } {
  if (password !== confirmPassword) {
    return { 
      isValid: false, 
      error: 'Passwords do not match' 
    };
  }

  return { isValid: true };
}