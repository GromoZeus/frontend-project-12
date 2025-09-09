import { createSlice, createEntityAdapter } from '@reduxjs/toolkit'

import channelsData from '../thunk/index.js'

const channelsAdapter = createEntityAdapter({
  selectId: channel => channel.id,
  sortComparer: (a, b) => a.id - b.id,
})

const slice = createSlice({
  name: 'channelsState',
  initialState: channelsAdapter.getInitialState(),
  reducers: {
    addChannel(state, { payload }) {
      channelsAdapter.addOne(state, payload)
    },
    deleteChannel(state, { payload }) {
      channelsAdapter.removeOne(state, payload.id)
    },
    channelRename(state, { payload }) {
      const { id, name } = payload
      channelsAdapter.updateOne(state, {
        id,
        changes: { name },
      })
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(channelsData.fulfilled, (state, { payload }) => {
        channelsAdapter.setAll(state, payload.channels)
      })
  },
})

export const { actions } = slice

export const channelsSelectors = channelsAdapter.getSelectors(
  state => state.channelsState,
)

export const selectAllChannels = state => channelsSelectors.selectAll(state)
export const selectChannelsEntities = state => channelsSelectors.selectEntities(state)

export default slice.reducer
