import databaseChat from '../config.js';

class Chat {
    constructor() {
        databaseChat.schema.hasTable('chat').then(res => {
            if (!res) {
                databaseChat.schema.createTable('chat', table => {
                    table.increments(),
                    table.timestamps(true,true,),
                    table.string('email').notNullable(),
                    table.string('message').notNullable()
                }).then(res => {
                    console.log('Tabla de chat creada con éxito.')
                }).catch(err => {
                    console.log(err)
                })
            }
        }).catch(err => {
            console.log(err)
        })
    }

    async GetMessages() {
        try {
            let messages = await databaseChat.select().table('chat');
            return { status: 'success', payload: messages };
        } catch (err) {
            return {status: 'error', message: err }
       }
    }   

    async GetMessageById(id) {
        try {
            let message = await databaseChat.select().table('chat').where('id', id).first();
            if (message) {
                return { status: 'succes', payload: message };
            } else {
                return { status: 'err', message: `El mensaje con id: ${id} no existe.`}
            }
        } catch (err) {
            return { status: 'error', message: err };
        }
    }

    async CreateMessage(msg) {
        try {
            let message = await databaseChat.table('chat').insert(msg);
            return {status: 'success', payload: message}
        } catch (err) {
            return {status: 'error', message: err}
        }
    }
    
}

export default Chat;