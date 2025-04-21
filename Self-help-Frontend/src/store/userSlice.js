import { createSlice } from "@reduxjs/toolkit"

const userSlice = createSlice({
  name: "userName",
  initialState: "",
  reducers: {
    setUserReducer(state, action) {
      return action.payload
    }
  }
})

export default userSlice.reducer

export let { setUserReducer } = userSlice.actions
