import { createAsyncThunk } from '@reduxjs/toolkit'
import axios from 'axios'
import getPath from '../path.js'

const channelsData = createAsyncThunk(
  'channelsState/setState',
  async (token, { rejectWithValue }) => {
    try {
      const response = await axios.get(getPath.channelsPath(), { headers: { Authorization: `Bearer ${token}` } })
      return response.data
    }
    catch (error) {
      return rejectWithValue(error.response.data)
    }
  },
)

export default channelsData
