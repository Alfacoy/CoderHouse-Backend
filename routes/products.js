import { Router } from 'express';
import Contenedor from '../clases/contenedor.js'; // CONTROLARDOR-DB

const routerAPI = Router();
const routerVIEW = Router();
const database = new Contenedor('productos'); // INSTANCIA-CONTROLADOR-DB

/*=========================================*/
/*=                  API                  =*/
/*=========================================*/

// GET
routerAPI.get('/', (req,res) => {
    database.getAll().then(items => {
        if (items.status === 'Error') {
            res.status(404).send(items.message);
        }
        res.send(items.productos)
    }) 
})

routerAPI.get('/:pid', (req, res) => {
    let { pid } = req.params;
    pid = parseInt(pid);
    database.getById(pid).then(item => {
        if (item.status === 'Error') {
            res.status(404).send(item.message);
        }
        res.send(item.producto)
    })
})

// POST
routerAPI.post('/', (req, res) => {
    let { title, thumbnail, price } = req.body;
    const product = {
        title,
        thumbnail,
        price
    }
    database.save(product).then(item => {
        if (item.status === 'Error') {
            res.status(404).send(item.message);
        }
        res.send(item) // ERR_HTTP_INVALID_STATUS_CODE al enviar item.id
    })

})

// PUT
routerAPI.put('/:pid', (req, res) => {
    let { pid } = req.params;
    pid = parseInt(pid);
    let obj = req.body;
    database.updateProduct(pid, obj).then(item => {
        if (item.status === 'Error') {
            res.status(404).send(item.message);
        }
        res.send(item)
    })
})

// DELETE
routerAPI.delete('/:pid', (req, res) => {
    let { pid } = req.params;
    pid = parseInt(pid);
    database.deleteById(pid)
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

/*=========================================*/
/*=                  VIEW                 =*/
/*=========================================*/

// GET
routerVIEW.get('/', (req, res) => {
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
})

export {
    routerAPI,
    routerVIEW
}