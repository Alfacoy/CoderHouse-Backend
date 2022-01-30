import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    role: {
        type: String,
        required: true
    },
    first_name: String,
    last_name: String,
    username: String,
    address: String,
    picture: String,
    displayName: String,
    age: Number
})

export default userSchema;

