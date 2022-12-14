import React, { useEffect } from 'react';
import { Routes, Route } from 'react-router-dom';
import { useDispatch } from 'react-redux'
import Main from "./Main";
import Profile from './Profile';
import VideoPage from "./VideoPage";
import UploadForm from "./UploadForm";
import Chat from "./Chat";
import { fetchProfile } from "./store/userSlice";
import { fetchUsers } from './store/userListSlice';

function App() {
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(fetchProfile());
    dispatch(fetchUsers());
}, [dispatch]);

    return (
      <div>
          <Routes>
            <Route path="/" element={<Main/>} />
            <Route path='/profile' element={<Profile/>} />
            <Route path='/video/:id' element={<VideoPage/>} />
            <Route path='/profile/upload' element={<UploadForm/>} />
            <Route path='/user/:user' element={<Profile />} />
            <Route path='/chat/:user' element={<Chat/>} />
            <Route path='/my_subscribes' element={<Chat/>} />
          </Routes>
      </div>
    );
}

export default App;