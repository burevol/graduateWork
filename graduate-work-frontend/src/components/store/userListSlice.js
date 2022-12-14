import { createSlice } from '@reduxjs/toolkit'
import { api } from '../api/user_api'

export const userListSlice = createSlice({
    name: 'userList',
    initialState: {
        userList: [],
    },
    reducers: {
        profileSuccess: (state, action) => {
            state.userList = action.payload
            state.isLoading = false;
        },
    },
});

const { profileSuccess } = userListSlice.actions

export default userListSlice.reducer

export const fetchUsers = () => async dispatch => {
    try {
        await api.get('/users')
            .then((response) => dispatch(profileSuccess(response.data)))
    }
    catch (e) {
        return console.error(e.message);
    }
}