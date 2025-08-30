import { combineReducers, configureStore } from '@reduxjs/toolkit'
import channelsState, { actions as channelsStateActions } from './channelsState.js'
import messagesState, { actions as messagesStateActions } from './messagesState.js'

const reducer = combineReducers({
  channelsState,
  messagesState,
})
export const actions = {
  ...channelsStateActions,
  ...messagesStateActions,
}

export default configureStore({
  reducer,
})
