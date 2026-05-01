const net = require('net');

function portChecker(host, port) {
    return new Promise((resolve) => {
        const socket = new net.Socket();

        socket.setTimeout(5_000);

        socket.on('connect', () => {
            socket.destroy();
            resolve(true);
        });

        socket.on('timeout', () => {
            socket.destroy();
            resolve(false);
        });

        socket.on('error', () => {
            socket.destroy();
            resolve(false);
        });

        socket.connect(port, host);
    });
}

module.exports = { portChecker };