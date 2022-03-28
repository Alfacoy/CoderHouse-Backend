// EXPRESS
import express from 'express';
import passport from 'passport';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import {engine} from 'express-handlebars';
import fileUpload from 'express-fileupload';
// SOCKET
import Socket from '../services/socket.js';
// UTILS
import __dirname from '../utils.js';
import initializePassportConfig from '../passport-config.js';
// ROUTES
import Views from '../routes/views.js';
import APIAuth from '../routes/auth.js';
import APIProducts from '../routes/products.js';
import APICart from '../routes/cart.js';
import APIProfile from '../routes/profile.js';
import APIFakeProducts from '../routes/fakeProducts.js'; // ELIMINAR
import APIInfo from '../routes/info.js'; // ELIMINAR
import APIRandom from '../routes/random.js'; // ELIMINAR

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

    middlewares() {
        this.app.use(express.static(`${__dirname}/public`));
        this.app.use(express.json({limit: '50mb'}));
        this.app.use(express.urlencoded({ extended: true, limit: '50mb' }));
        this.app.use(cors());
        this.app.use(cookieParser())
        initializePassportConfig();
        this.app.use(passport.initialize());
        this.app.use(fileUpload({
            useTempFiles : true,
            tempFileDir : '/tmp/'
        }));
        this.app.use((req, res, next) => {
            req.io = this.socket;
            next()
        })
    }

    routes() {
        this.app.use('/', Views);
        this.app.use('/auth', APIAuth);
        this.app.use('/user', APIProfile)
        this.app.use('/api/cart', APICart);
        this.app.use('/api/products', APIProducts);
        this.app.use('/api/productos-test', APIFakeProducts);
        this.app.use('/api/random', APIRandom);
        this.app.use('/info', APIInfo);
        this.app.use('/*', (req, res) => {
            res.status(400).send({
                error: -2,
                descripcion: `La ruta '${req.baseUrl}' con el método [${req.method}] no existe.`
            })
        })
    }

    engines() {
        this.app.engine('handlebars', engine({
            partialsDir: `${__dirname}/views/partials`
        }));
        this.app.set('view engine', 'handlebars');
        this.app.set('views', `${__dirname}/views`);
    }
    
    listen() {
        this.socket;
    }
}