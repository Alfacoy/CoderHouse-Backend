import { request, response } from 'express';
import cloudinary from 'cloudinary'
import { webToken } from '../helpers/jwt.js';
import { sendEmail } from '../helpers/mail.js';
import {errorLogger} from "../helpers/logger.js";
import config from '../config.js'

const imageStorage = cloudinary.v2
imageStorage.config(config.cloudinary.API)


const login = async (req = request, res = response) => {
    const token = await webToken(req.user.id);

    res.cookie('JWT-COOKIE', token.payload.token, {
        httpOnly: true
    })
    return res.status(200).send({
        status: 'Success',
        message: 'Usuario logeado con éxito.',
        payload: {
            token: token.payload.token,
            cart: req.user.cart
        }
    })
}

const register = async (req = request, res = response) => {
    const token = await webToken(req.user.id);

    //ENVIAR EMAIL AL ADMINISTRADOR
    await sendEmail(
        'Nuevo Registro',
        `
        <p><b>Datos de nuevo usuario:</b></p>
        <h3>${req.user.fullName} [${req.user.age}]</h3>
        <p>Email: ${req.user.email}</p>
        <p>Dirección: ${req.user.adress}</p>
        <p>Teléfono: ${req.user.phone}</p>
       `
    )

    res.cookie('JWT-COOKIE', token.payload.token, {
        httpOnly: true
    })

    return res.status(200).send({
        status: "Success",
        message: 'Usuario registrado correctamente.',
        payload: {
            token: token.payload.token,
            cart: req.user.cart
        }
    });
}

const currentUser = async (req = request, res = response) => {
    try {
        const { first_name, last_name, email, age, adress, phone, picture, username } = req.user.payload
        const data = {
            first_name,
            last_name,
            email,
            age,
            adress,
            phone,
            picture,
            username
        }
        return res.status(200).send({status:'Success', payload: data })
    } catch (error) {
        errorLogger.error(error);
        res.status(401).send({ status: 'Error', message: 'Hubo un error al tratar de registrar un usuario.' })
    }
}

const logout = (req = request, res = response) => {
    try {
        res.clearCookie('JWT-COOKIE');
        res.status(200).send({ status: 'Success', message: 'Usuario deslogeado con éxito.' })
    } catch (error) {
        errorLogger.error(error);
        res.status(404).send({ status: 'Error', message: 'No hay usuario que deslogear.' })
    }
}

export {
    login,
    register,
    logout,
    currentUser
}
