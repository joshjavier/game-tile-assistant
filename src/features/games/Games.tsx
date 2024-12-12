import { useGetGamesQuery } from "./gamesApiSlice"

export const Games = () => {
  const { data, isError, isLoading, isSuccess } = useGetGamesQuery()

  if (isError) {
    return (
      <div><h1>There was an error!!!</h1></div>
    )
  }

  if (isLoading) {
    return (
      <div><h1>Loading...</h1></div>
    )
  }

  if (isSuccess) {
    return (
      <div>Games have been fetched. Check the console.</div>
    )
  }
}
