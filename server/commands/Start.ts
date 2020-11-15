import { Command } from '@colyseus/command'
import { Player, RoomState, Tile } from '../schema'
import * as battleship from '../../lib/battleship'
import { ArraySchema } from '@colyseus/schema'

export class StartCommand extends Command<RoomState, { playerId: string }> {
  validate({ playerId, name }) {
    return (
      (this.state.phaseIndex === -1 || this.state.phaseIndex === 2) &&
      this.state.players.length > 1
    )
  }

  execute() {
    this.state.phaseIndex = -1
    this.state.grid = new ArraySchema<Tile>()
    const grid = battleship.getInitialGrid()
    grid.forEach((g) => this.state.grid.push(new Tile(g)))

    const chunkIndexes = shuffle(new Array(9).fill(0).map((p, i) => i)).slice(
      0,
      this.state.players.length,
    )
    this.state.phaseIndex = 0
    this.state.players.forEach((player, index) => {
      // player.shipsToPlace = [5, 4, 3, 2, 1]
      player.shipsToPlace = [1]
      player.chunkIndex = chunkIndexes[index]
      player.index = player.chunkIndex
    })

    this.state.turnIndex = -1
    do {
      this.state.turnIndex = (this.state.turnIndex + 1) % 9
    } while (
      !this.state.players.some(
        (p) => p.index > -1 && p.chunkIndex === this.state.turnIndex,
      )
    )
  }
}

function shuffle(_array) {
  let array = [..._array]
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * i)
    const temp = array[i]
    array[i] = array[j]
    array[j] = temp
  }
  return array
}
