import mongoose from 'mongoose';

const chatSchema = new mongoose.Schema({
    author: {
        email: {
            type: String,
            required: true,
        },
        firstName: {
            type: String,
            required: true,
        },
        lastName: {
            type: String,
            required: true,
        },
        age: {
            type: Number,
            required: true,
        },
        alias: {
            type: String,
            required: true,
        },
        avatar: {
            type: String,
            required: true,
        }
    },
    text: {
        type: String,
        required: true,
    },
}, { timestamps: true })

export default chatSchema;