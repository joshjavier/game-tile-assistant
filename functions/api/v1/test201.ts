export const onRequest: PagesFunction = async context => {
  let { request } = context

  if (
    request.method === 'GET' ||
    request.method === 'HEAD' ||
    request.method === 'POST'
  ) {
    const url = new URL(request.url)
    const apiUrl =
      'https://casino.on.betmgm.ca/en/games/api/content/GetGameMetaDataFromLMTAsync'

    const originHeader = { Origin: new URL(apiUrl).origin }
    request = new Request(apiUrl, { headers: originHeader })

    let response = await fetch(request)
    response = new Response(response.body, response)
    response.headers.set('Access-Control-Allow-Origin', url.origin)
    response.headers.append('Vary', 'Origin')

    return response
  } else {
    return new Response(null, {
      status: 405,
      statusText: 'Method Not Allowed',
    })
  }
}
