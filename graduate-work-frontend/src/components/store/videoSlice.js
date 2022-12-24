import {createSlice} from '@reduxjs/toolkit'
import {api} from '../api/main_api'

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
            item.likes_count++;
        }
    },
});

const {videoSuccess, like} = videoSlice.actions

export default videoSlice.reducer

// Actions

export const fetchVideo = (token) => async dispatch => {
    try {
        let config = {}
        if (token) {
            config = {
                headers: {
                    'Authorization': 'Bearer ' + token
                }
            };
        }
        await api.get('/api/video', config)
            .then((response) => dispatch(videoSuccess(response.data)))
    } catch (e) {
        return console.error(e.message);
    }
}

export const fetchSubscriptions = (token) => async dispatch => {
    try {
        const config = {
            headers: {
                'Authorization': 'Bearer ' + token
            }
        };
        await api.get('api/subscriptions/', config)
            .then((response) => dispatch(videoSuccess(response.data)))
    } catch (e) {
        return console.error(e.message);
    }
}

export const likeVideo = (id) => async dispatch => {
    dispatch(like(id))
}