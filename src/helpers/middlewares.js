import { request, response } from 'express';
import passport from "passport";
import { User } from '../daos/index.js';
import {errorLogger, warnLogger} from "./logger.js";
import { verifyWebToken } from '../helpers/jwt.js';

const middlewareAuthRole = async (req = request, res = response, next) => {
    /* El usuario debe ser un "admin" para manipular esta ruta. */
    try {
        const token = req.header('Authorization');
        const uid = await verifyWebToken(token);
        const userData = await User.getById(uid.payload.uid);
        const { role } = userData.payload;
        if (role !== 'admin') {
            warnLogger.warn(`Usuario sin autorización para ruta: '${req.baseUrl}' con el método [${req.method}].`)
           return  res.status(403).send({ error: 'Error', message: `No tiene permisos en la ruta '${req.baseUrl}' con el método [${req.method}].` })
        } else {
            next();
        }
    } catch (error) {
        errorLogger.error(error)
        console.log(error)
    }
}

const passportCall = (strategy) =>{
    return async(req, res, next) =>{
        passport.authenticate(strategy, (err, user, info) => {
            if (err) return next(err);
            if (!user) {
                errorLogger.error({error:info.message?info.message:info.toString()})
                return res.redirect('/login')
            }
            req.user = user;
            next();
        })(req, res, next);
    }
}

export {
    middlewareAuthRole,
    passportCall
}