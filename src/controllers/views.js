import { request, response } from 'express';

const Home = (req = request, res = response) => { 
    res.render('Home', {
        head_title: 'Ecommerce',
/*         isAdmin: req.session.user ? req.session.user.admin : false,
        isConnected: req.session.user ? req.session.user.connected : false */
    })   
}

const Login = (req = request, res = response) => {
    res.render('Login', {
        head_title: 'Conectate'
    })
}

const Logout = (req = request, res = response) => {
    res.render('Logout', {
        head_title: 'Adios'
    })
}

const Register = (req = request, res = response) => {
    res.render('Register', {
        head_title: 'Registrate'
    })
}

const Profile = (req = request, res = response) => {
    res.render('Profile', {
        head_title: 'Mi Perfil',/* 
        isAdmin: req.session.user ? req.session.user.admin : false,
        isConnected: req.session.user ? req.session.user.connected : false */
    })
}

const Cart = (req = request, res = response) => {
    res.render('Cart', {
        head_title: 'Carrito',/* 
        isAdmin: req.session.user ? req.session.user.admin : false,
        isConnected: req.session.user ? req.session.user.connected : false */
    })
}

const Admin = (req = request, res = response) => {
    res.render('Admin', {
        head_title: 'Dashboard',/* 
        isAdmin: req.session.user ? req.session.user.admin : false,
        isConnected: req.session.user ? req.session.user.connected : false */
    })
}

const Contact = (req = request, res = response) => {
    res.render('Contact', {
        head_title: 'Contacto',/* 
        isAdmin: req.session.user ? req.session.user.admin : false,
        isConnected: req.session.user ? req.session.user.connected : false */
    })
}

export {
    Home,
    Login,
    Logout,
    Register,
    Profile,
    Cart,
    Admin,
    Contact
}

