const express = require('express');
const cors = require('cors');

const routeProduct = require('../routes/products'); // PRODUCT-ROUTES

const config = {
    port: 8080
}

class Server {
    constructor(port = config.port) {
        this.app = express();
        this.PORT = process.env.PORT || port;
        this.middlewares();
        this.routes();
    }

    // Middlewares
    middlewares() {
        this.app.use(express.json());
        this.app.use(express.urlencoded({ extended: true }));
        this.app.use(cors());
        this.app.use(express.static('public'));
    }
    
    // Methods
    routes() {
        this.app.use('/api/productos', routeProduct)
    }

    listen() {
        this.app.listen(this.PORT, () => console.log(`Servidor escuchando en el puerto: http://localhost:${this.PORT}`))
    }
}

module.exports = Server;


