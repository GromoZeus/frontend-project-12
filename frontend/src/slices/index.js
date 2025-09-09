import { combineReducers, configureStore } from '@reduxjs/toolkit'

import authorizationState, { actions as authorizationStateActions } from './authorizationState.js'
import channelsState, { actions as channelsStateActions } from './channelsState.js'
import messagesState, { actions as messagesStateActions } from './messagesState.js'
import UIState, { actions as UIStateActions } from './UIState.js'

const reducer = combineReducers({
  authorizationState,
  channelsState,
  messagesState,
  UIState,
})
export const actions = {
  ...authorizationStateActions,
  ...channelsStateActions,
  ...messagesStateActions,
  ...UIStateActions,
}

export default configureStore({
  reducer,
})
