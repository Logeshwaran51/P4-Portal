import { configureStore } from "@reduxjs/toolkit"
import p4serverSliceReducer from "./p4serverSlice"
import userSlice from "./userSlice"

export const store = configureStore({
  reducer: {
    p4server: p4serverSliceReducer,
    userName: userSlice
  }
})
