import { createSlice, createEntityAdapter } from '@reduxjs/toolkit'
import channelsData from '../thunk/index.js'

const channelsAdapter = createEntityAdapter({
  selectId: channel => channel.id,
  sortComparer: (a, b) => a.id - b.id,
})

// const defaultCurrentChannelId = '1'

const slice = createSlice({
  name: 'channelsState',
  initialState: channelsAdapter.getInitialState({
    // loading: false,
    // currentChannelId: defaultCurrentChannelId,
    // newChannelId: null, // дополнительное поле для нового канала
  }),
  reducers: {
    // setActualChannel(state, { payload }) {
    //   state.currentChannelId = payload
    // },
    addChannel(state, { payload }) {
      // state.newChannelId = payload.id
      channelsAdapter.addOne(state, payload)
    },
    deleteChannel(state, { payload }) {
      channelsAdapter.removeOne(state, payload.id)
      // if (state.currentChannelId === payload.id) {
      //   state.currentChannelId = defaultCurrentChannelId
      // }
      // Сбрасываем newChannelId если удаляем новый канал
      // if (state.newChannelId === payload.id) {
      // //   state.newChannelId = null
      // }
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
      // .addCase(channelsData.pending, (state) => {
      //   state.loading = true
      // })
      .addCase(channelsData.fulfilled, (state, { payload }) => {
        // state.loading = false
        channelsAdapter.setAll(state, payload.channels)
        // state.currentChannelId = payload.channels?.currentChannelId || defaultCurrentChannelId
        // state.newChannelId = null
      })
      // .addCase(channelsData.rejected, (state) => {
      //   state.loading = false
      // })
  },
})

export const { actions } = slice

export const channelsSelectors = channelsAdapter.getSelectors(
  state => state.channelsState,
)

export const selectAllChannels = state => channelsSelectors.selectAll(state)
export const selectChannelsEntities = state => channelsSelectors.selectEntities(state)

export default slice.reducer
