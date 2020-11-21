export let config = {
  size: 18,
  ships: [5, 4, 3, 2, 1],
}

export const setConfig = (_config) => (config = _config)

export const getInitialGrid = () =>
  new Array(config.size * config.size)
    .fill(0)
    .map((i, index) => ({ value: Number(i), index }))

export const getIsBlocked = ({ ship, rotationIndex, grid }) => {
  let isBlocked = false
  const index = ship[0] || 0
  for (let i = 0; i < ship.length; i++) {
    const gridIndex = grid[index + (rotationIndex === 1 ? i * config.size : i)]
    if (gridIndex && gridIndex.value === 1) isBlocked = true
  }

  return isBlocked
}

export const getInChunk = ({ ship, rotationIndex }) => {
  const index = ship[0] || -1
  const { x: localX, y: localY } = getChunkLocalCoords(index)
  const horizontalValid = localX < config.size / 3 - ship.length + 1
  const verticalValid = localY < config.size / 3 - ship.length + 1

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
  return {
    x: x - chunkX * (config.size / 3),
    y: y - chunkY * (config.size / 3),
  }
}

export const getChunkCoords = (index) => {
  const { x, y } = getCoords(index)
  return {
    x: Math.floor(x / (config.size / 3)),
    y: Math.floor(y / (config.size / 3)),
  }
}

export const getChunkIndex = (index) => {
  const { x, y } = getChunkCoords(index)
  return x + y * 3
}

export const getIsShipValid = (props) => {
  const isPlayerChunk =
    getChunkIndex(props.index) === props.clientPlayer.chunkIndex
  const isBlocked = getIsBlocked(props)
  const isWithinChunk = getInChunk(props)

  return isPlayerChunk && !isBlocked && isWithinChunk
}

export const getShip = (props) => {
  if (
    typeof props.index !== 'number' ||
    !props.clientPlayer.shipsToPlace ||
    props.clientPlayer.shipsToPlace.length === 0
  )
    return []

  return new Array(props.clientPlayer.shipsToPlace[0])
    .fill(0)
    .map(
      (s, i) => props.index + (props.rotationIndex === 1 ? i * config.size : i),
    )
}
