const WebSocket = require('ws');
const { exec } = require('child_process');

const wsUrl = 'wss://ws.dogechain.info/inv';
const address = 'D5fU3G4PbChT3CeCaXJuysiiWi5aKBivY7';
let socket = null;

function connectWebSocket() {
    socket = new WebSocket(wsUrl);
    const pingInterval = setInterval(() => {
        if (socket.readyState === WebSocket.OPEN) {
            socket.ping();
        } else {
            clearInterval(pingInterval);
        }
    }, 30000);
    socket.on('pong', () => {
        console.log('Received pong from server.');
    });
    socket.onopen = () => {
        console.log('WS opened..');
        const subscriptionRequest = {
            op: 'blocks_sub'
        };
        socket.send(JSON.stringify(subscriptionRequest));
    };
    socket.onmessage = (event) => {
        const data = JSON.parse(event.data);
        if (data.op === 'status' && data.msg === 'subscribed') {
            console.log('Subscribed..');
        } else if (data.op === 'block' && data.x) {
            const nextBlockHex = Buffer.from(`${data.x.height + 1}.dogemap`, 'utf-8').toString('hex');
            const command = `cd ../inscription-wallet && ` +
                `node . mint ${address} "text/plain;charset=utf-8" ${nextBlockHex}`;
            console.log(`New block ${data.x.height}, next block ${data.x.height + 1}`);
            exec(command, (error, res, err) => {
                if (error) {
                    console.error(`Error : ${error}`);
                    console.error(`Command err: ${err}`);
                } else {
                    console.log(`Command output: ${res}`);
                }
                // socket.close();
            });
        }
    };
    socket.onclose = (event) => {
        if (event.wasClean) {
            console.log(`WS connection closed`);
            connectWebSocket();
        } else {
            console.error('WS connection closed!');
            setTimeout(connectWebSocket, 1000);
        }
    };
    socket.onerror = (error) => {
        console.error('WS error:', error);
        setTimeout(connectWebSocket, 5000);
    };
}
connectWebSocket();
