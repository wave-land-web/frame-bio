/**
 * Capitalizes the first letter of a string
 * @param text - The string to capitalize
 * @returns The string with the first letter capitalized
 */
export function capitalize(text: string) {
  return text.charAt(0).toUpperCase() + text.slice(1)
}

/**
 * Normalizes an email address by converting it to lowercase and trimming whitespace
 * @param email - The email address to normalize
 * @returns The normalized email address
 */
export function normalizeEmail(email: string) {
  return email.toLowerCase().trim()
}
