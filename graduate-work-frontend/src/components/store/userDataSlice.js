import { createSlice } from '@reduxjs/toolkit'
import { api } from '../api/user_api'

export const profileSlice = createSlice({
    name: 'profileData',
    initialState: {
        username: '',
        img: '',
    },
    reducers: {
        profileSuccess: (state, action) => {
            ({ username: state.username, img: state.img } = action.payload[0])
            state.isLoading = false;
            console.log(state.username)
        },
    },
});

const { profileSuccess } = profileSlice.actions

export default profileSlice.reducer

export const fetchProfile = (user) => async dispatch => {
    try {
        await api.get(`/users?username=${user}`)
            .then((response) => dispatch(profileSuccess(response.data)))
    }
    catch (e) {
        return console.error(e.message);
    }
}