import { configureStore } from '@reduxjs/toolkit';
import userReducer from "../features/userSlice"
const store = configureStore({
  reducer: {
    user: userReducer,
  },
  // You can add middleware and other store configurations here
});

export default store;