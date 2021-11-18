const { Router } = require('express');
const router = Router();

const Contenedor = require('../clases/contenedor'); // CONTROLARDOR-DB
const database = new Contenedor('productos'); // INSTANCIA-CONTROLADOR-DB

// GET
router.get('/', (req,res) => {
    database.getAll().then(items => {
        if (items.status === 'Error') {
            res.status(404).send(items.message);
        }
        res.send(items.productos)
    })
})

router.get('/:pid', (req, res) => {
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
router.post('/', (req, res) => {
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
router.put('/:pid', (req, res) => {
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
router.delete('/:pid', (req, res) => {
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

module.exports = router;