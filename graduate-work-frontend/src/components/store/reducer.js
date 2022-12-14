import { combineReducers } from 'redux'
import commentSlice from "./commentSlice";
import videoSlice from "./videoSlice";
import userSlice from "./userSlice";
import userDataSlice from './userDataSlice';
import messagesSlice from './messages';
import userListSlice from './userListSlice';

const reducer = combineReducers({
    comments: commentSlice,
    videos: videoSlice,
    users: userSlice,
    profileData: userDataSlice,
    messages: messagesSlice,
    userList: userListSlice,
});

export default reducer;