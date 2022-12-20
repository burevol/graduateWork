import React from "react";
import {BrowserRouter} from "react-router-dom";
import {createRoot} from 'react-dom/client';
import store from './components/store/store'
import {Provider} from 'react-redux'
import App from "./components/App";
import {GoogleOAuthProvider} from '@react-oauth/google';
import './style.css';

const container = document.getElementById('root');
const root = createRoot(container);
root.render(
    <React.StrictMode>
        <GoogleOAuthProvider clientId="5299415701-v4k6hbeontp98bklokhf4q17do396nua.apps.googleusercontent.com">
            <BrowserRouter>
                <Provider store={store}>
                    <App/>
                </Provider>
            </BrowserRouter>
        </GoogleOAuthProvider>
    </React.StrictMode>
);
