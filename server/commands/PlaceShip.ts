import { Command } from '@colyseus/command'
import { RoomState, Tile } from '../schema'
import * as battleship from '../../lib/battleship'

export class PlaceShipCommand extends Command<
  RoomState,
  { playerId: string; index: number; rotationIndex: number }
> {
  validate({ playerId, index, rotationIndex }) {
    const player = this.state.players.find((p) => p.id === playerId)
    const chunkIndex = player.chunkIndex
    const shipLength = player.shipsToPlace[0]
    const grid = this.state.grid

    return (
      this.state.phaseIndex === 0 &&
      player &&
      player.shipsToPlace.length > 0 &&
      battleship.getChunkIndex(index) === chunkIndex &&
      !battleship.getIsBlocked({ index, rotationIndex, shipLength, grid }) &&
      battleship.getInFrame({ index, rotationIndex, shipLength })
    )
  }

  execute({ playerId, index, rotationIndex }) {
    const player = this.state.players.find((p) => p.id === playerId)
    const shipLength = player.shipsToPlace.shift()
    for (let i = 0; i < shipLength; i++) {
      this.state.grid[
        index + (rotationIndex === 1 ? i * battleship.config.size : i)
      ] = new Tile({
        index: index + (rotationIndex === 1 ? i * battleship.config.size : i),
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
