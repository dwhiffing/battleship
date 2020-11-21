import { useEffect, useState } from 'react'
import { getShip } from '../../lib/battleship'
import * as battleship from '../../lib/battleship'

export const useRoomState = ({ room, setRoom }) => {
  const [rotationIndex, setRotationIndex] = useState(0)
  const [showNames, setShowNames] = useState(false)
  const [hoveredTile, hoverTile] = useState(-99)
  const [placeIndex, setPlaceIndex] = useState(-99)
  const [serverState, setServerState] = useState(room.state.toJSON())

  useEffect(() => {
    if (!room) return
    setServerState(room.state.toJSON())
    room.onStateChange((state) => {
      setServerState(state.toJSON())
    })

    // room.onMessage('message', (opts) => {
    // setMessage(opts)
    // setTimeout(() => setMessage(''), 5000)
    // })

    room.onLeave((code) => {
      if (code === 1000) localStorage.removeItem(room.id)
      setServerState({})
      setRoom()
    })
  }, [room, setRoom])

  const clientPlayer =
    (serverState.players || []).find((p) => p.id === room.sessionId) || {}

  const ship = getShip({ index: hoveredTile, rotationIndex, clientPlayer })
  const preview = getShip({ index: placeIndex, rotationIndex, clientPlayer })
  const data = {
    ...serverState,
    room,
    ship,
    preview,
    clientPlayer,
    rotationIndex,
    setRotationIndex,
    showNames,
    setShowNames,
    hoveredTile,
    hoverTile,
    placeIndex,
    setPlaceIndex,
  }

  const onLeave = () => room.leave()
  const onKick = (player) => room.send('Leave', { playerId: player.id })
  const onList =
    data.phaseIndex > -1 ? () => data.setShowNames(!data.showNames) : null
  const onFire = () => room.send('Fire', { index: data.placeIndex })
  const onRotate = () => setRotationIndex((i) => (i + 1) % 2)
  const onHoverTile = ({ tile }) => data.hoverTile(tile.index)
  const onPlace = () => {
    data.setPlaceIndex()
    room.send('PlaceShip', data)
  }
  const onClickTile = ({ tile }) => {
    const { phaseIndex, clientPlayer, setPlaceIndex } = data
    if (
      (phaseIndex === 0 &&
        battleship.getIsShipValid({ ...data, index: tile.index })) ||
      (phaseIndex === 1 &&
        battleship.getChunkIndex(tile.index) !== clientPlayer.chunkIndex)
    ) {
      setPlaceIndex(tile.index)
    }
  }

  const listeners = { onLeave, onList, onRotate, onStart, onFire, onPlace }
  return { ...data, ...listeners, onHoverTile, onClickTile, onKick }
}
