import fs from 'fs';
import { Server } from 'socket.io';


import Contenedor from './databaseFS.js';

class Socket {  
    constructor(conn) {
        this.io = new Server(conn);
        this.productsFS = new Contenedor('productos');
        this.on();
    }

    on() {
        this.io.on('connection',
            async (socket) => {
                console.log('Usuario conectado');

                let productos = await this.productsFS.getAll()
                socket.emit('updateProducts', productos);

                let mensajes = await getAllMessage();
                socket.emit('updateChat', mensajes)
                



                socket.on('webChat', (msg) => {
                    try {
                        const obj = {
                            ...msg, date: Date()
                        }
                        addMessage(obj).then(() => {
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


const path = './files/';
const _file = 'chat.txt';

async function addMessage(object) {
    try {
        let res = await fs.promises.readFile(`${path}${_file}`, 'utf-8');
        let messages = JSON.parse(res);
        const message = {
            id: messages[messages.length - 1].id + 1,
            user: object.user,
            message: object.message,
            date: object.date
        }
        messages.push(message);
        try {
            await fs.promises.writeFile(`${path}${_file}`, JSON.stringify(messages, null, 2))
            return { status: 'Success', message: 'Mensaje guardado.', id: message.id }
        } catch (err) {
            return { status: 'Error', message: 'Error al guardar el mensaje.', error: err }
        }
    } catch (err) {
        const message = {
            id: 1,
            user: object.user,
            message: object.message,
            date: object.date
        }
        try {
            await fs.promises.writeFile(`${path}${_file}`, JSON.stringify([message], null, 2))
            return { status: 'Success', message: 'Archivo y mensaje creado con éxito.', id: message.id }
        } catch (err) {
            return { status: 'Error', message: 'Error al crear el archivo y crear mensaje.', error: err }
        }
    }
}

async function getAllMessage() {
    try {
        let data = await fs.promises.readFile(`${path}${_file}`, 'utf-8');
        let messages = JSON.parse(data);
        return { status: 'Success', messages: messages }
    } catch (err) {
        return { status: 'Error', message: 'No se encontraron mensajes.' }
    }
}