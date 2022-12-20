import { createSlice } from '@reduxjs/toolkit'
import { api } from '../api/main_api'

export const profileSlice = createSlice({
    name: 'profileData',
    initialState: {
        username: '',
        img: '',
    },
    reducers: {
        profileSuccess: (state, action) => {
            ({ username: state.username, avatar: state.img } = action.payload)
            state.isLoading = false;
        },
    },
});

const { profileSuccess } = profileSlice.actions

export default profileSlice.reducer

export const fetchProfile = (userId) => async dispatch => {
    try {
        await api.get(`/api/user/${userId}`)
            .then((response) => dispatch(profileSuccess(response.data)))
    }
    catch (e) {
        return console.error(e.message);
    }
}