import express from 'express';
import cors from 'cors';
import { engine } from 'express-handlebars';
import { resolve } from 'path';

// ROUTES
import APIProducts from '../routes/products.js'; 
import APICart from '../routes/cart.js';

import Socket from './socket.js';

// INITIAL CONFIG
const config = {
    port: 8080,
    admin: true
}

class Server {
    constructor(port = config.port, admin = config.admin) {
        this.app = express();
        this.PORT = process.env.PORT || port;
        this.server = this.app.listen(this.PORT, () => console.log(`Servidor escuchando en el puerto: http://localhost:${this.PORT}`));
        this.socket = new Socket(this.server);
        this.admin = admin;
        this.middlewares();
        this.routes();
        this.engines();
    }


    // MIDDLEWARES-1
    middlewares() {
        this.app.use(express.static(resolve('src/public'))); // Arreglar ruta
        this.app.use(express.json());
        this.app.use(express.urlencoded({ extended: true }));
        this.app.use(cors());
        this.app.use((req, res, next) => {
            req.io = this.socket;
            req.auth = this.admin;
            next()
        })
    }
    
    // ROUTES-2
    routes() {
        this.app.use('/api/productos', APIProducts);
        this.app.use('/api/carrito', APICart);
        this.app.post('/login', (req, res) => {
            const pass = 'abc';
            if (req.body.pass === pass) {
                this.admin = true;
                res.send('Logeo exitoso')
            } else {
                res.send('Error al tratar de logearse')
            }
        })
        this.app.post('/logout', (req, res) => {
            if (this.admin) {
                this.admin = false;
                res.send('Se desconecto de manera exitosa.')
            } else {
                res.send('No hay usuario para deslogear.')
            }
        })
        this.app.use('/*', (req, res) => {
            res.send({
                error: -2,
                descripcion: `La ruta '${req.baseUrl}' con el método [${req.method}] no existe.`
            })
        })
    }

    // ENGINES-3
    engines() {
        this.app.engine('handlebars', engine());
        this.app.set('views', resolve('src/views')); // Arreglar ruta
        this.app.set('view engine', 'handlebars');
    }
    
    // LISTENER-4
    listen() {
        this.socket;
    }
}

export default Server;