/**
 * Capitalises given word
 * @param word Word to be capitalised
 * @returns Capitalised word
 */
export function toCapitalCase(word: string) {
  return word.charAt(0).toUpperCase() + word.slice(1);
}
