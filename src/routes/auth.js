import { Router } from 'express';
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
    if (req.session) return res.status(200).send({ status: 'Success', payload: req.session.user })
    return res.status(400).send({ status: 'Error', message: 'No hay usuario logeado.' })
})

APIAuth.post('/login', (req, res) => {
    const { username } = req.body;
    if (!username) return res.status(401).send({ status: 'Error', message: 'No se puede logear sin nombre de usuario.' })
    if (username === 'admin' || username === 'Admin') {
        req.session.user = {
            username: username,
            role: 'admin'
        }
        return res.status(200).send({ status: 'Success', message: 'Usuario logeado con éxito.' })
    }

    req.session.user = {
        username: username,
        role: "member"
    }
    return res.status(200).send({ status: 'Success', message: 'Usuario logeado con éxito.' })
})

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
})

APIAuth.get('/error', (req, res) => {
    res.render('pages/error.html')
})

export default APIAuth;