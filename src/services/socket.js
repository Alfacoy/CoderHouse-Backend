import { Server } from 'socket.io';
import  Chat  from './Chat.js';
import { Product } from '../daos/index.js';
import {errorLogger, logger} from "../helpers/logger.js";

export default class Socket {
    constructor(conn) {
        this.io = new Server(conn);
        this.chatDB = new Chat();
        this.on();
    }

    on() {
        this.io.on('connection',
            async (socket) => {
                logger.info('Usuario conectado');

                let products = await Product.getAll()
                socket.emit('updateProducts', products);

                let messages = await this.chatDB.GetMessages();
                socket.emit('updateChat', messages)
            
                socket.on('webChat', (msg) => {
                    try {
                        const { email, firstName, lastName, age, message } = msg;
                        if (email || firstName || lastName || age || message) {
                            this.chatDB.CreateMessage(msg).then(async (e) => {
                                let refreshChat = await this.chatDB.GetMessageById(e.payload);
                                this.io.emit('webChat', refreshChat.payload)
                            });
                        }
                    } catch (err) {
                        errorLogger.error('Error al guardar mensajes de socket: ' + err);
                    }
                })

                // Disconnect
                socket.on('disconnect', () => {
                    logger.info(`Un usuario se ha desconectado`)
                })
            })
    }
}