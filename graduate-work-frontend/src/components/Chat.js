import React, { useState, useRef, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux'
import { useParams } from 'react-router-dom';
import Navigation from "./Navbar";
import MyMessage from './MyMessage';
import OtherMessage from './OtherMessage.js';
import { commitMessage } from './store/messages';

function Chat() {

    const dispatch = useDispatch();
    const params = useParams();
    const bottomRef = useRef(null);
    const messages = useSelector((state) => state.storageData.messages.messages)
    const next_id = useSelector((state) => state.storageData.messages.max_id)
    const currentUser = useSelector((state) => state.storageData.users.username)
    const [text, setText] = useState('');

    function changeText(event) {
        setText(event.target.value);
    }

    const handleKeyDown = (event) => {
        if (event.key === 'Enter') {
            dispatch(commitMessage(
                {
                    user_from: currentUser,
                    user_to: params.user,
                    text: text,
                    id: next_id,
                }));
            setText("")
        }
    };

    useEffect(() => {
        bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

    const messageText = messages.filter((message) => (message.user_from === currentUser && message.user_to === params.user) || (message.user_to === currentUser && message.user_from === params.user)).map((message) =>
        message.user_from === currentUser ?
            <MyMessage key={message.id} user={currentUser} message={message.text} />
            :
            <OtherMessage key={message.id} user={message.user_from} message={message.text} />
    )

    return (
        <div>
            <Navigation />
            <div className="container mx-auto shadow-lg rounded-lg">

                <div className="flex flex-row justify-between bg-white max-h-96 overflow-y-scroll">
                    <div className="w-full px-5 flex flex-col justify-between">
                        <div className="flex flex-col mt-5">
                            {messageText}
                            <div ref={bottomRef} />
                        </div>

                    </div>
                </div>
                <div className="py-5 mx-5">
                    <input
                        className="w-full bg-gray-300 py-5 px-3 rounded-xl"
                        type="text"
                        placeholder="type your message here..."
                        value={text}
                        onChange={changeText}
                        onKeyDown={handleKeyDown}
                    />
                </div>
            </div>
        </div>
    )


}

export default Chat;