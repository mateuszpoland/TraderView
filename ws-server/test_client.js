const WebSocket = require('ws');

const ws = new WebSocket('ws://localhost:8081/ethusdt');

ws.on('message', (data) => {
    console.log(data);
});
