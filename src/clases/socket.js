import { Server } from 'socket.io';

import Contenedor from './databaseFS.js';

class Socket {  
    constructor(conn) {
        this.io = new Server(conn);
        this.productsFS = new Contenedor('productos');
        this.messageFS = new Contenedor('chat');
        this.on();
    }

    on() {
        this.io.on('connection',
            async (socket) => {
                console.log('Usuario conectado');

                let productos = await this.productsFS.getAll()
                socket.emit('updateProducts', productos);

                let mensajes = await this.messageFS.getAll();
                socket.emit('updateChat', mensajes)
            
                socket.on('webChat', (msg) => {
                    try {
                        const obj = {
                            ...msg, date: Date()
                        }
                        this.messageFS.save(obj).then(() => {
                           this.io.emit('webChat', obj) 
                        });
                    } catch (err) {
                        console.log(err);
                        console.log('Error al guardar los mensajes.')
                    }
                })

                // Disconnect
                socket.on('disconnect', () => {
                    console.log(`Un usuario se ha desconectado`)
                })
            })
    }
}

export default Socket;