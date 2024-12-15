/**
 * Construct a type guard function that checks if a value is in an enum
 *
 * @link https://stackoverflow.com/a/58278753
 * @param enum
 * @returns {Function} Type guard function for enum
 */
export const isSomeEnum = <T extends { [s: string]: unknown }>(e: T) => {
  return (token: any): token is T[keyof T] => {
    return Object.values(e).includes(token)
  }
}
