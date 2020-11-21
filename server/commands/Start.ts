import { Command } from '@colyseus/command'
import { RoomState, Tile } from '../schema'
import * as battleship from '../../lib/battleship'
import { ArraySchema } from '@colyseus/schema'
import { Config } from '../schema/RoomState'

export class StartCommand extends Command<
  RoomState,
  { playerId: string; config: any }
> {
  validate({ playerId, config }) {
    return (
      (this.state.phaseIndex === -1 || this.state.phaseIndex === 2) &&
      this.state.players.length > 1
    )
  }

  execute({ config }) {
    this.state.phaseIndex = -1
    this.state.grid = new ArraySchema<Tile>()
    battleship.setConfig(config)
    this.state.config = new Config(config)
    const grid = battleship.getInitialGrid()
    grid.forEach((g) => this.state.grid.push(new Tile(g)))

    const chunkIndexes = shuffle(new Array(9).fill(0).map((p, i) => i)).slice(
      0,
      this.state.players.length,
    )
    this.state.phaseIndex = 0
    this.state.players.forEach((player, index) => {
      player.shipsToPlace = battleship.config.ships
      player.chunkIndex = chunkIndexes[index]
      player.isDead = false
      player.index = player.chunkIndex
    })

    this.state.turnIndex = -1
    this.state.nextTurn()
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
