const http = require('http');
const WebSocket = require('ws');
const url = require('url');

const candle_5_mins_stream_btcusdt = 'wss://stream.binance.com:9443/ws/btcusdt@kline_5m';
const candle_5_mins_stream_ethusdt = 'wss://stream.binance.com:9443/ws/ethusdt@kline_5m';

const server = http.createServer();

const wsServer1 = new WebSocket.Server({ noServer: true });
const wsServer2 = new WebSocket.Server({ noServer: true });


wsServer1.on('connection', (websocket) => {
    console.log('client connected to btc/usdt stream');
    const wsc = new WebSocket(candle_5_mins_stream_btcusdt);
    wsc.on('message', (data) => {
        websocket.send(data);
    });
})

wsServer2.on('connection', (websocket) => {
    console.log('client connected to eth/usd stream');
    const wsc = new WebSocket(candle_5_mins_stream_ethusdt);
    wsc.on('message', (data) => {
        websocket.send(data);
    });
})

server.on('upgrade', (request, socket, head) => {
    const path = url.parse(request.url).pathname;

    if(path === '/ethusdt') {
        wsServer2.handleUpgrade(request, socket, head, (ws) => {
            wsServer2.emit('connection', ws, request);
        });
    } else if(path === '/btcusdt') {
        wsServer1.handleUpgrade(request, socket, head, (ws) => {
            wsServer1.emit('connection', ws, request);
        });
    } else {
        console.log('destroying');
        socket.destroy();
    }
});

process.on('uncaughtException', (err) => {
    console.log('error occurred: ', err);
});

server.listen(8081);




