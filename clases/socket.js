import { Server } from 'socket.io';

import Contenedor from './databaseFS.js';

import Chat from '../clases/Chat.js';
import Product from './Product.js';

class Socket {  
    constructor(conn) {
        this.io = new Server(conn);
        this.productsFS = new Contenedor('productos');
        this.chatDB = new Chat();
        this.productDB = new Product();
        this.on();
    }

    on() {
        this.io.on('connection',
            async (socket) => {
                console.log('Usuario conectado');

                let products = await this.productDB.getAll()
                socket.emit('updateProducts', products);

                let messages = await this.chatDB.GetMessages();
                socket.emit('updateChat', messages)
            
                socket.on('webChat', (msg) => {
                    try {
                        this.chatDB.CreateMessage(msg).then(async (e) => {
                            let refreshChat = await this.chatDB.GetMessageById(e.payload[0]);
                           this.io.emit('webChat', refreshChat.payload) 
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