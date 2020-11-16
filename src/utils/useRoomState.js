import { useEffect, useState } from 'react'
import { config, getShip, getCoords } from '../../lib/battleship'
import * as battleship from '../../lib/battleship'

export const useRoomState = ({ room, setRoom }) => {
  const [rotationIndex, setRotationIndex] = useState(0)
  const [showNames, setShowNames] = useState(false)
  const [hoveredTile, hoverTile] = useState({ index: 0, value: 0 })
  const [placeIndex, setPlaceIndex] = useState({ index: 0, value: 0 })
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

  let ship = []
  if (
    clientPlayer.shipsToPlace &&
    clientPlayer.shipsToPlace.length > 0 &&
    hoveredTile
  ) {
    ship = getShip({ index: hoveredTile.index, rotationIndex, clientPlayer })
  }

  let preview = []
  if (typeof placeIndex === 'number') {
    preview = new Array(clientPlayer.shipsToPlace[0])
      .fill(0)
      .map((s, i) => placeIndex + (rotationIndex === 1 ? i * config.size : i))
      .filter(
        (t, i, arr) =>
          rotationIndex === 1 || getCoords(t).y === getCoords(arr[0]).y,
      )
  }

  const data = {
    ...serverState,
    rotationIndex,
    setRotationIndex,
    showNames,
    setShowNames,
    hoveredTile,
    hoverTile,
    placeIndex,
    setPlaceIndex,
    room,
    clientPlayer,
    ship,
    preview,
  }

  const onLeave = () => room.leave()
  const onKick = (player) => room.send('Leave', { playerId: player.id })
  const onStart = () => room.send('Start')
  const onList = () => data.setShowNames(!data.showNames)
  const onFire = () => room.send('Fire', { index: data.placeIndex })
  const onPlace = () => {
    room.send('PlaceShip', data)
    data.setPlaceIndex()
  }
  const onRotate = () => setRotationIndex((i) => (i + 1) % 2)
  const onHoverTile = ({ tile }) => data.hoverTile(tile)
  const onClickTile = ({ tile }) => {
    const { phaseIndex, clientPlayer, setPlaceIndex } = data
    if (phaseIndex === 0) {
      if (battleship.getIsPartOfShip({ ...data, index: tile.index }))
        setPlaceIndex(tile.index)
    } else if (
      phaseIndex === 1 &&
      battleship.getChunkIndex(tile.index) !== clientPlayer.chunkIndex
    ) {
      setPlaceIndex(tile.index)
    }
  }

  const listeners = {
    onLeave,
    onList,
    onRotate,
    onStart,
    onFire,
    onPlace,
  }
  return { ...data, ...listeners, onHoverTile, onClickTile, onKick }
}
