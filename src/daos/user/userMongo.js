import Contenedor from "../../classes/databaseMongo.js";
import userSchema from "../../models/user.js";

export default class UserMongo extends Contenedor {
    constructor() {
        super('user', userSchema)
    }

    async getUserByEmail(email) {
        try {
            let findUser = await this.collection.findOne({ email: email })
            return { status: 'Success', message: 'Usuario encontrado con éxito.', payload: findUser}
        } catch (err) {
            return { status: 'Error', message: 'No se pudo encontrar el usuario especificado.'}
        }
    }
}