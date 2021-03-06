import { useEffect, useState } from 'react'
import { getShip } from '../../lib/battleship'
import * as battleship from '../../lib/battleship'

export const useRoomState = ({ room, setRoom }) => {
  const [config, setConfig] = useState({ size: 18, ships: [3, 2, 1], shots: 5 })
  const [rotationIndex, setRotationIndex] = useState(0)
  const [showNames, setShowNames] = useState(false)
  const [hoveredTile, hoverTile] = useState(-99)
  const [placeIndex, setPlaceIndex] = useState(-99)
  const [serverState, setServerState] = useState(room.state.toJSON())

  useEffect(() => {
    if (!room) return
    setServerState(room.state.toJSON())
    room.onStateChange((state) => {
      state.toJSON().config && battleship.setConfig(state.toJSON().config)
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
    config,
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
  const onStart = () => room.send('Start', { config })
  const onEnd = () => room.send('End')
  const onSetConfig = () => {
    const _size = prompt('Board Size?')
    const _ships = prompt('Ships?')
    const _shots = prompt('Shots?')
    const size = +_size
    const shots = +_shots
    const ships = _ships.split(' ').map((s) => +s)
    if (
      size % 3 === 0 &&
      size >= 9 &&
      Number.isInteger(shots) &&
      shots > 0 &&
      Array.isArray(ships) &&
      ships.every((s) => Number.isInteger(s) && s <= size / 3)
    ) {
      setConfig({ size, ships, shots })
    }
  }
  const onList =
    data.phaseIndex > -1 ? () => data.setShowNames(!data.showNames) : null
  const onFire = () => {
    room.send('Fire', { index: data.placeIndex })
    clientPlayer.ammo > 1 && setPlaceIndex((p) => p + 1)
  }
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

  const listeners = {
    onLeave,
    onList,
    onRotate,
    onStart,
    onEnd,
    onFire,
    onPlace,
    onSetConfig,
  }
  return { ...data, ...listeners, onHoverTile, onClickTile, onKick }
}
