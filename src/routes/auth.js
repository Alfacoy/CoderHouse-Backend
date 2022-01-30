import { Router } from 'express';
import bcrypt from 'bcrypt';
import passport from 'passport';
import { user } from '../daos/index.js';

const APIAuth = Router();

/*=========================================*/
/*=             FACEBOOK AUTH             =*/
/*=========================================*/
APIAuth.get('/facebook', passport.authenticate('facebook', { scope: ['public_profile'] }))

APIAuth.get('/facebook/callback', passport.authenticate('facebook', {
    failureRedirect: '/auth/error',
    successRedirect: '/',
}))

/*=========================================*/
/*=               MY AUTH                 =*/
/*=========================================*/
APIAuth.get('/currentUser', (req, res) => {
    if (req.isAuthenticated()) return res.status(200).send({ status: 'Success', payload: req.user.payload })
    if (req.session.user) return res.status(200).send({ status: 'Success', payload: req.session.user })
    return res.status(400).send({ status: 'Error', message: 'No hay usuario logeado.' })
});

APIAuth.post('/register', async (req, res) => {
    const { email, password } = req.body;
    if (!email || !password) return res.status(401).send({ status: 'Error', message: 'No hay datos suficientes para registrarse.' });
    const hashPass = await bcrypt.hash(password, 8)
    try {
        const newUser = {
            email: email,
            password: hashPass,
            role: 'member'
        };
        let data = await user.save(newUser);
        req.session.user = {
            email: email,
            role: 'member'
        };
        return res.status(200).send({ status: 'Success', message: 'Usuario logeado con éxito.', payload: data });
    } catch (err) {
        return res.status(400).send({ status: 'Error', message: 'Hubo un error al tratar de registrarse.'});
    }
});

APIAuth.post('/login', async (req, res) => {
    const { email, password } = req.body;
    if (!email || !password) return res.status(401).send({ status: 'Error', message: 'Debe ingresar un email y contraseña para ingresar.' })
    try {
        let data = await user.getUserByEmail(email);
        const isEqual = await bcrypt.compare(password, data.payload.password)
        if (isEqual) {            
            req.session.user = {
                email: email,
                role: data.payload.role
            }
            return res.status(200).send({ status: 'Success', message: 'Usuario logeado con éxito.' }) 
        } else {
            return res.status(400).send({ status: 'Error', message: 'La contraseña no coincide.'});
        }
    } catch (err) {
        return res.status(400).send({ status: 'Error', message: 'El usuario no existe.', error: err });
    }
});

APIAuth.get('/logout', (req, res) => {
    if (req.isAuthenticated()) {
        req.logOut();
        res.status(200).send({ status: 'Success', message: 'Usuario deslogeado' });
    }

    if (req.session.user) {
        req.session.destroy(err => {
            if (err) return res.status(404).send({ status: 'Error', message: 'Hubo un error al deslogear al usuario.' })
        });
        res.status(200).send({ status: 'Success', message: 'Usuario deslogeado' });
    }
});

APIAuth.get('/error', (req, res) => {
    res.render('pages/error.html')
});

export default APIAuth;