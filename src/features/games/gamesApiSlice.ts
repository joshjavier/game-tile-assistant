import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react"
import { isAxiosError } from "axios"
import { getGamesByBrandState, type Game } from "./gamesApi"

export const gamesApiSlice = createApi({
  baseQuery: fetchBaseQuery({ baseUrl: '/' }),
  reducerPath: 'gamesApi',
  tagTypes: ['Games'],
  keepUnusedDataFor: 60 * 5, // keep cached data for 5 minutes

  endpoints(build) {
    return {
      getGames: build.query<
        Record<'desktop' | 'mobile', Game[]>,
        { brand?: string, state?: string }
      >({
        queryFn: async ({ brand, state }) => {
          try {
            const data = await getGamesByBrandState(brand, state)
            return { data }
          } catch (err) {
            if (isAxiosError(err)) {
              return {
                error: {
                  status: err.response?.status as number,
                  data: err.response?.data || err.message,
                }
              }
            }

            console.log(err)

            return {
              error: {
                status: 400,
                data: 'Unknown error. Check the console for more info.',
              }
            }
          }
        },
        providesTags(result, error, arg, meta) {
          return [{ type: 'Games', id: `${arg.brand}_${arg.state}` }]
        },
      }),
    }
  },
})

export const { useGetGamesQuery } = gamesApiSlice
