import fetch from "node-fetch";
import {WebSocket} from "ws";

let token = null
let chatSocket = null



fetch(`http://127.0.0.1:8000/api/auth-token/`, {
    method: 'POST',
    headers: {
        'Content-Type': 'application/json',
    },
    body: JSON.stringify({
        "username": 'user3',
        "password": '1Qaz2WsxOP',
    })
}).then(response => {
    return response.json();
}).then((data) => {
    // Получить данные профиля
    token = data.token;
    console.log(`Logged in. Got the token ${token}`);
    connect();
}).catch((error) => {
    console.error('Error:', error);
});

