import { createSlice } from '@reduxjs/toolkit'

import { actions as channelsStateActions } from './channelsState.js'
import channelsData from '../thunk/fetchData.js'

const initialState = {
  modal: {
    isOpened: false,
    type: null,
    extra: null,
  },
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
      .addCase(channelsData.fulfilled, (state) => {
        state.currentChannelId = state?.currentChannelId || state.defaultChannelId
      })
  },
})

// Кастомные селекторы
export const selectIsOpenedModal = state => state.UIState.modal.isOpened
export const selectTypeModal = state => state.UIState.modal.type
export const selectChangedModal = state => state.UIState.modal.extra
export const selectCurrentChannelId = state => state.UIState.currentChannelId

export const { actions } = slice
export default slice.reducer
