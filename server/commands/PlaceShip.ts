import { Command } from '@colyseus/command'
import { RoomState, Tile } from '../schema'
import * as battleship from '../../lib/battleship'

export class PlaceShipCommand extends Command<
  RoomState,
  { playerId: string; placeIndex: number; rotationIndex: number }
> {
  validate({ playerId, placeIndex, rotationIndex }) {
    const player = this.state.players.find((p) => p.id === playerId)
    const chunkIndex = player.chunkIndex
    const ship = battleship.getShip({
      index: placeIndex,
      clientPlayer: player,
      rotationIndex,
    })
    const grid = this.state.grid

    return (
      this.state.phaseIndex === 0 &&
      player &&
      player.shipsToPlace.length > 0 &&
      battleship.getChunkIndex(placeIndex) === chunkIndex &&
      !battleship.getIsBlocked({ ship, rotationIndex, grid }) &&
      battleship.getInChunk({ ship, rotationIndex })
    )
  }

  execute({ playerId, placeIndex, rotationIndex }) {
    const player = this.state.players.find((p) => p.id === playerId)
    const shipLength = player.shipsToPlace.shift()
    for (let i = 0; i < shipLength; i++) {
      this.state.grid[
        placeIndex + (rotationIndex === 1 ? i * battleship.config.size : i)
      ] = new Tile({
        index:
          placeIndex + (rotationIndex === 1 ? i * battleship.config.size : i),
        value: 1,
      })
    }

    if (this.state.players.every((p) => p.shipsToPlace.length === 0)) {
      this.state.phaseIndex = 1
      this.state.turnIndex = -1
      this.state.nextTurn()
    }
  }
}
