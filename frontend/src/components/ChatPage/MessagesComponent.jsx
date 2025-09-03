import React, { useEffect, useRef, useMemo } from 'react'
import { useSelector } from 'react-redux'

import { selectChannelsEntities, selectCurrentChannelId } from '../../slices/channelsState.js'
import { selectMessagesEntities } from '../../slices/messagesState.js'
import MessageForm from './MessageForm.jsx'
import MessagesHeader from './MessageHeader.jsx'
import Message from './Message.jsx'

const MessagesComponent = () => {
  const channels = useSelector(selectChannelsEntities)
  const messages = useSelector(selectMessagesEntities)
  const currentChannelId = useSelector(selectCurrentChannelId)

  const activeChannel = useMemo(() =>
    Object.values(channels).find(({ id }) => id === currentChannelId),
  [channels, currentChannelId])

  const activeChannelMessages = useMemo(() =>
    Object.values(messages).filter(message => message.channelId === currentChannelId),
  [messages, currentChannelId])

  const messagesView = useRef(null)
  useEffect(() => {
    messagesView.current?.lastElementChild?.scrollIntoView({ behavior: 'smooth' })
  }, [activeChannelMessages])

  return (
    <div className="col p-0 h-100">
      <div className="d-flex flex-column h-100">
        <MessagesHeader
          activeChannel={activeChannel}
          messagesCount={activeChannelMessages.length}
        />
        <div ref={messagesView} id="messages-box" className="chat-messages overflow-auto px-5">
          {activeChannelMessages.map(message => (
            <Message message={message} key={message.id} />
          ))}
        </div>
        <MessageForm activeChannel={activeChannel} />
      </div>
    </div>
  )
}

export default MessagesComponent
