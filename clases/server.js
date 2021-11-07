const express = require('express');
const Contenedor = require('./contenedor'); // CONTROLARDOR-DB
const { RandomNumber } = require('../helper'); // HELPER

const config = {
    port: 8080,
    fileName: 'productos'
}

class Server {
    constructor(port = config.port, fileName= config.fileName) {
        this.app = express();
        this.PORT = process.env.PORT || port;
        this.database = new Contenedor(fileName); // CONTROLADOR-DB
        this.routes();
    }
    
    routes() {

        this.app.get('/productos', (req, res) => {
            this.database.getAll().then( items => {
                if (items.status === 'Error') {
                    res.status(404).send(`<p style="font-weight: bold;">Hubo un error en la ejecución:</p><span style="color: red;">${items.message}</span>`)
                }
                res.send(items.productos)
            })
        })

        this.app.get('/productoRandom', (req, res) => {
            this.database.getById(RandomNumber(1, 6)).then( item => {
                if (item.status === 'Error') {
                    res.status(404).send(`<p style="font-weight: bold;">Hubo un error en la ejecución:</p><span style="color: red;">${item.message}</span>`)
                }
                res.send(item.producto)
            })
        })

    }

    listen() {
        this.app.listen(this.PORT, () => console.log(`Servidor escuchando en el puerto: http://localhost:${this.PORT}`))
    }
}

module.exports = Server;


