import { useParams } from "react-router"
import { useGetGamesQuery } from "./gamesApiSlice"
import Search from "../../components/Search"

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
        <Search documents={data.desktop} />
      </div>
    )
  }
}
