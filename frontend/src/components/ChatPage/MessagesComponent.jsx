import { useEffect, useRef, useMemo } from 'react'
import { useSelector } from 'react-redux'

import { selectChannelsEntities } from '../../slices/channelsState.js'
import { selectCurrentChannelId } from '../../slices/UIState.js'
import { selectMessagesEntities } from '../../slices/messagesState.js'
import MessageForm from './MessageForm.jsx'
import MessagesHeader from './MessageHeader.jsx'
import Message from './Message.jsx'

const MessagesComponent = () => {
  const allChannels = useSelector(selectChannelsEntities)
  const allMessages = useSelector(selectMessagesEntities)
  const currentChannelId = useSelector(selectCurrentChannelId)

  const activeChannel = useMemo(() =>
    Object.values(allChannels).find(({ id }) => id === currentChannelId),
  [allChannels, currentChannelId])

  const activeChannelMessages = useMemo(() =>
    Object.values(allMessages).filter(message => message.channelId === currentChannelId),
  [allMessages, currentChannelId])

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
