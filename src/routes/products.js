import { Router } from 'express';
import { middlewareAuthRole } from '../helpers/middlewares.js'; 
import { Product } from '../daos/index.js';

const APIProducts = Router();

/*=========================================*/
/*=                  API                  =*/
/*=========================================*/

// GET
APIProducts.get('/', (req, res) => {
    Product.getAll().then(items => {
        if (items.status === 'Error') {
            res.status(404).send(items.message);
        } else {
            res.status(200).send(items.payload)
        }
    }) 
})

APIProducts.get('/:pid', (req, res) => {
    let { pid } = req.params;
    Product.getById(pid).then(item => {
        if (item.status === 'Error') {
            res.status(404).send(item.message);
        } else {
            res.status(200).send(item.payload)
        }
    })
})

// POST
APIProducts.post('/', middlewareAuthRole, (req, res) => {
    let { title, description, thumbnail, price, stock } = req.body;
    const object= {
        code: `PROD-${Date.now()}`,
        title,
        description,
        thumbnail,
        price,
        stock
    }

    if (!title || !description || !thumbnail || !price || !stock) {
        res.status(404).send('No se puede guardar un producto con campos incompletos.')
    } else {
        Product.save(object).then(item => {
            if (item.status === 'Error') {
                res.status(404).send(item.message);
            } else {     
                Product.getAll().then(items => {
                    if (items.status === 'Error') {
                        res.status(404).send(items.message);
                    } else {
                        let res = JSON.parse(JSON.stringify(items))
                        req.io.io.emit('updateProducts', res);
                    }
                })
                res.status(201).send(JSON.stringify(item.id))
            }
        })
    }
})

// PUT
APIProducts.put('/:pid', middlewareAuthRole, (req, res) => {
    let { pid } = req.params;
    let { title, description, thumbnail, price, stock } = req.body;
    const obj = {
        title,
        description,
        thumbnail,
        price,
        stock
    }

    if (!title || !description || !thumbnail || !price || !stock) {
        res.status(404).send('No se puede guardar un producto con campos incompletos.')
    } else {
        Product.update(pid, obj).then(item => {
            if (item.status === 'Error') {
                res.status(404).send(item.message);
            } else {
                res.status(201).send(item.message)
            }
        })
    }
})

// DELETE
APIProducts.delete('/:pid', middlewareAuthRole, (req, res) => {
    let { pid } = req.params;
    Product.deleteById(pid)
        .then(item => {
            console.log(item)
        if (item.status === 'Error') {
            res.status(404).send(item.message);
        } else {
            res.status(200).send(item.message)
        }
    })
})

export default APIProducts;