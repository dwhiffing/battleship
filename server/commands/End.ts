import { Command } from '@colyseus/command'
import { RoomState } from '../schema'

export class EndCommand extends Command<RoomState, { playerId: string }> {
  validate({ playerId }) {
    return this.state.phaseIndex === 2
  }

  execute({ playerId }) {
    this.state.phaseIndex = -1
  }
}
