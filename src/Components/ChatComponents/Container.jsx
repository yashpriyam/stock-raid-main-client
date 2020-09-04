import React from "react"
import Chat from "./Chat"
import {
  ConnectionConsumer,
  ChannelConsumer,
} from "../playPage/play-page.components"

const Container = () => {
  return (
    <ConnectionConsumer>
      {({ connection, updateConnection, userDetails }) => (
        <ChannelConsumer>
          {({ channel, updateChannel }) => (
            <div className='chat-panel-container'>
              <Chat
                connection={connection}
                updateConnection={updateConnection}
                channel={channel}
                updateChannel={updateChannel}
                userDetails={userDetails}
              />
            </div>
          )}
        </ChannelConsumer>
      )}
    </ConnectionConsumer>
  )
}
export default Container
