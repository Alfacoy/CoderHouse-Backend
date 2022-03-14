import { Router } from 'express';
import passport from 'passport';
import { Login, Home, Register, Cart, Profile, Admin, Contact, Logout } from '../controllers/views.js';

const Views = Router();

Views.get('/', Home);
Views.get('/login', Login);
Views.get('/logout', Logout);
Views.get('/register', Register)
Views.get('/contacto', Contact);
Views.get('/carrito', passport.authenticate('jwt', { session: false }), Cart);
Views.get('/perfil', Profile);
Views.get('/admin', Admin);

export default Views;