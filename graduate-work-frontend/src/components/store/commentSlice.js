import { createSlice } from '@reduxjs/toolkit'
import { api } from '../api/user_api'

export const commentSlice = createSlice({
    name: 'commentData',
    initialState: {
        comments: []
    },
    reducers: {
        commentSuccess: (state, action) => {
           state.comments = action.payload;
        },
        add: (state, action) => {
            const maxid = Math.max(...state.comments.map(o => o.id))
            state.comments = [...state.comments, {...action.payload, id: maxid+1}]
        }
    },
})

const { commentSuccess, add } = commentSlice.actions

export default commentSlice.reducer

export const fetchComments = (videoId) => async dispatch => {
    try {
        await api.get(`/comments?videoId=${videoId}`)
            .then((response) => dispatch(commentSuccess(response.data)))
    }
    catch (e) {
        return console.error(e.message);
    }
}

export const addComment = (author, body, videoId) => async dispatch => {
    dispatch(add({author: author, body: body, videoId: videoId}))
}