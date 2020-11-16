import React from 'react'
import { Action } from '../components/Action'
import * as battleship from '../../lib/battleship'

export const Actions = (props) => {
  const activePlayer = props.players.find((p) => p.index === props.turnIndex)
  let winningPlayer
  if (props.phaseIndex === 2) {
    winningPlayer = props.players.find((p) =>
      battleship.getActiveChunks({ grid: props.grid }).includes(p.chunkIndex),
    )
  }

  return (
    <>
      {props.phaseIndex === -1 && (
        <>
          {props.clientPlayer.isAdmin && (
            <Action
              disabled={props.players.length < 2}
              onClick={() => props.room.send('Start')}
            >
              Start
            </Action>
          )}
        </>
      )}

      {props.phaseIndex === 0 && (
        <>
          {props.clientPlayer.shipsToPlace.length > 0 ? (
            <>
              <Action onClick={props.onRotate}>Rotate</Action>
              <Action onClick={props.onPlace}>Place</Action>
              <p>Place your remaining ships</p>
            </>
          ) : (
            <p>Wait for the others to finish placing their ships</p>
          )}
        </>
      )}

      {props.phaseIndex === 1 && (
        <>
          {props.clientPlayer.index === props.turnIndex ? (
            <>
              {typeof props.placeIndex === 'number' ? (
                <Action onClick={props.onFire}>Fire</Action>
              ) : (
                <span>Click a tile to shoot</span>
              )}
            </>
          ) : (
            <span>
              {activePlayer ? `${activePlayer.name} is shooting` : ''}
            </span>
          )}
        </>
      )}

      {props.phaseIndex === 2 && winningPlayer && (
        <>
          <span>Game over! {winningPlayer.name} wins</span>
          {props.clientPlayer.isAdmin && (
            <Action disabled={props.players.length < 2} onClick={props.onStart}>
              Start
            </Action>
          )}
        </>
      )}
    </>
  )
}
