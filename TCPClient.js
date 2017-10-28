'use strict'
const net = require('net');
const EventEmitter = require('events');
const util = require('util');

function Listener (opts) {
    this.send = send;
    let listener = this;

    let queue = [];
    let isBusy = true;
    let socket;

    connect(opts);

    function send (data) {
        queue.push(data);

        if (isBusy)
            return;

        isBusy = true;
        next();
    }

    function next() {
        if (queue.length == 0)
            return (isBusy = false);

        if (socket) {
            socket.write(data + '|', function (err) {
                if (err)
                    return socket.emit('error', err);
                queue.shift();
                next();
            });
        }
    }

    function connect (opts) {
        socket = net.connect({host: opts.host, port: opts.port});
        queue = [];
        isBusy = true;

        socket.on('connect', () => {
            isBusy = false;
            listener.emit('connect');
        });

        let buffer = '';
        socket.on('data', function(chunk) {
            buffer += chunk;
            let msgs = buffer.split('|');
            buffer = msgs.pop();

            msgs.forEach((msg) => listener.emit('message', msg));
        });

        socket.on('close', () => listener.emit('disconect'));
        socket.on('error', (err) => listener.emit('error', err));
    }
}
util.inherits(Listener, EventEmitter);

let listener = new Listener({host: 'localhost', port: 8000});
listener.on('connect', () => console.log("connected"));
listener.on('disconnect', () => console.log("disconnected"));
listener.on('error', (err) => console.log(err));
listener.on('message', (msg) => console.log(msg));
listener.send('Hello world'); // between connect and disconnect;
