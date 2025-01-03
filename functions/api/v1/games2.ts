export const onRequest: PagesFunction = async context => {
  const apiUrl =
    'https://casino.nj.betmgm.com/en/games/api/content/GetGameMetaDataFromLMTAsync'
  const mobileUA =
    'Mozilla/5.0 (Android 13; Mobile; rv:109.0) Gecko/114.0 Firefox/114.0'

  const responses = await Promise.all([
    fetch(apiUrl),
    fetch(apiUrl, {
      headers: { 'User-Agent': mobileUA },
    }),
  ])
  const results = await Promise.all(responses.map(r => r.json()))

  const options = {
    headers: { 'content-type': 'application/json;charset=UTF-8' },
  }
  return new Response(JSON.stringify(results), options)
}
