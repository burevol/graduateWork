import { configureStore } from '@reduxjs/toolkit'
import reducer from './reducer'

const store = configureStore({
  reducer: {
    storageData: reducer,
  }
});

export default store;