// EXPRESS
import express from 'express';
import MongoStore from 'connect-mongo';
import session from 'express-session';
import cors from 'cors';
import { engine } from 'express-handlebars';
// SOCKET
import Socket from '../classes/socket.js';
// UTILS
import __dirname from '../utils.js';
import config from '../config.js';
// ROUTES
import APIProducts from '../routes/products.js'; 
import APIFakeProducts from '../routes/fakeProducts.js';
import APICart from '../routes/cart.js';

// INITIAL CONFIG
const initialConfig = {
    port: 8080
}

export default class Server {
    constructor(port = initialConfig.port/* , admin = initialConfig.admin */) {
        this.app = express();
        this.PORT = process.env.PORT || port;
        this.server = this.app.listen(this.PORT, () => console.log(`Servidor escuchando en el puerto: http://localhost:${this.PORT}`));
        this.socket = new Socket(this.server);
        this.admin = false;
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
            secret: "Ecommerce2022",
            resave: true,
            saveUninitialized: false,
            cookie: {
                maxAge: 100000
            }
        }))
        this.app.use((req, res, next) => {
            req.io = this.socket;
            req.auth = this.admin;
            next()
        })
    }
    
    // ROUTES-2
    routes() {

        this.app.post('/login', (req, res) => {
            const { username } = req.body;
            if (!username) return res.status(401).send({status:'Error', message:'No se puede logear sin nombre de usuario.'})
            if (username === 'admin' || username === 'Admin') {
                req.session.user = {
                    username: username,
                    role: 'admin'
                }
                return res.status(200).send({status: 'Success', message: 'Usuario logeado con éxito.'})
            } 
            
            req.session.user = {
                username: username,
                role: "member"
            }
            return res.status(200).send({status: 'Success', message: 'Usuario logeado con éxito.'})
        })

        this.app.get('/currentUser', (req, res) => {
            if (!req.session?.user) return res.status(400).send({ status: 'Error', message: 'No hay usuario logeado.' })
            if (req.session.user.username === 'admin' || req.session.user.username === 'admin') {
                this.admin = true;
            }
            res.status(200).send({status: 'Success', payload: req.session.user})
        })

        this.app.get('/logout', (req, res) => {
            req.session.destroy(err => {
                if (err) return res.status(404).send({ status: 'Error', message: 'Hubo un error al deslogear al usuario.' })
            });
            if (req.auth) {
                this.admin = false;
            }
            res.status(200).send({ status: 'Success' ,message: 'Usuario deslogeado' });
        })

        this.app.use('/api/productos', APIProducts);
        this.app.use('/api/productos-test', APIFakeProducts);
        this.app.use('/api/carrito', APICart);

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
        this.app.set('views','views'); // Arreglar ruta
        this.app.set('view engine', 'handlebars');
    }
    
    // LISTENER-4
    listen() {
        this.socket;
    }
}