import { createSlice } from '@reduxjs/toolkit'
import { api } from '../api/user_api'

export const videoSlice = createSlice({
    name: 'videoData',
    initialState: {
        videos: [],
    },
    reducers: {
        videoSuccess: (state, action) => {
            state.videos = action.payload;
        },
        like: (state, action) => {
            const item = state.videos.find(video => video.id === action.payload)
            item.likes++;
        }
    },
});

const { videoSuccess, like } = videoSlice.actions

export default videoSlice.reducer

// Actions

export const fetchVideo = () => async dispatch => {
    try {
        await api.get('/videos')
            .then((responce) => dispatch(videoSuccess(responce.data)))
    }
    catch (e) {
        return console.error(e.message);
    }
}

export const likeVideo = (id) => async dispatch => {
    dispatch(like(id))
}