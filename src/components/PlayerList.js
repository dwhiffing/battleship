import React from 'react'
import { Flex } from './Flex'
import { Action } from './Action'

export const PlayerList = ({ players, clientPlayer, onKick }) => (
  <Flex variant="column" style={{ minWidth: 50, margin: '20px 0' }}>
    {players.map((player) => (
      <span
        key={player.name}
        style={{
          minWidth: 150,
          fontWeight: player.name === clientPlayer.name ? 'bold' : 'normal',
        }}
      >
        {player.name} {player.connected ? '' : '(disconnected)'}
        {clientPlayer.isAdmin && player.id !== clientPlayer.id && (
          <Action onClick={() => onKick(player)}>Kick</Action>
        )}
      </span>
    ))}
    <span>{players.length}/8 Players</span>
  </Flex>
)
