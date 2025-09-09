import { createSlice, createEntityAdapter } from '@reduxjs/toolkit'

import channelsData from '../thunk/index.js'
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

export const selectMessagesEntities = state => messagesSelectors.selectEntities(state)

export default slice.reducer
