import { createSlice } from '@reduxjs/toolkit'

export const messagesSlice = createSlice({
    name: 'messagesData',
    initialState: {
        messages: [
            {
                id: 1,
                user_from: "User1",
                user_to: "User2",
                text: "Первое сообщение"
            },
            {
                id: 2,
                user_from: "User1",
                user_to: "User2",
                text: "Второе сообщение"
            },
            {
                id: 3,
                user_from: "User2",
                user_to: "User1",
                text: "Третье сообщение"
            },
        ],
        max_id: 4,
    },
    reducers: {
        addMessage: (state, action) => {
            state.messages = [...state.messages, action.payload];
            state.max_id ++;
        },
    },
});

export default messagesSlice.reducer

const { addMessage } = messagesSlice.actions

export const commitMessage = (message) => async dispatch => {
    dispatch(addMessage(message))
  
}




