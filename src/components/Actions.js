import React from 'react'
import { Action } from '../components/Action'
import * as battleship from '../../lib/battleship'

export const Actions = (props) => (
  <>
    {props.phaseIndex === -1 && <LobbyActions {...props} />}
    {props.phaseIndex === 0 && <PlaceActions {...props} />}
    {props.phaseIndex === 1 && <ShootActions {...props} />}
    {props.phaseIndex === 2 && <EndActions {...props} />}
  </>
)

const LobbyActions = (props) => (
  <>
    {props.clientPlayer.isAdmin && (
      <>
        <Action disabled={props.players.length < 2} onClick={props.onStart}>
          Start
        </Action>
        <p>Board Size: {props.config.size}</p>
        <p>Cell Size: {props.config.size / 3}</p>
        <p>Ship Sizes: {props.config.ships.join(', ')}</p>
        <Action onClick={props.onSetConfig}>Set Config</Action>
      </>
    )}
  </>
)

const PlaceActions = (props) => (
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
)

const ShootActions = (props) => {
  const activePlayer = props.players.find((p) => p.index === props.turnIndex)

  return (
    <>
      {props.clientPlayer.index === props.turnIndex ? (
        <>
          {typeof props.placeIndex === 'number' ? (
            <Action onClick={props.onFire}>
              Fire ({props.clientPlayer.ammo})
            </Action>
          ) : (
            <span>Click a tile to shoot</span>
          )}
        </>
      ) : (
        <span>{activePlayer ? `${activePlayer.name} is shooting` : ''}</span>
      )}
    </>
  )
}

const EndActions = (props) => {
  let winningPlayer

  if (props.phaseIndex === 2) {
    winningPlayer = props.players.find((p) =>
      battleship.getActiveChunks({ grid: props.grid }).includes(p.chunkIndex),
    )
  }

  return (
    winningPlayer && (
      <>
        <span>Game over! {winningPlayer.name} wins</span>
        {props.clientPlayer.isAdmin && (
          <Action disabled={props.players.length < 2} onClick={props.onStart}>
            Start
          </Action>
        )}
      </>
    )
  )
}
