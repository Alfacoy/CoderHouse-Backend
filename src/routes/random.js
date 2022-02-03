import { Router } from 'express';
import { fork } from 'child_process'
import __dirname from '../utils.js';

const APIRandom = Router();

APIRandom.get('/', (req, res) => {
    const random = fork(`${__dirname}/helper/randomNumber`, { env: Object.assign(process.env, { cant: req.query.cant }) });
    random.on('message', (data) => {
        res.send(data)
    }) 
})

export default APIRandom;