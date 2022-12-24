import {useState, useRef, useEffect} from 'react';
import {useSelector, useDispatch} from 'react-redux'
import {useParams} from 'react-router-dom';
import MyMessage from './MyMessage';
import OtherMessage from './OtherMessage.js';
import {commitMessage} from './store/messages';

function Chat() {


    const dispatch = useDispatch();
    const params = useParams();
    const bottomRef = useRef(null);
    const next_id = useSelector((state) => state.storageData.messages.max_id)
    const {user: currentUser} = useSelector((state) => state.storageData.auth);
    const [text, setText] = useState('');
    const URL = `ws://127.0.0.1:8000/ws/messenger/?token=${currentUser.access_token}`;
    const [ws, setWs] = useState(new WebSocket(URL));
    const [message, setMessage] = useState([]);
    const [messages, setMessages] = useState([]);
    const [users, setUsers] = useState([])

    function changeText(event) {
        setText(event.target.value);
    }

    const handleKeyDown = (event) => {
        if (event.key === 'Enter') {
            ws.send(JSON.stringify({
                command: 'message',
                user_to: params.user,
                message: text
            }))
            setText("")
        }
    };

    useEffect(() => {
        ws.onopen = () => {
            console.log('WebSocket Connected');
            ws.send(JSON.stringify({
                command: 'enter_private',
                message: params.user
            }))
            ws.send(JSON.stringify({
                command: 'get_messages',
                message: params.user
            }))
            ws.send(JSON.stringify({
                command: 'get_users',
                message: ''
            }))
        }

        ws.onmessage = (e) => {
            const message = JSON.parse(e.data);
            switch (message.type) {
                case 'message':
                    console.log(message.message)
                    setMessages([...messages, message.message])
                    break;
                case 'message_history':
                    setMessages(message.message)
                    break;
                case 'users':
                    setUsers(JSON.parse(message.message))
                    break;
            }
        }

        return () => {
            ws.onclose = () => {
                console.log('WebSocket Disconnected');
                setWs(new WebSocket(URL));
            }
        }
    }, [ws.onmessage, ws.onopen, ws.onclose, messages]);

    useEffect(() => {
        bottomRef.current?.scrollIntoView({behavior: 'smooth'});
    }, [messages]);


    const messageText = messages.map((message) =>
        message.user_from === currentUser.user.pk ?
            <MyMessage key={message.pk} user={currentUser.user.pk} message={message.message}/>
            :
            <OtherMessage key={message.pk} user={message.user_from} message={message.message}/>
    )

    const selectChat = (user) => {
        ws.send(JSON.stringify({
            command: 'enter_private',
            message: user
        }))
        ws.send(JSON.stringify({
                command: 'get_messages',
                message: params.user
            }))
    }

    const users_html = users.map((user) => <div key={user[0]} className="text-lg px-0 font-semibold cursor-pointer" onClick={() => {selectChat(user[0])}}>{user[1]}</div>)

    return (
        <div>
            <div className="container mx-auto shadow-lg rounded-lg">
                <div className="px-2 py-5 flex justify-between items-center bg-white border-b-2">
                    <div className="flex flex-row justify-between bg-white px-auto w-full">

                        <div
                            className="flex flex-row py-4 px-2 justify-start items-start-l border-b-2"
                        >
                            <div className="w-1/5">
                            </div>
                            <div className="w-full">
                                {users_html}

                            </div>
                        </div>


                        <div className="flex flex-row justify-between bg-white max-h-96 overflow-y-scroll w-4/5">
                            <div className="w-full px-2 flex flex-col justify-between">
                                <div className="flex flex-col mt-5">
                                    {messageText}
                                    <div ref={bottomRef}/>
                                </div>

                            </div>
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