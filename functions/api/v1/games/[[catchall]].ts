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

export const onRequestGet: PagesFunction = async context => {
  const params = context.params.catchall

  if (!params || params.length !== 2) {
    return new Response(null, {
      status: 418,
      statusText: "I'm a teapot",
    })
  }

  const [brand, state] = params
  const baseUrl = getCasinoBaseUrl(brand, state)
  const apiUrl = new URL(
    baseUrl + '/en/games/api/content/GetGameMetaDataFromLMTAsync',
  )
  const apiOrigin = apiUrl.origin

  const originHeader = { Origin: apiOrigin }
  const mobileHeader = {
    'User-Agent':
      'Mozilla/5.0 (Android 13; Mobile; rv:109.0) Gecko/114.0 Firefox/114.0',
  }

  const dReq = new Request(apiUrl, { headers: originHeader })
  const mReq = new Request(apiUrl, {
    headers: { ...originHeader, ...mobileHeader },
  })

  const responses = await Promise.all([fetch(dReq), fetch(mReq)])
  const results = await Promise.all(responses.map(r => r.json()))

  const options = {
    headers: { 'content-type': 'application/json;charset=UTF-8' },
  }

  return new Response(JSON.stringify(results), options)
}
