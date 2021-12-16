import fs from 'fs';

import { databaseProducts } from '../config.js';
import { messageDefaultContenedor } from '../helper/statusMessage.js';

class Product {
    constructor() {
        databaseProducts.schema.hasTable('products').then(res => {
            if (!res) {
                databaseProducts.schema.createTable('products', table => {
                    table.increments(),
                    table.timestamps(true, true,),
                    table.string('code').notNullable();
                    table.string('title').notNullable();
                    table.string('description').notNullable();
                    table.string('thumbnail').notNullable();
                    table.integer('price').notNullable();
                    table.integer('stock').notNullable();
                }).then(res => {
                    console.log('Tabla de productos creada con éxito.')
                }).catch(err => {
                    console.log(err)
                })
            }
        })
        this.status = messageDefaultContenedor;
    }

    async save(object) {
        // Recibe un objeto, lo guarda en el archivo, devuelve el id asignado.
        try {
            console.log('Try Product')
            let res = await databaseProducts.table('products').insert(object);
            console.log(res)
            return { status: 'Success', message: this.status.save.success.message, id: res }
        } catch (err) {
            return { status: 'Error', message: this.status.save.error.message, error: err }
        }
    }

    async update(id, object) {
        // Recibe un id de contenido y lo reemplaza por uno nuevo.
        try {
            let res = await databaseProducts.table('products').where('id', id).update(object)
            if (res == 0) {
                throw new Error();
            } else {
                return { status: 'Success', message: this.status.update.success.message }
            }
        } catch (err) {
            return { status: 'Error', message: this.status.getById.error.message, error: err }
        }
    }

    async getAll() {
        // Devuelve un array con los objetos presentes en el archivo.
        try {
            let res = await databaseProducts.select().table('products');
            if (res == 0) {
                throw new Error()
            }
            return { status: 'Success', message: this.status.getAll.success.message, payload: res }
        } catch (err) {
            return { status: 'Error', message: this.status.getAll.error.message }
        }
    }

    async getById(id) {
        // Recibe un id y devuelve el objeto con ese id, o null si no está.
        try {
            let res = await databaseProducts.select().table('products').where('id', id).first();
            if(!res){
                throw new Error()
            }
            return { status: 'Success', message: this.status.getById.success.message, payload: res }
        } catch (err) {
            return { status: 'Error', message: this.status.getById.error.message, error: err }
        }
    }

    async deleteById(id) {
        // Elimina del archivo el objeto con el id buscado.
        try {
            let res = await databaseProducts.table('products').del().where('id',id)
            if (res === 0) {
                throw new Error();
            } else {
                return { status: 'Success', message: this.status.deleteById.success.message }
            }
        } catch (err) {
            return { status: 'Error', message: this.status.getById.error.message }
        }
    }

/*     async deleteAll() {
        // Elimina todos los objetos presentes en el archivo..
        try {
            let res = await databaseProducts().del().then(res => console.log(res));
            console.log(res)
            return { status: 'Success', message: this.status.deleteAll.success.message }
        } catch (err) {
            return { status: 'Error', message: this.status.deleteAll.error.message, error: err }
        }
    } */
}

export default Product;


