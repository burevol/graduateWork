import React from 'react';
import {Routes, Route} from 'react-router-dom';
import Main from "./Main";
import Profile from './Profile';
import VideoPage from "./VideoPage";
import UploadForm from "./UploadForm";
import Chat from "./Chat";
import Login from "./Login";
import Navigation from "./Navbar";
import Register from "./Register";


function App() {
    return (
        <div>
           <Navigation/>
            <Routes>
                <Route path="/" element={<Main/>}/>
                <Route path='/profile' element={<Profile/>}/>
                <Route path='/video/:id' element={<VideoPage/>}/>
                <Route path='/profile/upload' element={<UploadForm/>}/>
                <Route path='/user/:user' element={<Profile/>}/>
                <Route path='/chat/:user' element={<Chat/>}/>
                <Route path='/my_subscribes' element={<Chat/>}/>
                <Route path="/login" element={<Login/>}/>
                <Route path="/register" element={<Register/>}/>
            </Routes>
        </div>
    );
}

export default App;