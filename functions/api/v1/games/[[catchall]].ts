export const onRequest: PagesFunction = async context => {
  const [brand, state] = context.params.catchall

  if (!brand || !state) {
    return new Response(null, {
      status: 418,
      statusText: "I'm a teapot",
    })
  }

  const data = JSON.stringify({ brand, state })

  return new Response(data, {
    headers: { 'Content-Type': 'application/json;charset=UTF-8' },
  })
}
