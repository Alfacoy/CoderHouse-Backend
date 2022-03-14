import { request, response } from 'express';
import { User } from '../daos/index.js';
import { verifyWebToken } from '../helpers/jwt.js';

const middlewareAuthRole = async (req = request, res = response, next) => {
    /* El usuario debe ser un "admin" para manipular esta ruta. */
    try {
        const token = req.header('Authorization');
        const uid = await verifyWebToken(token);
        const userData = await User.getById(uid.payload.uid);
        const { role } = userData.payload;
        if (role !== 'admin') {
            res.status(403).send({ error: 'Error', message: `No tiene permisos en la ruta '${req.baseUrl}' con el método [${req.method}].` })
        } else {
            next();
        }
    } catch (error) {
        console.log(error)
    }
}

export {
    middlewareAuthRole
}