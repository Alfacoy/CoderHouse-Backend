import fs from 'fs';

class Contenedor {
    constructor(fileName) {
        this.path = './files/';
        this._file = `${fileName}.txt`;
    }

    async save(object){
        // Recibe un objeto, lo guarda en el archivo, devuelve el id asignado.
        try {
            let res = await fs.promises.readFile(`${this.path}${this._file}`, 'utf-8');
            let content = JSON.parse(res);
            const newElement = {
                id: content[content.length - 1].id + 1,
                ...object
            }
            content.push(newElement);
            try {
                await fs.promises.writeFile(`${this.path}${this._file}`,JSON.stringify(content,null,2))
                return { status: 'Success', message: 'Producto creado con éxito.', id: newElement.id }
            }catch(err) {
                return {status: 'Error', message: 'Error al cargar el producto.', error: err}
            }
        }catch(err) {
            const newElement = [
                {
                    id: 1,
                    ...object
                }
            ]
            try {
                await fs.promises.writeFile(`${this.path}${this._file}`, JSON.stringify(newElement,null,2))
                return { status: 'Success', message: 'Archivo y producto creado con éxito.', id: newElement.id}
            } catch (err) {
                return {status: 'Error', message: 'Error al crear el archivo y producto.', error: err}
            }
        }
    }

    async getById(id) {
        // Recibe un id y devuelve el objeto con ese id, o null si no está.
        try{
            let res = await fs.promises.readFile(`${this.path}${this._file}`,'utf-8');
            let content = JSON.parse(res);
            let findElement = content.find(el => el.id === id) 
            if (!findElement) {
                throw new Error()
            }
            return { status: 'Success', producto: findElement}
        }catch(err){
            return {status: 'Error', message: 'No se encontro el producto solicitado.', error: err}
        }
    }

    async update(id, object) {
        // Recibe un id de contenido y lo reemplaza por uno nuevo.
        try {
            let res = await fs.promises.readFile(`${this.path}${this._file}`, 'utf-8');
            let content = JSON.parse(res);
            let findElement = content.find(el => el.id === id)
            if (!findElement) {
                throw new Error()
            }
            let updateElement = content.map(item=> {
                if (item.id === id) {
                    const pushElement = {
                        id: item.id,
                        ...object
                    }
                    return pushElement
                } else {
                    return item
                }
            })
            try {
                await fs.promises.writeFile(`${this.path}${this._file}`, JSON.stringify(updateElement, null, 2))
                return { status: 'Success', message: 'Producto actualizado con éxito.', id: findElement.id }
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
            let res = await fs.promises.readFile(`${this.path}${this._file}`,'utf-8');
            let content = JSON.parse(res);
            return {status: 'Success', productos: content}
        }catch(err){
            return {status: 'Error', message: 'No se encontraron los productos solicitados.'}
        }
    }

    async deleteById(id) {
        // Elimina del archivo el objeto con el id buscado.
        try{
            let res = await fs.promises.readFile(`${this.path}${this._file}`,'utf-8');
            let content = JSON.parse(res);
            let findElement = content.find(el=>el.id === id)
            if(!findElement){
                throw new Error();
            }
            let excludedElement = content.filter(el=>el.id !== id);
            try {
                await fs.promises.writeFile(`${this.path}${this._file}`, JSON.stringify(excludedElement,null,2))
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


