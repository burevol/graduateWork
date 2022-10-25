import fetch from "node-fetch";
import {WebSocket} from "ws";

let token = null
let chatSocket = null

function connect()
{
    chatSocket = new WebSocket(`ws://127.0.0.1:8000/ws/messenger/?token=${token}`);

    chatSocket.onopen = function () {
        console.log('Successfully connected to the WebSocket.')
        chatSocket.send(JSON.stringify({
            'command': 'ping',
            'message': 'ping',

        }));
    }

    chatSocket.onclose = function () {
        console.log('WebSocket connection closed unexpectedly. Trying to reconnect...');
        setTimeout(function () {
            console.log("Reconnecting...");
            connect();
        }, 2000);
    }

    chatSocket.onmessage = function (e) {
        const data = JSON.parse(e.data);
        switch (data.type) {
            case "chat_message":
                console.log(`${data.user}: ${data.message}`);
                break;
            case "pong":
                console.log(`${data.user}: ${data.message}`);
                break;
            default:
                console.error("Unknown message type!");
                break;
        }
    }
    chatSocket.onerror = function (err) {
        console.log("WebSocket encountered an error: " + err.message);
        console.log("Closing the socket.");
        chatSocket.close();
    }
}

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

