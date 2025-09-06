/**
 * Add an ellipsis to a given `text` parameter if the text is longer than a given `maxLength` parameter.
 *
 * @param text - string of text to transform
 * @param maxLength - max length of text before ellipsis is added
 * @returns
 */
function createEllipsisText(text: string, maxLength: number) {
  const subText = text.substring(0, maxLength)
  const lastChar = subText[maxLength - 1]
  return lastChar !== ' ' ? `${subText}...` : `${subText.substring(0, maxLength - 1)}...`
}

/**
 * Creates a slug from a given title.
 *
 * @param title - The title to create a slug from.
 * @returns The slugified version of the title.
 */
function createSlug(title: string) {
  return title.toLowerCase().split(' ').join('-') // 'Hello World' -> 'hello-world'
}

/**
 * Removes special characters from a given slug.
 *
 * @param slug - The slug to remove special characters from.
 * @returns The slug without special characters.
 */
function removeSpecialCharactersFromSlug(slug: string) {
  return slug.replace(/[^a-zA-Z0-9-]/g, '') // 'hello-world!' -> 'helloworld'
}

export { createEllipsisText, createSlug, removeSpecialCharactersFromSlug }
