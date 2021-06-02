const http = require('http');
const WebSocket = require('ws');
const url = require('url');

const candle_5_mins_stream_btcusdt = 'wss://stream.binance.com:9443/ws/btcusdt@kline_5m';
const candle_5_mins_stream_ethusdt = 'wss://stream.binance.com:9443/ws/ethusdt@kline_5m';

const server = http.createServer();
const wss1 = new WebSocket(candle_5_mins_stream_btcusdt, {noServer: true});
const wss2 = new WebSocket(candle_5_mins_stream_ethusdt, {noServer: true});

wss1.on('message', (data) => {
    console.log('client connected to ws1')
    wss1.on('open', (data) => {
        console.log(data);
        wss1.send(data);
    });
});

wss2.on('message', (ws, request) => {
    wss2.on('open', (data) => {
        console.log('client connected to ws2');
        console.log(data);
        wss2.send(data);
    });
});

server.on('upgrade', (request, socket, head) => {
    const path = url.parse(request.url).pathname;

    if(path === '/ethusdt') {
        console.log('connected');
        wss2.handleUpgrade(request, socket, head, (ws) => {
            wss2.emit('open', ws, request);
        });
    } else if(path === '/btcusdt') {
        wss1.handleUpgrade(request, socket, head, (ws) => {
            wss1.emit('open', ws, request);
        });
    } else {
        socket.destroy();
    }
});

server.listen(8081);

/*const ws = new WebSocket(candle_5_mins_stream_btcusdt);

ws.on('message', (data) => {
    console.log(data);
});*/



