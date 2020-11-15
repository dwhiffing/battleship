import { type, Schema, ArraySchema } from '@colyseus/schema'
import { Player } from './Player'
import * as battleship from './../../lib/battleship'

export class Tile extends Schema {
  @type("number")
  index: number;

  @type("number")
  value: number;

  constructor({ index, value }) {
    super()
    this.index = index
    this.value = value
  }
}

export class RoomState extends Schema {

  @type("number")
  turnIndex: number;

  @type("number")
  phaseIndex: number;

  @type([Player])
  players = new ArraySchema<Player>();

  @type([Tile])
  grid = new ArraySchema<Tile>();
  
  constructor() {
    super()
    this.turnIndex = 0;
    this.phaseIndex = -1;
    const grid = battleship.getInitialGrid();
    grid.forEach(g => this.grid.push(new Tile(g)));
  }
}
