import { request, response } from 'express';
import cloudinary from 'cloudinary'
import { User, Cart } from '../daos/index.js';
import { hashPass, compareHash } from '../helpers/bcrypt.js';
import { webToken, verifyWebToken } from '../helpers/jwt.js';
import { sendEmail } from '../helpers/mail.js';
import config from '../config.js'

const imageStorage = cloudinary.v2
imageStorage.config(config.cloudinary.API)


const login = async (req = request, res = response) => {
    const { email, password } = req.body;
    try {
        if (!email || !password) return res.status(400).send({ status: 'Error', message: 'Se debe agregar un email y una contraseña para logearse.' });

        const userExist = await User.getUserByEmail(email);
        if (!userExist) return res.status(404).send({ status: 'Error', message: 'El email no existe en la base de datos.' });
        
        const comparePass = await compareHash(password, userExist.payload.password)
        if (!comparePass) return res.status(400).send({ status: 'Error', message: 'La contraseña es incorrecta.' });
        
        const token = await webToken(userExist.payload._id);
        
/*         req.session.user = {
            connected: true,
            admin: userExist.payload.role === 'admin' ? true : false,
        }; */
        
        res.status(200).send({
            status: 'Success',
            token: `Bearer ${token.payload.token}`,
            role: userExist.payload.role,
            cart: userExist.payload.cart,
            email: userExist.payload.email
        });  
    } catch (error) {
        res.status(500).send({status: 'Error', message: 'Hubo un error al generar el WebToken.'})   
    }
}

const register = async (req = request, res = response) => {
    const { nameToRegister, lastNameToRegister, emailToRegister, adressToRegister, ageToRegister, phoneToRegister, passToRegister } = JSON.parse(JSON.stringify(req.body));
    const picture = req.file
    
    try {
        if (!emailToRegister || !phoneToRegister || !nameToRegister || !lastNameToRegister || !adressToRegister || !ageToRegister || !passToRegister || !picture)
            return res.status(400).send({ status: 'Error', message: 'Debe completar todos los datos obligatorios para registrarse.' });

        const userExist = await User.getUserByEmail(emailToRegister);
        if (userExist.status === 'Success') return res.status(400).send({ status: 'Error', message: 'Ya existe un usuario con el email seleccionado.' });
        
        //ASIGNAR CARRITO AL USUARIO
        const createCart = await Cart.save({
            productos: []
        });
        
        //CREAR NOMBRE DE USUARIO
        const username = `${nameToRegister.slice(0, 3)}${lastNameToRegister.slice(0, 3)}${Math.round(Math.random() * 100)}`;
        
        //SUBIR IMÁGEN A CLOUDINARY
        const { path } = picture
        const avatar = await imageStorage.uploader.upload(path)

        const data = {
            first_name: nameToRegister,
            last_name: lastNameToRegister,
            email: emailToRegister,
            adress: adressToRegister,
            age: ageToRegister,
            phone: phoneToRegister,
            picture: avatar.secure_url,
            username,
            password: await hashPass(passToRegister),
            role: 'member',
            cart: createCart.id
        }
        
        const newUser = await User.save(data)
        const token = await webToken(newUser.id);
        
        //ENVIAR EMAIL AL ADMINISTRADOR
        await sendEmail()
        
/*         req.session.user = {
            connected: true,
            admin: false,
        };
 */
        return res.status(200).send({
            status: 'Success',
            message: 'Usuario registrado correctamente.',
            payload: newUser,
            token: `Bearer ${token.payload.token}`,
            cart: data.cart,
            email: data.email
        }) 
    } catch (error) {
        res.status(500).send({ status: 'Error', message: 'Hubo un error al tratar de registrar un usuario.' })
    }
}

const currentUser = async (req = request, res = response) => {
    try {
        const token = req.header('Authorization');
        const contentToken = await verifyWebToken(token)
        return res.status(200).send({status:'Success', payload: contentToken })
    } catch (error) {
        /* req.session.destroy() */
        res.status(401).send({ status: 'Error', message: 'Hubo un error al tratar de registrar un usuario.' })
    }
}

const logout = (req = request, res = response) => {
    try {
        req.session.destroy()
        res.status(200).send({ status: 'Success', message: 'Usuario deslogeado con éxito.' })
    } catch (error) {
        res.status(404).send({ status: 'Error', message: 'No hay usuario que deslogear.' })
    }
}

const info = async (req = request, res = response) => {
    const email = req.header('Email');
    try {
        if (!email) return res.status(400).send({ status: 'Error', message: 'Se debe agregar un email para obtener su información.' });

        const userExist = await User.getUserByEmail(email);
        if (!userExist) return res.status(404).send({ status: 'Error', message: 'El email no existe en la base de datos.' });

        const data = {
            first_name: userExist.payload.first_name,
            last_name: userExist.payload.last_name,
            age: userExist.payload.age,
            adress: userExist.payload.adress,
            phone: userExist.payload.phone,
            username: userExist.payload.username,
            picture: userExist.payload.picture
        }

        res.status(200).send({
            status: 'Success',
            payload: data
        });
    } catch (error) {
        res.status(500).send({ status: 'Error', message: 'Hubo un error al generar el WebToken.' })
    }
}

export {
    login,
    register,
    logout,
    currentUser,
    info
}
