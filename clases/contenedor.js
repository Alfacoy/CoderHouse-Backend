import fs from 'fs';

class Contenedor {
    constructor(file) {
        this.path = './files/';
        this._file = `${file}.txt`;
    }

    async save(object){
        // Recibe un objeto, lo guarda en el archivo, devuelve el id asignado.
        try {
            let res = await fs.promises.readFile(`${this.path}${this._file}`,'utf-8');
            let productos = JSON.parse(res);
            const producto = {
                id: productos[productos.length-1].id + 1,
                title: object.title,
                price: parseInt(object.price),
                thumbnail: object.thumbnail
            }
            productos.push(producto); 
            try {
                await fs.promises.writeFile(`${this.path}${this._file}`,JSON.stringify(productos,null,2))
                return {status: 'Success', message: 'Producto creado con éxito.', id: producto.id }
            }catch(err) {
                return {status: 'Error', message: 'Error al cargar el producto.', error: err}
            }
        }catch(err) {
            const producto = {
                id: 1,
                title: object.title,
                price: parseInt(object.price),
                thumbnail: object.thumbnail
            }
            try {
                await fs.promises.writeFile(`${this.path}${this._file}`,JSON.stringify([producto],null,2))
                return {status: 'Success', message: 'Archivo y producto creado con éxito.', id: producto.id}
            } catch (err) {
                return {status: 'Error', message: 'Error al crear el archivo y producto.', error: err}
            }
        }
    }

    async getById(id) {
        // Recibe un id y devuelve el objeto con ese id, o null si no está.
        try{
            let data = await fs.promises.readFile(`${this.path}${this._file}`,'utf-8');
            let productos = JSON.parse(data);
            let producto = productos.find(el => el.id === id) 
            if(!producto) {
                throw new Error()
            }
            return {status: 'Success', producto: producto}
        }catch(err){
            return {status: 'Error', message: 'No se encontro el producto solicitado.', error: err}
        }
    }

    async updateProduct(id, object) {
        // Recibe el id de un producto y lo reemplaza por el nuevo producto.
        try {
            let data = await fs.promises.readFile(`${this.path}${this._file}`, 'utf-8');
            let productos = JSON.parse(data);
            let producto = productos.find(el => el.id === id)
            if (!producto) {
                throw new Error()
            }
            let productoActualizado = productos.map(item=> {
                if (item.id === id) {
                    item.title = object.title;
                    item.thumbnail = object.thumbnail;
                    item.price = parseInt(object.price)
                    return item
                } else {
                    return item
                }
            })
            try {
                await fs.promises.writeFile(`${this.path}${this._file}`, JSON.stringify(productoActualizado, null, 2))
                return { status: 'Success', message: 'Producto actualizado con éxito.', id: producto.id }
            } catch (err) {
                return { status: 'Error', message: 'Error al cargar el producto.', error: err }
            }
        } catch (err) {
            return { status: 'Error', message: 'No se encontro el producto solicitado.', error: err }
        }
    }

    async getAll() {
        // Devuelve un array con los objetos presentes en el archivo.
        try{
            let data = await fs.promises.readFile(`${this.path}${this._file}`,'utf-8');
            let productos = JSON.parse(data);
            return {status: 'Success', productos: productos}
        }catch(err){
            return {status: 'Error', message: 'No se encontraron los productos solicitados.'}
        }
    }

    async deleteById(id) {
        // Elimina del archivo el objeto con el id buscado.
        try{
            let res = await fs.promises.readFile(`${this.path}${this._file}`,'utf-8');
            let productos = JSON.parse(res);
            let siExiste = productos.find(el=>el.id === id)
            if(!siExiste){
                throw new Error();
            }
            let productosActualizados = productos.filter(el=>el.id !== id);
            try {
                await fs.promises.writeFile(`${this.path}${this._file}`,JSON.stringify(productosActualizados,null,2))
                return {status: 'Success', message: 'Producto eliminado con éxito.'}
            }catch(err){
                return {status: 'Error', message: 'Hubo un problema al borrar el producto.'}
            } 
        }catch(err){
            return {status: 'Error', message: 'No se encontro el producto solicitado.'}
        }
    }

    async deleteAll() {
        // Elimina todos los objetos presentes en el archivo..
        try{
            await fs.promises.unlink(`${this.path}${this._file}`);
            return {status: 'Success', message: 'Se eliminaron todos los objetos del archivo.'}
        }catch(err){
            return {status: 'Error', message: 'Hubo un error al intentar borrar los archivos.', error: err}
        }
    }
}

export default Contenedor;


