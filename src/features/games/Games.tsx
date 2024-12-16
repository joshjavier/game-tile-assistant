import { useParams } from "react-router"
import { useGetGamesQuery } from "./gamesApiSlice"

export const Games = () => {
  const { brand, state } = useParams()
  const { data, isError, isLoading, isFetching, isSuccess } = useGetGamesQuery({ brand, state })

  if (isError) {
    return (
      <div><h1>There was an error!!!</h1></div>
    )
  }

  if (isFetching) {
    return (
      <div><h1>Loading...</h1></div>
    )
  }

  if (isSuccess) {
    return (
      <div>
        <ol>
          {data.desktop.map(game =>
            <li key={game.id}>
              {game.game} - {game.name} - {game.provider}
            </li>
          )}
        </ol>
      </div>
    )
  }
}
