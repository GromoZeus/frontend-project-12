import { createSlice, createEntityAdapter } from '@reduxjs/toolkit'
import channelsData from '../thunk/fetchData.js'
import { actions as channelsStateActions } from './channelsState.js'

const { deleteChannel } = channelsStateActions

const messagesAdapter = createEntityAdapter({
  selectId: message => message.id,
  sortComparer: (a, b) => new Date(a.createdAt) - new Date(b.createdAt),
})

const slice = createSlice({
  name: 'messagesState',
  initialState: messagesAdapter.getInitialState(),
  reducers: {
    addMessage(state, { payload }) {
      messagesAdapter.addOne(state, payload)
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(channelsData.fulfilled, (state, { payload }) => {
        messagesAdapter.setAll(state, payload.messages)
      })
      .addCase(deleteChannel, (state, { payload }) => {
        const messagesToRemove = Object.values(state.entities)
          .filter(message => message.channelId === payload.id)
          .map(message => message.id)

        messagesAdapter.removeMany(state, messagesToRemove)
      })
  },
})

export const { actions } = slice

export const messagesSelectors = messagesAdapter.getSelectors(
  state => state.messagesState,
)

// Кастомные селекторы
// export const selectAllMessages = state => messagesSelectors.selectAll(state)
// export const selectMessageById = (state, id) => messagesSelectors.selectById(state, id)
export const selectMessagesEntities = state => messagesSelectors.selectEntities(state)
// export const selectMessagesIds = state => messagesSelectors.selectIds(state)
// export const selectMessagesTotal = state => messagesSelectors.selectTotal(state)

// Селектор для получения сообщений по channelId
// export const selectMessagesByChannelId = (state, channelId) => {
//   const allMessages = selectAllMessages(state)
//   return allMessages.filter(message => message.channelId === channelId)
// }

// Селектор для получения количества сообщений в канале
// export const selectMessagesCountByChannelId = (state, channelId) => {
//   const messages = selectMessagesByChannelId(state, channelId)
//   return messages.length
// }

export default slice.reducer
