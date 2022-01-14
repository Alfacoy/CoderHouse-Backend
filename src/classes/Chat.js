import mongoose  from 'mongoose';
import { normalize, schema, denormalize } from 'normalizr';
import config from "../config.js";
import chatSchema from "../models/chat.js";

mongoose.connect(config.mongo.baseUrl, { useNewUrlParser: true, useUnifiedTopology: true });

class Chat {
    constructor() {
        this.collection = mongoose.model('chat', chatSchema);
    }

    async GetMessages() {
        try {
            const messages = await this.collection.find();

/*             try {
                console.log(messages)
                const newMessages = {
                    id: '1',
                    messages: messages
                }
                console.log(newMessages)
                const authorSchema = new schema.Entity('author', {}, { idAttribute: 'email' });
                const postSchema = new schema.Entity('post', { author: authorSchema }, { idAttribute: '_id' });
                const messageSchema = new schema.Entity('message', { messages: [postSchema] })
                const normalizeData = normalize(messages, messageSchema)

                console.log(`NormalizeData: ${JSON.stringify(normalizeData,null,2)}`)

                const denormalizeData = denormalize(normalizeData.result, messageSchema, normalizeData.entities)
                console.log(`DenormalizeData: ${denormalizeData}`)

                
            } catch (err) {
                return console.log(err)
            } */
            
            return { status: 'success', payload: messages };
        } catch (err) {
            return { status: 'error', message: err }
        }
    }

    async GetMessageById(id) {
        try {
            let message = await this.collection.findById(id);
            if (message) {
                return { status: 'succes', payload: message };
            } else {
                return { status: 'err', message: `El mensaje con id: ${id} no existe.` }
            }
        } catch (err) {
            return { status: 'error', message: err };
        }
    }

    async CreateMessage(msg) {
        try {
            let message = await this.collection.create({
                author: {
                    email: msg.email,
                    firstName: msg.firstName,
                    lastName: msg.lastName,
                    age: msg.age,
                    alias: `${msg.firstName.substring(0, 3)}${msg.lastName.substring(0, 3)}`,
                    avatar: 'https://cdn.pixabay.com/photo/2020/05/17/20/21/cat-5183427_960_720.jpg',
                },
                text: msg.message
            })
            return { status: 'success', payload: message._id }
        } catch (err) {
            return { status: 'error', message: err }
        }
    } 
}

export default Chat;
