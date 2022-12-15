import { combineReducers } from 'redux'
import commentSlice from "./commentSlice";
import videoSlice from "./videoSlice";
import userSlice from "./userSlice";
import userDataSlice from './userDataSlice';
import messagesSlice from './messages';
import userListSlice from './userListSlice';
import authReducer from "./auth";
import messageReducer from "./message";

const reducer = combineReducers({
    comments: commentSlice,
    videos: videoSlice,
    users: userSlice,
    profileData: userDataSlice,
    messages: messagesSlice,
    userList: userListSlice,
    auth: authReducer,
    message: messageReducer,
});

export default reducer;