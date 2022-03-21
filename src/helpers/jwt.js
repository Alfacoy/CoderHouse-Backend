import jwt from 'jsonwebtoken';
import {errorLogger} from "./logger.js";
import config from '../config.js'

const webToken = (uid) => {
    return new Promise((resolve, reject) => {
        const payload = { uid };
        jwt.sign(payload, config.jwt.secret, (err, token) => {
            if (err) {
                errorLogger.error(err);
                reject({status: 'Error',message: 'No se pudo generar el Web Token.'})
            } else {
                resolve({status: 'Success',payload: {token: token } })
            }
        })
    })
}

const verifyWebToken = (token) => {
    return new Promise((resolve, reject) => {
        try {
            let isValid = jwt.verify(token, config.jwt.secret)
            resolve({ status: 'Success', payload: isValid })
        } catch (error) {
            errorLogger.error(error);
            reject({ status: 'Error', message: "El Web Token no es válido."})
        }
    })
}

export {
    webToken,
    verifyWebToken
}