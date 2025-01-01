import { FormatNumber } from '@chakra-ui/react'
import { timeAgo } from 'short-time-ago'
import { Status } from './ui/status'
import { memo } from 'react'

interface FetchStatusProps {
  status?: 'fetching' | 'failed'
  gameCount: number
  lastFetched?: number
}

export const FetchStatus = memo(
  ({ status, gameCount, lastFetched }: FetchStatusProps) => {
    if (status) {
      return (
        <Status
          size="sm"
          value={status === 'failed' ? 'error' : 'warning'}
          color="fg.muted"
          animation={status === 'fetching' ? 'pulse' : undefined}
        >
          {status === 'failed'
            ? 'Error fetching game metadata'
            : 'Fetching games...'}
        </Status>
      )
    }

    return (
      <Status size="sm" value="success" color="fg.muted">
        <FormatNumber value={gameCount} /> games fetched{' '}
        {lastFetched && timeAgo(new Date(lastFetched))}
      </Status>
    )
  },
)
