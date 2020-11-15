import React, { useState } from 'react'
import { Flex } from '../components/Flex'
import { Action } from '../components/Action'
import { useRoomState } from '../utils/useRoomState'
import { Tile } from '../components/Tile'
import * as battleship from '../../lib/battleship'

export function OnlineRoom({ room, setRoom }) {
  const [roomState] = useRoomState({ room, setRoom })
  const [rotationIndex, setRotationIndex] = useState(0)
  const [hoveredTile, hoverTile] = useState({ index: 0, value: 0 })
  const clientPlayer =
    (roomState.players || []).find((p) => p.id === room.sessionId) || {}

  const handleHoverTile = ({ tile }) => {
    hoverTile(tile)
  }

  const handleClickTile = ({ tile }) => {
    if (roomState.phaseIndex === 0) {
      room.send('PlaceShip', { index: tile.index, rotationIndex })
    } else if (roomState.phaseIndex === 1) {
      room.send('Fire', { index: tile.index })
    }
  }

  const boardSize = battleship.config.size

  let activeShip = []
  if (clientPlayer.shipsToPlace && clientPlayer.shipsToPlace.length > 0) {
    if (hoveredTile) {
      activeShip = new Array(clientPlayer.shipsToPlace[0])
        .fill(0)
        .map((s, i) => ({
          index: hoveredTile.index + (rotationIndex === 1 ? i * boardSize : i),
          value: 1,
        }))
        .filter((t, i, arr) => {
          const first = arr[0]
          const firstY = battleship.getCoords(first.index).y
          const y = battleship.getCoords(t.index).y
          return rotationIndex === 1 || y === firstY
        })
    }
  }

  let winningPlayer
  if (roomState.phaseIndex === 2) {
    winningPlayer = roomState.players.find((p) =>
      battleship
        .getActiveChunks({ grid: roomState.grid })
        .includes(p.chunkIndex),
    )
  }

  if (!room || !roomState.grid) return null

  const activePlayer = roomState.players.find(
    (p) => p.index === roomState.turnIndex,
  )

  return (
    <Flex className="container" variant="column">
      <Action onClick={() => room.leave()}>Leave</Action>
      {roomState.phaseIndex > -1 && <p>{clientPlayer.name}</p>}
      {roomState.phaseIndex > -1 && (
        <div className="grid">
          {roomState.grid.map((tile) => {
            return (
              <Tile
                key={tile.index}
                tile={tile}
                rotationIndex={rotationIndex}
                clientPlayer={clientPlayer}
                roomState={roomState}
                hoveredTile={hoveredTile}
                activeShip={activeShip}
                onClick={handleClickTile}
                onHover={handleHoverTile}
                boardSize={boardSize}
              />
            )
          })}
        </div>
      )}
      {clientPlayer.isAdmin &&
        (roomState.phaseIndex === 2 || roomState.phaseIndex === -1) && (
          <Action
            disabled={roomState.players.length < 2}
            onClick={() => room.send('Start')}
          >
            Start
          </Action>
        )}
      {roomState.phaseIndex === 0 &&
        (clientPlayer.shipsToPlace.length > 0 ? (
          <div>
            <Action onClick={() => setRotationIndex((i) => (i + 1) % 2)}>
              Rotate
            </Action>
            <p>Place your remaining ships</p>
          </div>
        ) : (
          <p>Wait for the others to finish placing their ships</p>
        ))}
      {roomState.phaseIndex === 1 &&
        (clientPlayer.index === roomState.turnIndex ? (
          <span>Click a tile to shoot</span>
        ) : (
          <span>{activePlayer ? `${activePlayer.name} is shooting` : ''}</span>
        ))}
      {roomState.phaseIndex === 2 && (
        <span>Game over! {winningPlayer.name} wins</span>
      )}

      <div>
        {roomState.players.map((player) => (
          <p
            style={{
              fontWeight: player.name === clientPlayer.name ? 'bold' : 'normal',
            }}
          >
            {player.name} {player.connected ? '' : '(disconnected)'}
            {clientPlayer.isAdmin && player.id !== clientPlayer.id && (
              <Action
                onClick={() => room.send('Leave', { playerId: player.id })}
              >
                Kick
              </Action>
            )}
          </p>
        ))}
        <p>{roomState.players.length}/8 Players</p>
      </div>
    </Flex>
  )
}
