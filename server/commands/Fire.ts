import { Command } from '@colyseus/command'
import { RoomState, Tile } from '../schema'
import * as battleship from '../../lib/battleship'

export class FireCommand extends Command<
  RoomState,
  { playerId: string; index: number }
> {
  validate({ playerId, index }) {
    const player = this.state.players.find((p) => p.id === playerId)
    const tile = this.state.grid[index]

    return (
      this.state.phaseIndex === 1 &&
      player &&
      player.index === this.state.turnIndex &&
      tile.value < 2
    )
  }

  execute({ playerId, index }) {
    const player = this.state.players.find((p) => p.id === playerId)
    player.ammo -= 1

    const tile = this.state.grid[index]
    tile.value = tile.value === 1 ? 2 : 3

    // only keep players with ship parts left
    const activeChunks = battleship.getActiveChunks({ grid: this.state.grid })
    this.state.players.forEach((player) => {
      player.index = activeChunks.includes(player.chunkIndex)
        ? player.chunkIndex
        : -1
    })

    if (activeChunks.length < 2) {
      this.state.phaseIndex = 2
      this.state.turnIndex = 0
      return
    }

    if (player.ammo === 0) {
      this.state.nextTurn()
    }
  }
}
