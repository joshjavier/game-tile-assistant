import type { Options } from 'minisearch'
import type { ChangeEventHandler } from 'react'
import { useMiniSearch } from 'react-minisearch'
import type { Game } from '../features/games/gamesApi'

const miniSearchOptions: Options = {
  fields: ['name'],
  searchOptions: {
    fuzzy: 0.2,
    prefix: true,
  },
}

interface SearchProps {
  documents: Game[]
}

const Search = ({ documents }: SearchProps) => {
  const { search, searchResults } = useMiniSearch(documents, miniSearchOptions)

  const handleSearchChange: ChangeEventHandler<HTMLInputElement> = (event) => {
    search(event.target.value)
  }

  return (
    <div>
      <input type='text' onChange={handleSearchChange} placeholder='Search…' />

      <ol>
        <h3>Results:</h3>
        {
          searchResults && searchResults.map((result, i) => {
            return <li key={i}>{result.name} - {result.game} - {result.provider} - {Object.keys(result).toString()}</li>
          })
        }
      </ol>
    </div>
  )
}

export default Search
