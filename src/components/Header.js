import React from 'react'
import { Flex } from '../components/Flex'
import { Action } from '../components/Action'

const PHASES = ['PLACE PHASE', 'SHOOT PHASE']
export const Header = ({ onLeave, onList, phaseIndex }) => (
  <Flex variant="justify-between">
    <Flex style={{ minWidth: 50 }}>
      <Action onClick={onLeave}>Leave</Action>
    </Flex>

    <Flex variant="center" style={{ minWidth: 50 }}>
      <p>{PHASES[phaseIndex] || 'LOBBY'}</p>
    </Flex>

    <Flex variant="justify-end" style={{ minWidth: 50 }}>
      {onList && <Action onClick={onList}>List</Action>}
    </Flex>
  </Flex>
)
