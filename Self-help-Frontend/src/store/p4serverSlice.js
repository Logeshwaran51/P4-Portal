import { createSlice } from "@reduxjs/toolkit"

const p4serverSlice = createSlice({
  name: "p4servers",
  initialState: "",
  reducers: {
    setServerReducer(state, action) {
      return action.payload
    }
  }
})

export default p4serverSlice.reducer

export let { setServerReducer } = p4serverSlice.actions
