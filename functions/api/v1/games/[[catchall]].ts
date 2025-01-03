export const onRequestGet: PagesFunction = async context => {
  const params = context.params.catchall
  const request = context.request

  if (!params || params.length !== 2) {
    return new Response(null, {
      status: 418,
      statusText: "I'm a teapot",
    })
  }

  const [brand, state] = params
  const data = JSON.stringify({ brand, state, request })

  return new Response(data, {
    headers: { 'Content-Type': 'application/json;charset=UTF-8' },
  })
}
