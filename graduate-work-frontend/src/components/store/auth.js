import {createSlice, createAsyncThunk} from "@reduxjs/toolkit";
import {setMessage} from "./message";

import AuthService from "../services/auth.service";
import {api} from "../api/main_api";
import axios from "axios";

const REFRESH_TOKEN = "REFRESH_TOKEN";

const user = JSON.parse(localStorage.getItem("user"));

export const register = createAsyncThunk(
    "auth/register",
    async ({username, email, password, phone}, thunkAPI) => {
        try {
            const response = await AuthService.register(username, email, password, phone);
            thunkAPI.dispatch(setMessage(response.data.message));
            return response.data;
        } catch (error) {
            const message =
                (error.response &&
                    error.response.data &&
                    error.response.data.message) ||
                error.message ||
                error.toString();
            thunkAPI.dispatch(setMessage(message));
            return thunkAPI.rejectWithValue();
        }
    }
);

export const googleLogin = createAsyncThunk(
    "auth/login",
    async ({access_token}, thunkAPI) => {
        try {
            const login_info = await AuthService.googleLogin(access_token);
            if (login_info.data.access_token) {
                localStorage.setItem("user", JSON.stringify(login_info.data));
            }
            return {user: login_info.data};
        } catch (error) {
            const message =
                (error.response &&
                    error.response.data &&
                    error.response.data.message) ||
                error.message ||
                error.toString();
            thunkAPI.dispatch(setMessage(message));
            return thunkAPI.rejectWithValue();
        }
    }
);

export const login = createAsyncThunk(
    "auth/login",
    async ({username, password}, thunkAPI) => {
        try {
            const data = await AuthService.login(username, password);
            if (data.access_token) {
                localStorage.setItem("user", JSON.stringify(data));
            }
            return {user: data};
        } catch (error) {
            const message =
                (error.response &&
                    error.response.data &&
                    error.response.data.message) ||
                error.message ||
                error.toString();
            thunkAPI.dispatch(setMessage(message));
            return thunkAPI.rejectWithValue();
        }
    }
);

export const refreshToken = (accessToken) => (dispatch) => {
    dispatch(refreshToken(accessToken));
}

export const logout = createAsyncThunk(
    "auth/logout",
    async () => {
        await AuthService.logout();
    });

const initialState = user
    ? {isLoggedIn: true, subscriptions: [], banned: [], user}
    : {isLoggedIn: false, subscriptions: [], banned: [], user: null};

const authSlice = createSlice({
    name: "auth",
    initialState,
    reducers: {
        setSubscriptions: (state, action) => {
            state.subscriptions = action.payload;
        },
        setBanned: (state, action) => {
            state.banned = action.payload;
        },
        refreshToken: (state, action) => {
            state.user.access_token = action.payload;
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(register.fulfilled, state => {
                state.isLoggedIn = false
            })
            .addCase(register.rejected, state => {
                state.isLoggedIn = false
            })
            .addCase(login.fulfilled, (state, action) => {
                state.isLoggedIn = true;
                state.user = action.payload.user;
                asyncSubscribe(state.user.access_token);
            })
            .addCase(login.rejected, state => {
                state.isLoggedIn = false;
                state.user = null;
            })
            .addCase(logout.fulfilled, state => {
                state.isLoggedIn = false;
                state.user = null;
            })
    },
});

const {setSubscriptions, setBanned} = authSlice.actions

export const fetchSubscriptions = (token) => async dispatch => {
    try {
        const config = {
            headers: {
                'Authorization': 'Bearer ' + token
            }
        };
        await api.get(`/api/subscribe/`, config)
            .then((response) => dispatch(setSubscriptions(response.data)))
    } catch (e) {
        return console.error(e.message);
    }
}

export const fetchBanned = (token) => async dispatch => {
    try {
        const config = {
            headers: {
                'Authorization': 'Bearer ' + token
            }
        };
        await api.get(`/api/ban/`, config)
            .then((response) => dispatch(setBanned(response.data)))
    } catch (e) {
        return console.error(e.message);
    }
}

function urlB64ToUint8Array(base64String) {
    const padding = '='.repeat((4 - base64String.length % 4) % 4);
    const base64 = (base64String + padding)
        .replace(/\-/g, '+')
        .replace(/_/g, '/');

    const rawData = window.atob(base64);
    const outputArray = new Uint8Array(rawData.length);
    const outputData = outputArray.map((output, index) => rawData.charCodeAt(index));

    return outputData;
}

const asyncSubscribe = async (token) => {
    if ('serviceWorker' in navigator) {
        await navigator.serviceWorker.getRegistration().then(r => subscribe(r, token)).catch((err) => {
            console.log(err)
        });
    }
}


const subscribe = async (reg, token) => {
    const subscription = await reg.pushManager.getSubscription();
    if (subscription) {
        await sendSubData(subscription, token);
        return;
    }

    const key = "BPdMGEsjYmFlPN2Q1tjvU6UfBBa8pad4gT3KPF98pcsfaYXpz-XhTYI-Q0YpBUBZ6KtlqUAZ9CnbAnT9Jd3Bx10";
    const options = {
        userVisibleOnly: true,
        // if key exists, create applicationServerKey property
        ...(key && {applicationServerKey: urlB64ToUint8Array(key)})
    };

    const sub = await reg.pushManager.subscribe(options);
    await sendSubData(sub, token)
};

const sendSubData = async (subscription, token) => {
    const browser = navigator.userAgent.match(/(firefox|msie|chrome|safari|trident)/ig)[0].toLowerCase();
    const data = {
        status_type: 'subscribe',
        subscription: subscription.toJSON(),
        browser: browser,
    };
    const config = {
        headers: {
            'Authorization': 'Bearer ' + token,
            'content-type': 'application/json'
        }
    };

    await axios.post('http://127.0.0.1:8000/webpush/save_information', JSON.stringify(data), config).then((res) => {
        console.log(res)
    })
        .catch((e) => {
            console.error(e);
        });
};

const {reducer} = authSlice;
export default reducer;