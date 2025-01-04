export const onRequestOptions: PagesFunction = async context => {
  const { request } = context

  const corsHeaders = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET,HEAD,POST,OPTIONS',
    'Access-Control-Max-Age': '86400',
  }

  if (
    request.headers.get('Origin') !== null &&
    request.headers.get('Access-Control-Request-Method') !== null &&
    request.headers.get('Access-Control-Request-Headers') !== null
  ) {
    return new Response(null, {
      headers: {
        ...corsHeaders,
        'Access-Control-Allow-Headers': request.headers.get(
          'Access-Control-Request-Headers',
        ),
      },
    })
  } else {
    return new Response(null, {
      headers: {
        Allow: 'GET, HEAD, POST, OPTIONS',
      },
    })
  }
}

export const onRequest: PagesFunction = async context => {
  let { request } = context

  if (
    request.method === 'GET' ||
    request.method === 'HEAD' ||
    request.method === 'POST'
  ) {
    const url = new URL(request.url)
    const apiUrl =
      'https://casino.nj.betmgm.com/en/games/api/content/GetGameMetaDataFromLMTAsync'

    request = new Request(apiUrl, request)
    request.headers.set('Origin', new URL(apiUrl).origin)

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
