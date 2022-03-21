import Contenedor from "../../services/databaseMongo.js";
import userSchema from "../../models/user.js";
import {errorLogger} from "../../helpers/logger.js";

export default class UserMongo extends Contenedor {
    constructor() {
        super('user', userSchema)
    }

    async getUserByEmail(email) {
        try {
            let findUser = await this.collection.findOne({ email: email })
            if (!findUser) throw new Error;
            return { status: 'Success', message: 'Usuario encontrado con éxito.', payload: findUser}
        } catch (err) {
            errorLogger.error(err);
            return { status: 'Error', message: 'No se pudo encontrar el usuario especificado.'}
        }
    }
}