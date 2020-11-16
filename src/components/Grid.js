import React from 'react'
import {
  config,
  getCoords,
  getChunkIndex,
  getIsShipValid,
} from '../../lib/battleship'

export const Grid = (props) => {
  const filterBorders = (t, i, arr) =>
    props.rotationIndex === 1 || getCoords(t).y === getCoords(arr[0]).y

  return (
    <div className="grid">
      {props.grid.map((tile) => {
        const player = props.clientPlayer
        const third = Math.floor(config.size / 3)
        const { x, y } = getCoords(tile.index)
        const chunk = getChunkIndex(tile.index)
        let background = null

        // highlight our chunk
        if (chunk === player.chunkIndex) background = '#ffc'

        // highlight preview
        const isPlace = tile.index === props.placeIndex
        const isPreview = props.preview
          .filter(filterBorders)
          .some((t) => t === tile.index)
        if (isPlace || isPreview) background = 'black'

        // show player ships
        const showShip = chunk === player.chunkIndex || props.phaseIndex === 2
        if (showShip && tile.value === 1) background = 'gray'

        if (tile.value === 2) background = '#f00' // hit

        if (tile.value === 3) background = '#00f' // miss

        if (props.ship.filter(filterBorders).some((s) => s === tile.index))
          background = getIsShipValid({ ...props, index: tile.index })
            ? '#ccc'
            : 'red'

        return (
          <div
            key={tile.index}
            className="tile"
            onClick={() => props.onClickTile({ tile })}
            onMouseEnter={() => props.onHoverTile({ tile })}
            style={{
              flex: `1 0 ${100 / config.size}%`,
              borderTop: y === 0 ? '1px solid #000' : null,
              borderLeft: x === 0 ? '1px solid #000' : null,
              borderRight: x % third === third - 1 ? '1px solid #000' : null,
              borderBottom: y % third === third - 1 ? '1px solid #000' : null,
            }}
          >
            <div style={{ width: '100%', height: '100%', background }} />
          </div>
        )
      })}
    </div>
  )
}
