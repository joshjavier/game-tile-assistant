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
    throw new Error('Invalid brand or state argument')
  }

  const brand = brandDomain[brandSlug]
  const segments = {
    product: gameSubdomain ? 'casinogames' : 'casino',
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

const fetchGames = async (
  brand: string,
  state: string,
  request: Request,
  { mobile = false } = {},
): Promise<Response> => {
  const baseUrl = getCasinoBaseUrl(brand, state)
  const apiUrl = baseUrl + '/en/games/api/content/GetGameMetaDataFromLMTAsync'
  const apiOrigin = new URL(apiUrl).origin
  const reqOrigin = new URL(request.url).origin

  // Rewrite request to point to API URL. This also makes the request mutable
  // so you can add the correct Origin header to make the API server think
  // that this request is not cross-site.
  request = new Request(apiUrl, request)
  request.headers.set('Origin', apiOrigin)
  if (mobile) {
    request.headers.set(
      'User-Agent',
      'Mozilla/5.0 (Android 13; Mobile; rv:109.0) Gecko/114.0 Firefox/114.0',
    )
  }

  let response = await fetch(request)
  // Recreate the response so you can modify the headers
  response = new Response(response.body, response)
  // Set CORS headers
  response.headers.set('Access-Control-Allow-Origin', reqOrigin)
  // Append to/Add Vary header so browser will cache response correctly
  response.headers.append('Vary', 'Origin')

  return response
}

/** Callback function to map server responses to a more compact version */
const itemToGame = ({ game, name, provider, sid }: Record<string, string>) => ({
  id: sid.slice(4),
  game,
  name,
  provider,
})

export const onRequestGet: PagesFunction = async context => {
  const params = context.params.catchall
  const request = context.request

  if (!params || params.length !== 2) {
    return new Response(null, {
      status: 404,
      statusText: 'Not Found',
    })
  }

  try {
    const [brand, state] = params
    const responses = await Promise.all([
      fetchGames(brand, state, request),
      fetchGames(brand, state, request, { mobile: true }),
    ])

    // Check if fetch is successful, otherwise throw error
    if (responses[0].status === 403) {
      throw new Error('VPN Required')
    }

    const [d, m]: any[] = await Promise.all(responses.map(r => r.json()))
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
    return new Response(JSON.stringify({ error: err.message }), {
      status: err.message === 'VPN Required' ? 403 : 400,
      statusText: err.message === 'VPN Required' ? 'Forbidden' : 'Bad Request',
      headers: { 'content-type': 'application/json;charset=UTF-8' },
    })
  }
}
