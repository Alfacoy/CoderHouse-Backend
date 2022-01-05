import { Server } from 'socket.io';
import  Chat  from './Chat.js';
import { product } from '../daos/index.js';

export default class Socket {  
    constructor(conn) {
        this.io = new Server(conn);
        this.chatDB = new Chat();
        this.on();
    }

    on() {
        this.io.on('connection',
            async (socket) => {
                console.log('Usuario conectado');

                let products = await product.getAll()
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