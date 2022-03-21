import mongoose  from 'mongoose';
import { normalize, schema, denormalize } from 'normalizr';
import config from "../config.js";
import chatSchema from "../models/chat.js";
import {errorLogger} from "../helpers/logger.js";

mongoose.connect(config.mongo.baseUrl, { useNewUrlParser: true, useUnifiedTopology: true });

class Chat {
    constructor() {
        this.collection = mongoose.model('chat', chatSchema);
    }

    async GetMessages() {
        try {
            const messages = await this.collection.find();
            return { status: 'success', payload: messages };
        } catch (err) {
            errorLogger.error(err);
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
            errorLogger.error(err);
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
            errorLogger.error(err);
            return { status: 'error', message: err }
        }
    } 
}

export default Chat;
