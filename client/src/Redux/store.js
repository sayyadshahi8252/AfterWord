import {configureStore} from '@reduxjs/toolkit'
import dataReducer from "./dataSlice/dataSlice"
import userReducer from './userSlice/userSlice'
import bookReducer from "./bookSlice/bookSlice"
import reviewReducer from "./reviewSlice/reviewSlice"
import commentReducer from "./commentSlice/commentSlice"
export const store=configureStore({
    reducer:{
       bookdata :dataReducer,
       users:userReducer,
       books:bookReducer,
       reviews:reviewReducer,
       comments:commentReducer
    }
})