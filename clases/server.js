import express from 'express';
import cors from 'cors';
import { engine } from 'express-handlebars';

// OWN-IMPORTS
import { routerAPI, routerVIEW } from '../routes/products.js' // PRODUCT-ROUTES
import Socket from './socket.js'

// INITIAL CONFIG
const config = {
    port: 8080
}

class Server {
    constructor(port = config.port) {
        this.app = express();
        this.PORT = process.env.PORT || port;
        this.server = this.app.listen(this.PORT, () => console.log(`Servidor escuchando en el puerto: http://localhost:${this.PORT}`));
        this.socket = new Socket(this.server);
        this.middlewares();
        this.routes();
        this.engines();
    }


    // MIDDLEWARES-1
    middlewares() {
        this.app.use(express.static('public'));
        this.app.use(express.json());
        this.app.use(express.urlencoded({ extended: true }));
        this.app.use(cors());
        this.app.use((req, res, next) => {
            req.io = this.socket;
            next()
        })
    }

    // ROUTES-2
    routes() {
        this.app.use('/api/productos', routerAPI);
        this.app.use('/view/productos', routerVIEW);
    }

    // ENGINES-3
    engines() {
        this.app.engine('handlebars', engine());
        this.app.set('views', './views');
        this.app.set('view engine', 'handlebars');
    }
    
    // LISTENER-4
    listen() {
        this.socket;
    }
}

export default Server;