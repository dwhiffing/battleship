import { type, Schema } from '@colyseus/schema'

export class Player extends Schema {
  reconnection: any

  @type('string')
  id = ''

  @type('string')
  name = ''

  @type('number')
  team = -1

  @type('number')
  index = -1

  @type('number')
  ammo = -1

  @type('number')
  chunkIndex = -1

  @type('boolean')
  connected = true

  @type('boolean')
  isDead = false

  @type('boolean')
  isAdmin = false

  @type('number')
  remainingConnectionTime = 0

  @type(['number'])
  shipsToPlace = []

  constructor(id: string) {
    super()
    this.id = id
  }
}
