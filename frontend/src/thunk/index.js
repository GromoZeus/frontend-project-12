import { createAsyncThunk } from '@reduxjs/toolkit'
import axios from 'axios'
import getPath from '../path.js'

const chatData = createAsyncThunk(
  'initState/setState',
  async (token, { rejectWithValue }) => {
    try {
      const [channelsResponse, messagesResponse] = await Promise.all([
        axios.get(getPath.channelsPath(), { headers: { Authorization: `Bearer ${token}` } }),
        axios.get(getPath.messagesPath(), { headers: { Authorization: `Bearer ${token}` } }),
      ])

      return {
        channels: channelsResponse.data,
        messages: messagesResponse.data,
      }
    }
    catch (error) {
      return rejectWithValue(error.response?.data || error.message)
    }
  },
)

export default chatData
