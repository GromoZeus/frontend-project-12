import { combineReducers, configureStore } from '@reduxjs/toolkit'
import channelsState, { actions as channelsStateActions } from './channelsInfo.js'
import messagesState, { actions as messagesStateActions } from './messagesInfo.js'

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
