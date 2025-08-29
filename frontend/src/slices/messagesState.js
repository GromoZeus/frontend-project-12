import { createSlice, createEntityAdapter } from '@reduxjs/toolkit'
import channelsData from '../thunk/fetchData.js'
import { actions as channelsStateActions } from './channelsState.js'

const { deleteChannel } = channelsStateActions

// Создаем адаптер для сообщений
const messagesAdapter = createEntityAdapter({
  selectId: message => message.id,
  sortComparer: (a, b) => new Date(a.createdAt) - new Date(b.createdAt), // сортировка по времени
})

const slice = createSlice({
  name: 'messagesInfo',
  initialState: messagesAdapter.getInitialState(),
  reducers: {
    addMessage: {
      reducer: (state, { payload }) => {
        messagesAdapter.addOne(state, payload)
      },
      prepare: message => ({ payload: message }),
    },
    // Дополнительные действия для полноты
    removeMessage: {
      reducer: (state, { payload }) => {
        messagesAdapter.removeOne(state, payload.id)
      },
      prepare: id => ({ payload: { id } }),
    },
    updateMessage: {
      reducer: (state, { payload }) => {
        messagesAdapter.updateOne(state, {
          id: payload.id,
          changes: payload.changes,
        })
      },
      prepare: (id, changes) => ({ payload: { id, changes } }),
    },
    clearMessages(state) {
      messagesAdapter.removeAll(state)
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(channelsData.fulfilled, (state, { payload }) => {
        // Устанавливаем все сообщения из payload
        messagesAdapter.setAll(state, payload.messages)
      })
      .addCase(deleteChannel, (state, { payload }) => {
        // Удаляем все сообщения удаленного канала
        const messagesToRemove = Object.values(state.entities)
          .filter(message => message.channelId === payload.id)
          .map(message => message.id)

        messagesAdapter.removeMany(state, messagesToRemove)
      })
  },
})

// Экспорт действий
export const { actions } = slice

// Селекторы адаптера
export const messagesSelectors = messagesAdapter.getSelectors(
  state => state.messagesInfo,
)

// Кастомные селекторы
export const selectAllMessages = state => messagesSelectors.selectAll(state)
export const selectMessageById = (state, id) => messagesSelectors.selectById(state, id)
export const selectMessagesEntities = state => messagesSelectors.selectEntities(state)
export const selectMessagesIds = state => messagesSelectors.selectIds(state)
export const selectMessagesTotal = state => messagesSelectors.selectTotal(state)

// Селектор для получения сообщений по channelId
export const selectMessagesByChannelId = (state, channelId) => {
  const allMessages = selectAllMessages(state)
  return allMessages.filter(message => message.channelId === channelId)
}

// Селектор для получения количества сообщений в канале
export const selectMessagesCountByChannelId = (state, channelId) => {
  const messages = selectMessagesByChannelId(state, channelId)
  return messages.length
}

export default slice.reducer
