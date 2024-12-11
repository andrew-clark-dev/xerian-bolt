/**
 * Checks if a phone number indicates a mobile number based on Swiss mobile prefixes
 * @param phoneNumber The phone number to check
 * @returns boolean indicating if the number is a mobile number
 */
export function isMobileNumber(phoneNumber: string): boolean {
  const mobileRegex = /078|076|079|(0).*78|(0).*76|(0).*79/gm;
  return mobileRegex.test(phoneNumber);
}