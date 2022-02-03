// EXPRESS
import express from 'express';
import MongoStore from 'connect-mongo';
import passport from 'passport';
import session from 'express-session';
import cors from 'cors';
import { engine } from 'express-handlebars';
// SOCKET
import Socket from '../classes/socket.js';
// UTILS
import __dirname from '../utils.js';
import config from '../config.js';
import initializePassportConfig from '../passport-config.js';
// ROUTES
import APIProducts from '../routes/products.js'; 
import APIFakeProducts from '../routes/fakeProducts.js';
import APICart from '../routes/cart.js';
import APIAuth from '../routes/auth.js';
import APIInfo from '../routes/info.js';
import APIRandom from '../routes/random.js';

// INITIAL CONFIG
const initialConfig = {
    port: 8080
}

export default class Server {
    constructor(port = initialConfig.port) {
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
        this.app.use(express.static(`${__dirname}/public`));
        this.app.use(express.json());
        this.app.use(express.urlencoded({ extended: true }));
        this.app.use(cors());
        this.app.use(session({
            store: MongoStore.create({mongoUrl: `${config.mongo.baseUrl}`}),
            secret: process.env.SECRET_SESSION,
            rolling: true,            
            resave: true,
            saveUninitialized: false,
            cookie: {
                maxAge: 100000
            }
        }))
        initializePassportConfig();
        this.app.use(passport.initialize());
        this.app.use(passport.session());
        this.app.use((req, res, next) => {
            req.io = this.socket;
            next()
        })
    }
    
    // ROUTES-2
    routes() {
        this.app.use('/api/productos', APIProducts);
        this.app.use('/api/productos-test', APIFakeProducts);
        this.app.use('/api/carrito', APICart);
        this.app.use('/api/random', APIRandom);
        this.app.use('/auth', APIAuth);
        this.app.use('/info', APIInfo);
        this.app.use('/*', (req, res) => {
            res.status(400).send({
                error: -2,
                descripcion: `La ruta '${req.baseUrl}' con el método [${req.method}] no existe.`
            })
        })
    }

    // ENGINES-3
    engines() {
        this.app.engine('handlebars', engine());
        this.app.set('view engine', 'handlebars');
    }
    
    // LISTENER-4
    listen() {
        this.socket;
    }
}