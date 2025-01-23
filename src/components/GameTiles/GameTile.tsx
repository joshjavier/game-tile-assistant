import type { ITile } from '@/features/tiles/tilesSlice'

interface Props {
  tile: ITile
}

export const GameTile = ({ tile }: Props) => {
  return (
    <a href={tile.smartlink}>
      <img
        alt={tile.name}
        src={tile.image}
        width={100}
        height={100}
        style={{ backgroundColor: '#f4f4f5', border: '5px solid #fff' }}
      />
    </a>
  )
}
