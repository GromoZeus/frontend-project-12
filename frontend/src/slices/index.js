import { combineReducers, configureStore } from '@reduxjs/toolkit'
import authorizationState, { actions as authorizationStateActions } from './authorizationState.js'
import channelsState, { actions as channelsStateActions } from './channelsState.js'
import messagesState, { actions as messagesStateActions } from './messagesState.js'

const reducer = combineReducers({
  authorizationState,
  channelsState,
  messagesState,
})
export const actions = {
  ...authorizationStateActions,
  ...channelsStateActions,
  ...messagesStateActions,
}

export default configureStore({
  reducer,
})
