import { Router } from 'express';

import Contenedor from '../clases/databaseFS.js'; // CONTROLARDOR-DB
import { middlewareAuth } from '../helper/middlewares.js'; 
import Product from '../clases/Product.js';

const APIProducts = Router();
const database = new Contenedor('productos'); // INSTANCIA-CONTROLADOR-DB
const databaseProd = new Product();

/*=========================================*/
/*=                  API                  =*/
/*=========================================*/

// GET
APIProducts.get('/', (req, res) => {
    databaseProd.getAll().then(items => {
        if (items.status === 'Error') {
            res.status(404).send(items.message);
        }
        res.send(items.payload)
    }) 
})

APIProducts.get('/:pid', (req, res) => {
    let { pid } = req.params;
    pid = parseInt(pid);
    databaseProd.getById(pid).then(item => {
        if (item.status === 'Error') {
            res.status(404).send(item.message);
        }
        res.send(item.payload)
    })
})

// POST
APIProducts.post('/', middlewareAuth ,(req, res) => {
    let { title, description, thumbnail, price, stock } = req.body;
    const product = {
        title,
        description,
        code: `PROD-${Date.now()}`,
        thumbnail,
        price,
        stock
    }

    if (!title || !description || !thumbnail || !price || !stock) {
        res.status(404).send('No se puede guardar un producto con campos incompletos.')
    } else {
        databaseProd.save(product).then(item => {
            if (item.status === 'Error') {
                res.status(404).send(item.message);
            }
            databaseProd.getAll().then(items => {
                if (items.status === 'Success') {
                    let res = JSON.parse(JSON.stringify(items))
                    req.io.io.emit('updateProducts', res);
                }
            }).catch(err => console.log(err))
            res.send(JSON.stringify(item.id))
        }).catch(err => console.log(err))
    }
})

// PUT
APIProducts.put('/:pid', middlewareAuth, (req, res) => {
    let { pid } = req.params;
    pid = parseInt(pid);
    let obj = req.body;
    databaseProd.update(pid, obj).then(item => {
        if (item.status === 'Error') {
            res.status(404).send(item.message);
        } else {
            res.send(item.message)
        }
    })
})

// DELETE
APIProducts.delete('/:pid', middlewareAuth, (req, res) => {
    let { pid } = req.params;
    pid = parseInt(pid);
    databaseProd.deleteById(pid)
        .then(item => {
        if (item.status === 'Error') {
            res.status(404).send(item.message);
        } else {
            res.send(item.message)
        }
    })
    .catch(err => {
        res.send(err)
    })
})

/*=========================================*/
/*=                  VIEW                 =*/
/*=========================================*/

// GET
/* routerVIEW.get('/', (req, res) => {
    database.getAll().then(items => {
        if (items.status === 'Error') {
            res.status(404).send(items.message);
        }
        let obj = {
            productos: items.productos
        }
        res.render('Home', obj);
    })
})

routerVIEW.get('/chat', (req, res) => {
    res.render('Chat');
}) */

export default APIProducts