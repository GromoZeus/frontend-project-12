import { createSlice } from '@reduxjs/toolkit'

import { actions as channelsStateActions } from './channelsState.js'
import channelsData from '../thunk/index.js'

const initialState = {
  modal: {
    isOpened: false,
    type: null,
    extra: null,
  },
  loading: false,
  currentChannelId: '1',
  defaultChannelId: '1',
}

const slice = createSlice({
  name: 'UI',
  initialState,
  reducers: {
    openModal: (state, { payload }) => {
      const { type, id } = payload
      state.modal.isOpened = true
      state.modal.type = type
      state.modal.extra = id ?? null
    },
    closeModal: (state) => {
      state.modal.isOpened = false
      state.modal.type = null
      state.modal.extra = null
    },
    setActualChannel(state, { payload }) {
      state.currentChannelId = payload
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(channelsStateActions.deleteChannel, (state, { payload }) => {
        if (state.currentChannelId === payload.id) {
          state.currentChannelId = state.defaultChannelId
        }
      })
      .addCase(channelsData.pending, (state) => {
        state.loading = true
      })
      .addCase(channelsData.fulfilled, (state) => {
        state.loading = false
        state.currentChannelId = state?.currentChannelId || state.defaultChannelId
      })
      .addCase(channelsData.rejected, (state) => {
        state.loading = false
      })
  },
})

export const selectIsOpenedModal = state => state.UIState.modal.isOpened
export const selectTypeModal = state => state.UIState.modal.type
export const selectChangedModal = state => state.UIState.modal.extra
export const selectChannelsLoading = state => state.UIState.loading
export const selectCurrentChannelId = state => state.UIState.currentChannelId

export const { actions } = slice
export default slice.reducer
