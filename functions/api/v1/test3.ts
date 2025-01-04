export const onRequestGet: PagesFunction = async context => {
  let { request } = context

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
}
