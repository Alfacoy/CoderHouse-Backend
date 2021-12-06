import { Router } from 'express';

import Contenedor from '../clases/databaseFS.js'; // CONTROLARDOR-DB

const APICart = Router();
const database = new Contenedor('carrito'); // INSTANCIA-CONTROLADOR-DB

/*=========================================*/
/*=                  API                  =*/
/*=========================================*/

// GET
APICart.get('/:id/productos', (req, res) => {
    // Muestra todos los productos de un carrito
    let { id } = req.params;
    id = parseInt(id);
    database.getById(id).then(item => {
        if (item.status === 'Error') {
            res.status(404).send(item.message);
        }
        res.send(item.payload.productos)
    })
})

// POST
APICart.post('/', (req, res) => {
    // Crea un nuevo carrito y retorna el ID
    const newCart = {
        timestamp: Date.now(),
        productos:[]
    }
    database.save(newCart).then(item => {
        if (item.status === 'Error') {
            res.status(404).send(item.message);
        }
        res.send(item) // ERR_HTTP_INVALID_STATUS_CODE al enviar item.id
    })
})

APICart.post('/:id/productos', (req, res) => {
    // Agrega productos al carrito según su ID
    let { id } = req.params;
    id = parseInt(id);
    database.getById(id).then(item => {
        if (item.status === 'Error') {
            res.status(404).send(item.message);
        }
        let products = item.payload.productos
        products.push(req.body)
        let obj = {
            id: item.payload.id,
            timestamp: item.payload.timestamp,
            productos: products
        };
        database.update(id, obj).then(item => {
            if (item.status === 'Error') {
                res.status(404).send(item.message);
            }
            res.send(item)
        })
    })
})

// DELETE
APICart.delete('/:id', (req, res) => {
    // Borra un carrito con todos sus productos
    let { id } = req.params;
    id = parseInt(id);
    database.deleteById(id)
        .then(item => {
            if (item.status === 'Error') {
                res.status(404).send(item.message);
            }
            res.send(item)
        })
        .catch(err => {
            res.send(err)
        })
})

APICart.delete('/:id/productos/:id_prod', (req, res) => {
    // Borra un producto del carrita
    let { id, id_prod } = req.params;
    id = parseInt(id);
    id_prod = parseInt(id_prod);
    database.getById(id).then(item => {
        if (item.status === 'Error') {
            res.status(404).send(item.message);
        }
        try {
            let products = item.payload.productos
            let findProduct = products.find(item => item.id === id_prod)
            if (!findProduct) {
                throw new Error();
            }
            let excludeProducts = products.filter(item => item.id !== id_prod)
            let obj = {
                id: item.payload.id,
                timestamp: item.payload.timestamp,
                productos: excludeProducts
            };
            database.update(id, obj).then(item => {
                if (item.status === 'Error') {
                    res.status(404).send(item.message);
                }
                res.send(item)
            })
        } catch (err) {
            return { status: 'Error', message: 'El producto no existe.' }
        }
    })
})


export default APICart;