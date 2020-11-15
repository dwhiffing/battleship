import { Command } from '@colyseus/command'
import { Player, RoomState } from '../schema'

export class StartCommand extends Command<RoomState, { playerId: string }> {
  validate({ playerId, name }) {
    return this.state.phaseIndex === -1 && this.state.players.length > 1
  }

  execute() {
    const chunkIndexes = shuffle(this.state.players.map((p, i) => i))
    this.state.phaseIndex = 0
    this.state.players.forEach((player, index) => {
      player.shipsToPlace = [5, 4, 3, 2, 1]
      player.chunkIndex = chunkIndexes[index]
      player.index = player.chunkIndex
    })
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
