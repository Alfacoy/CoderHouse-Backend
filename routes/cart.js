import { Router } from 'express';

import Contenedor from '../clases/databaseFS.js'; // CONTROLARDOR-DB

const APICart = Router();
const database = new Contenedor('carrito'); // INSTANCIA-CONTROLADOR-DB
const databasePROD = new Contenedor('productos');

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
        } else {
            res.send(item.payload)
        }
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
        res.send(JSON.stringify(item.id))
    })
})

APICart.post('/:id/productos', (req, res) => {
    // Agrega productos al carrito según su ID
    const { id } = req.params;
    const { pid } = req.body;
    database.getById(parseInt(id)).then(e => {
        if (e.status === 'Error') {
            res.status(404).send(e.message);
        } else {
            const products = e.payload.productos
            if (!products.find(e => e === parseInt(pid))) {
                databasePROD.getById(parseInt(pid)).then(el => {
                    if (el.status === 'Error') {
                        res.status(404).send(el.message);
                    } else {
                        products.push(pid)
                        const obj = {
                            id: e.payload.id,
                            timestamp: e.payload.timestamp,
                            productos: products
                        };
                        database.update(parseInt(id), obj).then(ele => {
                            if (ele.status === 'Error') {
                                res.status(404).send(ele.message);
                            }
                            res.send(ele.message)
                        })
                    }
                })
            } else {
                res.status(404).send('El producto ya existe en el carrito.');
            }
        }
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
            res.send(item.message)
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
        let products = item.payload.productos
        let findProduct = products.find(item => item === id_prod)

        if (!findProduct) {
            res.status(404).send('El producto a eliminar no existe.')
        } else {
            let excludeProducts = products.filter(item => item !== id_prod)
            let obj = {
                id: item.payload.id,
                timestamp: item.payload.timestamp,
                productos: excludeProducts
            };
            database.update(id, obj).then(item => {
                if (item.status === 'Error') {
                    res.status(404).send(item.message);
                }
                res.send('Se elimino un producto de la lista');

            })
        }
    })
})


export default APICart;