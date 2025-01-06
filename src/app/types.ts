import { isSomeEnum } from "../utils"

/**
 * The domain name used in official brand websites
 *
 * @example <caption>see enclosed in parentheses</caption>
 * // https://casino.nj.(betmgm).com
 * // https://casino.(borgataonline).com
 * // https://casino.nj.(partycasino).com
 */
export enum Brand {
  betmgm = "betmgm",
  borgata = "borgataonline",
  partycasino = "partycasino",
  wof = "wheeloffortunecasino",
}

/**
 * The state subdomain used in official brand websites
 *
 * @example <caption>see enclosed in parentheses</caption>
 * // https://casino.(nj).betmgm.com
 * // https://casino.(pa).borgataonline.com
 * // https://casino.(on).wheeloffortunecasino.com
 */
export enum State {
  NJ = "nj",
  PA = "pa",
  MI = "mi",
  WV = "wv",
  ON = "on",
}

/**
 * Accepted brand slugs used for routing within the app
 *
 * @example <caption>see enclosed in parentheses</caption>
 * // /(betmgm)/nj
 * // /(borgata)/pa
 * // /(wof)/on
 */
export enum BrandSlug {
  betmgm = "betmgm",
  borgata = "borgata",
  wof = "wof",
  partycasino = "partycasino",
}

/**
 * Brand abbreviations commonly used by the team
 */
export enum BrandAbbreviation {
  betmgm = "mc",
  borgata = "bc",
  wof = "wof",
  partycasino = "pc",
}

export const isBrandSlug = isSomeEnum(BrandSlug)
export const isState = isSomeEnum(State)
