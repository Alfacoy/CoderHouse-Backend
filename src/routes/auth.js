import { Router } from 'express';
import passport from 'passport';
import { login, register, currentUser, logout, info } from '../controllers/auth.js';
import upload from '../helpers/upload.js';

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
/*=             GITHUB AUTH             =*/
/*=========================================*/

/*=========================================*/
/*=             GOOGLE AUTH             =*/
/*=========================================*/

/*=========================================*/
/*=               MY AUTH                 =*/
/*=========================================*/
APIAuth.post('/register', upload.single('avatarToRegister'), register);
APIAuth.post('/login', login);
APIAuth.get('/currentUser', currentUser);
APIAuth.get('/logout', logout);
APIAuth.get('/info', info)

export default APIAuth;