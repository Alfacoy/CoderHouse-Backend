import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
    first_name: String,
    last_name: String,
    username: String,
    email: String,
    address: String,
    password: String,
    picture: String,
    displayName: String,
    age: Number
})

export default userSchema;

