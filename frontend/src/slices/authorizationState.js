import { createSlice } from '@reduxjs/toolkit'

const initialState = () => {
  try {
    const userData = localStorage.getItem('userId')
    if (userData) {
      const parsedData = JSON.parse(userData)
      return {
        userName: parsedData.username || null,
        userToken: parsedData.token || null,
      }
    }
  }
  catch (error) {
    console.error('Error parsing user data from localStorage:', error)
  }

  return {
    userName: null,
    userToken: null,
  }
}

const slice = createSlice({
  name: 'authorizationState',
  initialState,
  reducers: {
    authorization: (state, { payload }) => ({
      userName: payload.name,
      userToken: payload.token,
    }),
  },
})

export const { actions } = slice

export default slice.reducer
