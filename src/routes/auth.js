import { Router } from 'express';
import passport from 'passport';
import {passportCall} from "../helpers/middlewares.js";
import { login, register, currentUser, logout } from '../controllers/auth.js';
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
APIAuth.post('/register', passportCall('register'), register);
APIAuth.post('/login', passportCall('login'), login);
APIAuth.get('/currentUser', currentUser);
APIAuth.get('/logout', logout);

export default APIAuth;


/*upload.single('avatarToRegister')*/