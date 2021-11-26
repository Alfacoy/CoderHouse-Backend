import { Server } from 'socket.io';

class Socket {  
    constructor(conn) {
        this.io = new Server(conn);
        this.on();
    }

    on() {
        this.io.on('connection',
            (socket) => { console.log('Usuario conectado'); });
    }

}

export default Socket;

