import type { GameMetaData } from '../_lib/types'

const brandSlugs = ['betmgm', 'borgata', 'wof', 'partycasino']
const states = ['nj', 'pa', 'mi', 'wv', 'on']
const brandDomain = {
  betmgm: 'betmgm',
  borgata: 'borgataonline',
  partycasino: 'partycasino',
  wof: 'wheeloffortunecasino',
}

const getCasinoBaseUrl = (
  brandSlug = 'betmgm',
  state = 'nj',
  { gameSubdomain = false } = {},
): string => {
  if (!brandSlugs.includes(brandSlug) || !states.includes(state)) {
    throw new Error('Invalid Search Params')
  }

  const brand = brandDomain[brandSlug]
  const segments: Record<string, string | null> = {
    product: gameSubdomain ? 'casinogames' : 'www',
    state,
    brand,
    tld: 'com',
  }

  // MC ON has a '.ca' top-level domain
  if (brandSlug === 'betmgm' && state === 'on') {
    segments.tld = 'ca'
  }

  // BC NJ and WOF NJ don't have a state subdomain
  const isBCNJ = brandSlug === 'borgata' && state === 'nj'
  const isWOFNJ = brandSlug === 'wof' && state === 'nj'
  if (isBCNJ || isWOFNJ) {
    segments.state = null
  }

  return `https://${Object.values(segments).filter(Boolean).join('.')}`
}

const fetchGames = (
  brand: string,
  state: string,
  { mobile = false } = {},
): Promise<Response> => {
  const baseUrl = getCasinoBaseUrl(brand, state)
  const apiUrl = baseUrl + '/en/games/api/content/GetGameMetaDataFromLMTAsync'
  const request = new Request(apiUrl)

  // Since Single-Domain Migration, x-bwin-casino-api header needs to be set
  request.headers.set('X-Bwin-Casino-Api', 'prod')

  if (mobile) {
    request.headers.set(
      'User-Agent',
      'Mozilla/5.0 (Android 13; Mobile; rv:109.0) Gecko/114.0 Firefox/114.0',
    )
  }
  return fetch(request)
}

/** Callback function to map server response to a more compact version */
const itemToGame = ({ game, name, provider, sid }: GameMetaData) => ({
  id: sid.slice(4),
  game,
  name,
  provider,
})

export async function GET(request: Request) {
  const params = new URL(request.url).searchParams
  const brand = params.get('b')
  const state = params.get('s')

  try {
    if (brand == null || state == null) {
      throw new Error('Missing Search Params')
    }

    const responses = await Promise.all([
      fetchGames(brand, state),
      fetchGames(brand, state, { mobile: true }),
    ])

    if (!responses[0].ok) {
      throw new Error('Fetch Failed')
    }

    const [d, m]: Array<GameMetaData[]> = await Promise.all(
      responses.map(r => r.json()),
    )
    // To reduce data returned to the client, we'll only include mobile games
    // in the second response by removing duplicates that already exist in the
    // first response.
    const desktopGameIds = d.map(game => game.sid)
    const mobileOnly = m.filter(game => !desktopGameIds.includes(game.sid))
    const data = {
      d: d.map(itemToGame),
      m: mobileOnly.map(itemToGame),
    }

    const options = {
      headers: { 'content-type': 'application/json;charset=UTF-8' },
    }
    return new Response(JSON.stringify(data), options)
  } catch (err) {
    return new Response(JSON.stringify({ error: err.response }), {
      status: err.message === 'Fetch Failed' ? 403 : 400,
      statusText: err.message === 'Fetch Failed' ? 'Forbidden' : 'Bad Request',
      headers: { 'content-type': 'application/json;charset=UTF-8' },
    })
  }
}

export const config = {
  // Use Edge runtime for smaller footprint and faster startup vs. Node.js
  runtime: 'edge',
  // Set location to a US region to avoid CORS errors
  regions: ['iad1'],
}
