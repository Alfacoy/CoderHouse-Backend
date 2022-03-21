import { request, response } from 'express';

const Home = async (req = request, res = response) => {
    const render = {isAdmin: false,isConnected: false}
    if(req.user.role === 'admin') render.isAdmin = true
    if(req.user) render.isConnected = true

    res.render('Home', {
        head_title: 'Ecommerce',
        isAdmin: render.isAdmin,
        isConnected: render.isConnected
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
    const render = {isAdmin: false,isConnected: false}
    if(req.user.role === 'admin') render.isAdmin = true
    if(req.user) render.isConnected = true

    res.render('Profile', {
        head_title: 'Mi Perfil',
        isAdmin: render.isAdmin,
        isConnected: render.isConnected,
        first_name: req.user.first_name,
        last_name: req.user.last_name,
        email: req.user.email,
        adress: req.user.adress,
        phone: req.user.phone,
        age: req.user.age
    })
}

const Cart = (req = request, res = response) => {
    const render = {isAdmin: false,isConnected: false}
    if(req.user.role === 'admin') render.isAdmin = true
    if(req.user) render.isConnected = true

    res.render('Cart', {
        head_title: 'Carrito',
        isAdmin: render.isAdmin,
        isConnected: render.isConnected,
        fullName: `${req.user.first_name} ${req.user.last_name}`,
        adress: req.user.adress,
        email: req.user.email,
        phone: req.user.phone
    })
}

const Admin = (req = request, res = response) => {
    const render = {isAdmin: false,isConnected: false}
    if(req.user.role === 'admin') render.isAdmin = true
    if(req.user) render.isConnected = true

    res.render('Admin', {
        head_title: 'Dashboard',
        isAdmin: render.isAdmin,
        isConnected: render.isConnected
    })
}

const Contact = (req = request, res = response) => {
    const render = {isAdmin: false,isConnected: false}
    if(req.user.role === 'admin') render.isAdmin = true
    if(req.user) render.isConnected = true

    res.render('Contact', {
        head_title: 'Contacto',
        isAdmin: render.isAdmin,
        isConnected: render.isConnected
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

