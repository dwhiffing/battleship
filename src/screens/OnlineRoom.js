import React from 'react'
import { Flex } from '../components/Flex'
import { useRoomState } from '../utils/useRoomState'
import { Actions } from '../components/Actions'
import { Header } from '../components/Header'
import { Grid } from '../components/Grid'
import { PlayerList } from '../components/PlayerList'

export function OnlineRoom({ room, setRoom }) {
  const state = useRoomState({ room, setRoom })
  if (!room || !state.grid) return null

  return (
    <Flex className="container" variant="column">
      <Header {...state} />

      {(state.phaseIndex === -1 || state.showNames) && (
        <PlayerList {...state} />
      )}

      {state.phaseIndex > -1 && <Grid {...state} />}

      <Actions {...state} />
    </Flex>
  )
}
