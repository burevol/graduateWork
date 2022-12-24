import {createSlice, createAsyncThunk} from "@reduxjs/toolkit";
import {setMessage} from "./message";

import AuthService from "../services/auth.service";
import {api} from "../api/main_api";
import {commentSlice} from "./commentSlice";

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

const { setSubscriptions, setBanned } = authSlice.actions

export const fetchSubscriptions = (token) => async dispatch => {
    try {
         const config = {
            headers: {
                'Authorization': 'Bearer ' + token
            }
        };
        await api.get(`/api/subscribe/`, config)
            .then((response) => dispatch(setSubscriptions(response.data)))
    }
    catch (e) {
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
    }
    catch (e) {
        return console.error(e.message);
    }
}

const {reducer} = authSlice;
export default reducer;