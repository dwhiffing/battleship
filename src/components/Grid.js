import React from 'react'
import {
  config,
  getCoords,
  getChunkIndex,
  getIsPartOfShip,
} from '../../lib/battleship'

export const Grid = (props) => (
  <div className="grid">
    {props.grid.map((tile) => {
      const player = props.clientPlayer
      const third = Math.floor(config.size / 3)
      const { x, y } = getCoords(tile.index)
      const chunkIndex = getChunkIndex(tile.index)
      let background = null

      if (chunkIndex === player.chunkIndex) {
        background = '#ffc' // highlight our chunk
      }

      if (props.preview.some((t) => t === tile.index)) {
        background = 'black' // highlight preview
      }

      if (
        (chunkIndex === player.chunkIndex || props.phaseIndex === 2) &&
        tile.value === 1
      ) {
        background = 'gray' // show player ships
      }

      if (tile.value === 2) {
        background = '#f00' // hit
      }

      if (tile.value === 3) {
        background = '#00f' // miss
      }

      if (props.ship && props.ship.some((s) => s.index === tile.index)) {
        background = getIsPartOfShip({ ...props, index: tile.index })
          ? '#ccc'
          : 'red'
      }

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
