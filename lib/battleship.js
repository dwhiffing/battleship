export const config = {
  size: 24,
  chunkSize: 24 / 3,
}
export const getInitialGrid = () =>
  new Array(config.size * config.size)
    .fill(0)
    .map((i, index) => ({ value: Number(i), index }))

export const getIsBlocked = ({ index, rotationIndex, shipLength, grid }) => {
  let isBlocked = false

  for (let i = 0; i < shipLength; i++) {
    const gridIndex = grid[index + (rotationIndex === 1 ? i * config.size : i)]
    if (gridIndex && gridIndex.value === 1) isBlocked = true
  }

  return isBlocked
}

export const getInFrame = ({ index, rotationIndex, shipLength }) => {
  const { x: localX, y: localY } = getChunkLocalCoords(index)
  const horizontalValid = localX < config.chunkSize - shipLength + 1
  const verticalValid = localY < config.chunkSize - shipLength + 1

  return rotationIndex === 0 ? horizontalValid : verticalValid
}

export const getActiveChunks = ({ grid }) => {
  let activeChunks = []
  for (let i = 0; i < 9; i++) {
    const tiles = grid.filter((t) => getChunkIndex(t.index) === i)
    if (tiles.some((t) => t.value === 1)) {
      activeChunks.push(i)
    }
  }

  return activeChunks
}

export const getCoords = (index) => {
  const x = index % config.size
  const y = Math.floor(index / config.size)
  return { x, y }
}

export const getChunkLocalCoords = (index) => {
  const { x, y } = getCoords(index)
  const { x: chunkX, y: chunkY } = getChunkCoords(index)
  return { x: x - chunkX * config.chunkSize, y: y - chunkY * config.chunkSize }
}

export const getChunkCoords = (index) => {
  const { x, y } = getCoords(index)
  return {
    x: Math.floor(x / config.chunkSize),
    y: Math.floor(y / config.chunkSize),
  }
}

export const getChunkIndex = (index) => {
  const { x, y } = getChunkCoords(index)
  return x + y * 3
}
