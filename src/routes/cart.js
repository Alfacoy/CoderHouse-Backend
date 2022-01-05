import { Router } from 'express';
import { cart, product, persistens } from '../daos/index.js';

const APICart = Router();

/*=========================================*/
/*=                  API                  =*/
/*=========================================*/

// GET
APICart.get('/:id/productos', (req, res) => {
    // Muestra todos los productos de un carrito
    let { id } = req.params;
    cart.getById(id).then(item => {
        if (item.status === 'Error') {
            res.status(404).send(item.message);
        } else {
            res.status(200).send(item.payload)
        }
    })
})

// POST
APICart.post('/', (req, res) => {
    // Crea un nuevo carrito y retorna el ID
    const newCart = {
        productos:[]
    }
    cart.save(newCart).then(item => {
        if (item.status === 'Error') {
            res.status(404).send(item.message);
        } else {
            res.status(201).send(JSON.stringify(item.id))
        }
    })
})

APICart.post('/:id/productos', (req, res) => {
    // Agrega productos al carrito según su ID
    const { id } = req.params;
    const { pid } = req.body;

    if (persistens === 'mongo' || persistens ==='firebase') {
        cart.addToCart(id, pid).then(e => {
            if (e.status === 'Error') {
                res.status(404).send(e.message);
            } else {
                res.status(201).send(e.message)
            }
        })
    }
    
    if (persistens === 'fileSystem') {
        cart.getById(id).then(e => {
            if (e.status === 'Error') {
                res.status(404).send(e.message);
            } else {
                const products = e.payload.productos
                if (!products.find(e => e === pid)) {
                    product.getById(pid).then(el => {
                        if (el.status === 'Error') {
                            res.status(404).send(el.message);
                        } else {
                            products.push(pid)
                            const obj = {
                                id: e.payload.id,
                                productos: products
                            };
                            cart.update(id, obj).then(ele => {
                                if (ele.status === 'Error') {
                                    res.status(404).send(ele.message);
                                } else {
                                    res.status(201).send(ele.message)
                                }
                            })
                        }
                    })
                } else {
                    res.status(404).send('El producto ya existe en el carrito.');
                }
            }
        }) 
    }

})

// DELETE
APICart.delete('/:id', (req, res) => {
    // Borra un carrito con todos sus productos
    let { id } = req.params;
    cart.deleteById(id)
        .then(item => {
            if (item.status === 'Error') {
                res.status(404).send(item.message);
            } else {
                res.status(200).send(item.message)
            }
        })
})

APICart.delete('/:id/productos/:id_prod', (req, res) => {
    // Borra un producto del carrita
    let { id, id_prod } = req.params;
    
    if (persistens === 'mongo' || persistens === 'firebase') {
        cart.removeFromCart(id, id_prod).then(e => {
            if (e.status === 'Error') {
                res.status(404).send(e.message);
            } else {
                res.status(200).send(e.message);
            }
        })
    }

    if(persistens === 'fileSystem') {
        cart.getById(id).then(item => {
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
                cart.update(id, obj).then(item => {
                    if (item.status === 'Error') {
                        res.status(404).send(item.message);
                    } else {   
                        res.status(200).send('Se elimino un producto de la lista');
                    }
                })
            }
        })
    }
})

export default APICart;