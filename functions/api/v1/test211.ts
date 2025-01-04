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

  request = new Request(apiUrl, request)
  request.headers.set('Origin', apiOrigin)
  if (mobile) {
    request.headers.set(
      'User-Agent',
      'Mozilla/5.0 (Android 13; Mobile; rv:109.0) Gecko/114.0 Firefox/114.0',
    )
  }

  let response = await fetch(request)
  response = new Response(response.body, response)
  response.headers.set('Access-Control-Allow-Origin', reqOrigin)
  response.headers.append('Vary', 'Origin')

  return response
}

export const onRequest: PagesFunction = async context => {
  let { request } = context

  if (
    request.method === 'GET' ||
    request.method === 'HEAD' ||
    request.method === 'POST'
  ) {
    return fetchGames('betmgm', 'nj', request)
  } else {
    return new Response(null, {
      status: 405,
      statusText: 'Method Not Allowed',
    })
  }
}