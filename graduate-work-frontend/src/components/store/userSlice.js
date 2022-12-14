import { createSlice } from '@reduxjs/toolkit'
import { api } from '../api/user_api'

export const userSlice = createSlice({
    name: 'userData',
    initialState: {
        username: '',
        img: '',
    },
    reducers: {
        profileSuccess: (state, action) => {
            ({ username: state.username, img: state.img } = action.payload)
            state.isLoading = false;
        },
    },
});

const { profileSuccess } = userSlice.actions

export default userSlice.reducer

export const fetchProfile = () => async dispatch => {
    try {
        await api.get('/profile')
            .then((response) => dispatch(profileSuccess(response.data)))
    }
    catch (e) {
        return console.error(e.message);
    }
}