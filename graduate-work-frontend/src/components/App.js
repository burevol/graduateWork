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
import EditForm from "./EditForm";
import Subscriptions from "./Subscriptions";


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
                <Route path='/subscriptions' element={<Subscriptions/>}/>
                <Route path="/login" element={<Login/>}/>
                <Route path="/register" element={<Register/>}/>
                <Route path="/edit/:id" element={<EditForm/>} />
            </Routes>
        </div>
    );
}

export default App;