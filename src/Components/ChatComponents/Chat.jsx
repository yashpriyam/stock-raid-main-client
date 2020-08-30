import React, { useState, useEffect, useRef } from "react"
import { format } from "date-fns"
import UsersList from "./UsersList"
import MessageBox from "./MessageBox"
import FormInput from "../../helpers/form-input/form-input.component"
import CustomButton from "../../helpers/custom-button/custom-button.component"
import "../../App.css"

// Use for remote connections
const configuration = {
  iceServers: [{ url: "stun:stun.1.google.com:19302" }],
}

// Use for local connections

const Chat = ({ connection, updateConnection, channel, updateChannel }) => {
  const [socketOpen, setSocketOpen] = useState(false)
  const [socketMessages, setSocketMessages] = useState([])
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [name, setName] = useState("")
  const [loggingIn, setLoggingIn] = useState(false)
  const [users, setUsers] = useState([])
  const [connectedTo, setConnectedTo] = useState("")
  const [connecting, setConnecting] = useState(false)
  const [message, setMessage] = useState("")
  const [messages, setMessages] = useState({})
  const connectedRef = useRef()
  const webSocket = useRef(null)
  const messagesRef = useRef({})

  const onAnswer = ({ answer }) => {
    connection.setRemoteDescription(new RTCSessionDescription(answer))
  }

  // when we got ice candidate from another user
  const onCandidate = ({ candidate }) => {
    connection.addIceCandidate(new RTCIceCandidate(candidate))
  }


  const onLogin = ({ success, message, users: loggedIn }) => {
    setLoggingIn(false)
    if (success) {
      alert("Logged in successfully!")
      setIsLoggedIn(true)
      setUsers(loggedIn)
      const localConnection = new RTCPeerConnection(configuration)
      // when the browser finds an ice candidate we send it to another peer
      localConnection.onicecandidate = ({ candidate }) => {
        const connectedTo = connectedRef.current

        if (candidate && !!connectedTo) {
          send({
            name: connectedTo,
            type: "candidate",
            candidate,
          })
        }
      }
      localConnection.ondatachannel = (event) => {
        console.log("Data channel is created!")
        const receiveChannel = event.channel
        receiveChannel.onopen = () => {
          console.log("Data channel is open and ready to be used.")
        }
        receiveChannel.onmessage = handleDataChannelMessageReceived
        updateChannel(receiveChannel)
      }
      updateConnection(localConnection)
    } else {
      alert(`${message}`)
    }
  }

    // when somebody wants to message us
    const onOffer = ({ offer, name }) => {
      setConnectedTo(name)
      connectedRef.current = name
  
      connection
        .setRemoteDescription(new RTCSessionDescription(offer))
        .then(() => connection.createAnswer())
        .then((answer) => connection.setLocalDescription(answer))
        .then(() =>
          send({ type: "answer", answer: connection.localDescription, name })
        )
        .catch((e) => {
          console.log({ e })
          alert("An error has occurred.")
        })
    }

  
  useEffect(() => {
    webSocket.current = new WebSocket(
      "wss://stock-raid-chat-server.herokuapp.com/"
    )
    webSocket.current.onmessage = (msg) => {
      const data = JSON.parse(msg.data)
      setSocketMessages((prev) => [...prev, data])
    }
    webSocket.current.onclose = () => {
      webSocket.current.close()
    }
    return () => webSocket.current.close()
  }, [])

  useEffect(() => {
    const data = socketMessages.pop()
    if (data) {
      switch (data.type) {
        case "connect":
          setSocketOpen(true)
          break
        case "login":
          onLogin(data)
          break
        case "updateUsers":
          updateUsersList(data)
          break
        case "removeUser":
          removeUser(data)
          break
        case "offer":
          onOffer(data)
          break
        case "answer":
          onAnswer(data)
          break
        case "candidate":
          onCandidate(data)
          break
        default:
          break
      }
    }
  }, [onAnswer, onCandidate, onLogin, onOffer, socketMessages])

  const send = (data) => {
    webSocket.current.send(JSON.stringify(data))
  }

  const handleLogin = () => {
    setLoggingIn(true)
    send({
      type: "login",
      name,
    })
  }

  const updateUsersList = ({ user }) => {
    setUsers((prev) => [...prev, user])
  }

  const removeUser = ({ user }) => {
    setUsers((prev) => prev.filter((u) => u.userName !== user.userName))
  }

  const handleDataChannelMessageReceived = ({ data }) => {
    const message = JSON.parse(data)
    const { name: user } = message
    const messages = messagesRef.current
    let userMessages = messages[user]
    if (userMessages) {
      userMessages = [...userMessages, message]
      const newMessages = { ...messages, [user]: userMessages }
      messagesRef.current = newMessages
      setMessages(newMessages)
    } else {
      const newMessages = { ...messages, [user]: [message] }
      messagesRef.current = newMessages
      setMessages(newMessages)
    }
  }





  // when another user answers to our offer


  // when a user clicks the send message button
  const sendMsg = () => {
    const time = format(new Date(), "yyyy-MM-dd'T'HH:mm:ss.SSSxxx")
    const text = { time, message, name }
    const messages = messagesRef.current
    const connectedTo = connectedRef.current
    let userMessages = messages[connectedTo]
    if (messages[connectedTo]) {
      userMessages = [...userMessages, text]
      const newMessages = { ...messages, [connectedTo]: userMessages }
      messagesRef.current = newMessages
      setMessages(newMessages)
    } else {
      userMessages = { ...messages, [connectedTo]: [text] }
      messagesRef.current = userMessages
      setMessages(userMessages)
    }
    channel.send(JSON.stringify(text))
    setMessage("")
  }

  const handleConnection = (name) => {
    const dataChannel = connection.createDataChannel("messenger")

    dataChannel.onerror = (error) => {
      alert("An error has occurred.")
    }

    dataChannel.onmessage = handleDataChannelMessageReceived
    updateChannel(dataChannel)

    connection
      .createOffer()
      .then((offer) => connection.setLocalDescription(offer))
      .then(() =>
        send({ type: "offer", offer: connection.localDescription, name })
      )
      .catch((e) => alert("An error has occurred."))
  }

  const toggleConnection = (userName) => {
    if (connectedRef.current === userName) {
      setConnecting(true)
      setConnectedTo("")
      connectedRef.current = ""
      setConnecting(false)
    } else {
      setConnecting(true)
      setConnectedTo(userName)
      connectedRef.current = userName
      handleConnection(userName)
      setConnecting(false)
    }
  }
  return (
    <div className="App">
      {socketOpen && (
        <>
          <div>
            <div>
              {(!isLoggedIn && (
                <>
                  <FormInput
                    disabled={loggingIn}
                    type="text"
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Username"
                  />
                  <CustomButton
                    disabled={!name || loggingIn}
                    onClick={handleLogin}
                  >
                    Login
                  </CustomButton>
                </>
              )) || <div>Logged In as: {name}</div>}
            </div>
          </div>
          <div>
            <UsersList
              users={users}
              toggleConnection={toggleConnection}
              connectedTo={connectedTo}
              connection={connecting}
            />
            <MessageBox
              messages={messages}
              connectedTo={connectedTo}
              message={message}
              setMessage={setMessage}
              sendMsg={sendMsg}
              name={name}
            />
          </div>
        </>
      )}
    </div>
  )
}

// Chat.propTypes = {
//     params: React.PropTypes.any,
// };

export default Chat
