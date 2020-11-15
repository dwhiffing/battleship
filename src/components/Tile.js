import React from 'react'
import { getChunkIndex } from '../../lib/battleship'
import * as battleship from '../../lib/battleship'

// should always highlight player chunk
// should de-highlight chunks that don't have any ships left

export const Tile = ({
  tile,
  onClick,
  onHover,
  boardSize,
  rotationIndex,
  clientPlayer,
  activeShip,
  roomState,
}) => {
  const third = Math.floor(boardSize / 3)
  const value = tile.value
  let tileBackground = null
  let borderColor = '#000'

  const chunkIndex = getChunkIndex(tile.index)

  // highlight our chunk
  if (chunkIndex === clientPlayer.chunkIndex) {
    tileBackground = '#ffc'
  } else if (
    !battleship.getActiveChunks({ grid: roomState.grid }).includes(chunkIndex)
  ) {
    // highlight dead chunks
    // tileBackground = '#d99'
  }

  // show player ships
  if (
    (chunkIndex === clientPlayer.chunkIndex || roomState.phaseIndex === 2) &&
    value === 1
  ) {
    tileBackground = 'gray'
  }

  // show hit
  if (value === 2) {
    tileBackground = '#f00'
  }

  // show miss
  if (value === 3) {
    tileBackground = '#00f'
  }

  if (activeShip && activeShip.some((s) => s.index === tile.index)) {
    const shipOptions = {
      rotationIndex,
      index: activeShip[0].index,
      shipLength: activeShip.length,
      grid: roomState.grid,
    }
    const isPlayerChunk =
      battleship.getChunkIndex(tile.index) === clientPlayer.chunkIndex
    const isBlocked = battleship.getIsBlocked(shipOptions)
    const isWithinChunk = battleship.getInFrame(shipOptions)

    tileBackground =
      isPlayerChunk && !isBlocked && isWithinChunk ? 'gray' : 'red'
  }

  const { x, y } = battleship.getCoords(tile.index)
  const borderStyle = `1px solid ${borderColor}`

  return (
    <div
      onClick={() => onClick({ tile })}
      onMouseEnter={() => onHover({ tile })}
      className="tile"
      style={{
        flex: `1 0 ${100 / boardSize}%`,
        borderTop: y === 0 ? borderStyle : null,
        borderLeft: x === 0 ? borderStyle : null,
        borderRight: x % third === third - 1 ? borderStyle : null,
        borderBottom: y % third === third - 1 ? borderStyle : null,
      }}
    >
      <div>
        <div
          style={{
            width: '100%',
            height: '100%',
            background: tileBackground,
          }}
        />
      </div>
    </div>
  )
}
