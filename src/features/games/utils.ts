import { Brand, BrandSlug, isBrandSlug, isState, State } from '../../app/types'

/**
 * Get the casino base URL for a given brand slug and state
 *
 * @example
 * // returns 'https://casino.nj.betmgm.com'
 * getCasinoBaseUrl('betmgm', 'nj')
 *
 * // returns 'https://casino.on.betmgm.ca'
 * getCasinoBaseUrl('betmgm', 'on')
 */
export function getCasinoBaseUrl(
  brandSlug = 'betmgm',
  state = 'nj',
  { gameSubdomain = false } = {},
) {
  if (!isBrandSlug(brandSlug) || !isState(state)) {
    throw new Error('Invalid brand or state arguments')
  }

  const brand = Brand[BrandSlug[brandSlug]]
  const segments = {
    product: gameSubdomain ? 'casinogames' : 'casino',
    state: state as State | null,
    brand,
    tld: 'com',
  }

  // MC ON has a '.ca' top-level domain
  if (brand === Brand.betmgm && state === State.ON) {
    segments.tld = 'ca'
  }

  // BC NJ and WOF NJ doesn't have a state subdomain
  const isBCNJ = brand === Brand.borgata && state === State.NJ
  const isWOFNJ = brand === Brand.wof && state === State.NJ
  if (isBCNJ || isWOFNJ) {
    segments.state = null
  }

  return `https://${Object.values(segments).filter(Boolean).join('.')}`
}
