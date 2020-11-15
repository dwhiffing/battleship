import { useEffect, useState } from 'react'

export const useRoomState = ({ room, setRoom }) => {
  const [serverState, setServerState] = useState(room.state.toJSON())

  useEffect(() => {
    if (!room) return
    setServerState(room.state.toJSON())
    room.onStateChange((state) => {
      // if (!state.players.toJSON().some((p) => p.id === room.sessionId)) {
      //   room.leave()
      //   localStorage.removeItem(room.id)
      //   setServerState({})
      //   setRoom()
      // }
      setServerState(state.toJSON())
    })

    // room.onMessage('message', (opts) => {
    // setMessage(opts)
    // setTimeout(() => setMessage(''), 5000)
    // })

    // setTimeout(() => {
    //   room.onLeave(() => {
    //     localStorage.removeItem(room.id)
    //     setServerState({})
    //     setRoom()
    //   })
    // }, 10000)
  }, [room, setRoom])

  return [serverState]
}
