import express from 'express';
import cors from 'cors';
import { engine } from 'express-handlebars';


import { routerAPI, routerVIEW } from '../routes/products.js' // PRODUCT-ROUTES
import Socket from './socket.js'

const config = {
    port: 8080,
    engine: 'handlebars'
}

class Server {
    constructor(port = config.port, engine = config.engine) {
        this.app = express();
        this.PORT = process.env.PORT || port;
        this.ifEngine = engine;
        this.middlewares();
        this.routes();
        this.engines();
    }

    // Middlewares
    middlewares() {
        this.app.use(express.json());
        this.app.use(express.urlencoded({ extended: true }));
        this.app.use(cors());
        this.app.use(express.static('public'));
    }

    // Routes
    routes() {
        this.app.use('/api/productos', routerAPI);
        this.app.use('/view/productos', routerVIEW);
        this.app.use('/', (req, res) => res.render('Form'))
    }

    // Engines
    engines() {
        if (this.ifEngine === 'handlebars') {
            this.app.engine('handlebars', engine());
        }
        this.app.set('views', './views');
        this.app.set('view engine', this.ifEngine);
    }

    listen() {
        const server = this.app.listen(this.PORT, () => console.log(`Servidor escuchando en el puerto: http://localhost:${this.PORT}`))
        const io = new Socket(server);
        return io
    }
}

export default Server;