import mongoose from 'mongoose';
import config from "../config.js";
import {errorLogger} from "../helpers/logger.js";

mongoose.connect(config.mongo.baseUrl, { useNewUrlParser: true, useUnifiedTopology: true });

export default class Contenedor {
    constructor(collection, schema) {
        this.collection = mongoose.model(collection, schema);
    }

    async save(object) {
        try {
            let newElement = await this.collection.create(object);
            return { status: 'Success', message: 'Un nuevo elemento fue agregado a la base de datos.', id: newElement._id}
        } catch (err){
            errorLogger.error(err);
            return { status: 'Error', message: `No se pudo guardar el documento: ${err}`}
        }
    }

    async getAll() {
        try {
            let res = await this.collection.find();
            return {status: 'Success', message: 'Se obtuvieron de manera exitosa los datos.', payload: res}
        } catch (err) {
            errorLogger.error(err);
            return { status: 'Error', message: `No se pudo encontrar los documentos: ${err}`}
        }
    }

    async getById(id) {
        try { 
            let res = await this.collection.findById(id);
            return { status: 'Success', message: 'Se obtuvo el elemento buscado.', payload: res}
        } catch (err) {
            errorLogger.error(err);
            return { status: 'Error', message: `No se pudo obtener el documento solicitado: ${err}`}
        }
    }

    async update(id, object) {
        try {
            await this.collection.updateOne({ _id: id }, object)
            return { status: 'Success', message: 'Se actualizo con éxito el elemento.'}
        } catch (err) {
            errorLogger.error(err);
            return { status: 'Error', message: `No se pudo actualizar el documento: ${err}`}
        }
    }

    async deleteById(id) {
        try {
            await this.collection.deleteOne({ _id: id })
            return { status: 'Success', message: 'Se elimino con éxito el elemento.'}
        } catch (err) {
            errorLogger.error(err);
            return { status: 'Error', message: `No se pudo eliminar el documento: ${err}` }
        }
    }

}
