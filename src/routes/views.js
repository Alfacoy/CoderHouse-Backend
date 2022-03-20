import { Router } from 'express';
import { Login, Home, Register, Cart, Profile, Admin, Contact, Logout } from '../controllers/views.js';
import { passportCall} from "../helpers/middlewares.js";

const Views = Router();

Views.get('/', passportCall('jwt'),Home);
Views.get('/login', Login);
Views.get('/logout', Logout);
Views.get('/register', Register)
Views.get('/contacto', passportCall('jwt'), Contact);
Views.get('/carrito', passportCall('jwt'), Cart);
Views.get('/perfil', passportCall('jwt'), Profile);
Views.get('/admin', passportCall('jwt'), Admin);

export default Views;