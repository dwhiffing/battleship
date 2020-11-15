import { type, Schema, ArraySchema } from '@colyseus/schema'
import { Player } from './Player'
import * as battleship from './../../lib/battleship'

export class Tile extends Schema {
  @type('number')
  index: number

  @type('number')
  value: number

  constructor({ index, value }) {
    super()
    this.index = index
    this.value = value
  }
}

export class RoomState extends Schema {
  @type('number')
  turnIndex: number

  @type('number')
  phaseIndex: number

  @type([Player])
  players = new ArraySchema<Player>()

  @type([Tile])
  grid = new ArraySchema<Tile>()

  constructor() {
    super()
    this.turnIndex = 0
    this.phaseIndex = -1
  }

  nextTurn() {
    do {
      this.turnIndex = (this.turnIndex + 1) % 9
    } while (
      !this.players.some((p) => p.index > -1 && p.chunkIndex === this.turnIndex)
    )

    const player = this.players.find((p) => p.chunkIndex === this.turnIndex)
    player.ammo = 5
  }
}
