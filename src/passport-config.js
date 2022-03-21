import passport from 'passport';
import local from 'passport-local';
import { Strategy, ExtractJwt } from 'passport-jwt' 
import {Cart, User} from './daos/index.js';
import {cookieExtractor} from "./helpers/cookieExtractor.js";
import {compareHash, hashPass} from "./helpers/bcrypt.js";
import {errorLogger, warnLogger} from "./helpers/logger.js";
import config from './config.js';

const LocalStrategy = local.Strategy;

const initializePassportConfig = () => {
    passport.use('register', new LocalStrategy({passReqToCallback:true, usernameField: "email",session:false}, async(req,email,password,done)=>{
        const { first_name, last_name, adress, age, phone } = req.body;
        //const picture = req.file;
        try {
           if (!email || !phone|| !first_name || !last_name || !adress || !age || !password){
               warnLogger.warn('Datos insuficientes a la hora de registrarse.')
                return done(null,false,{ status: 'Error', message: 'Debe completar todos los datos obligatorios para registrarse.' });
           }

            const userExist = await User.getUserByEmail(email);
            if (userExist.status === 'Success') {
                warnLogger.warn('Email duplicado al tratar de registrarse.');
                return done(null,false,{ status: 'Error', message: 'Ya existe un usuario con el email seleccionado.' });
            }

            //ASIGNAR CARRITO AL USUARIO
            const createCart = await Cart.save({
                productos: []
            });

            //CREAR NOMBRE DE USUARIO
            const username = `${first_name.slice(0, 3)}${last_name.slice(0, 3)}${Math.round(Math.random() * 100)}`;

            //SUBIR IMÁGEN A CLOUDINARY
            //const { path } = picture
            //const avatar = await imageStorage.uploader.upload(path)

            const data = {
                first_name,
                last_name,
                email,
                adress,
                age,
                phone,
                username,
                password: await hashPass(password),
                role: 'member',
                cart: createCart.id
            };

            const newUser = await User.save(data);

            return done(null, {id: newUser.id, cart: data.cart, fullName: `${first_name} ${last_name}`, email: data.email, adress: data.adress, age: data.age, phone: data.phone});
        } catch (error) {
            errorLogger.error(error);
            done(error);
        }
    }))

   passport.use('login', new LocalStrategy({usernameField:"email"},async(email,password,done) => {
       try {
           if (!email || !password) return done(null,false,{ message: 'Se debe agregar un email y una contraseña para logearse.' });

           const userExist = await User.getUserByEmail(email);
           if (userExist.status === 'Error') return done(null,false,{ status: 'Error', message: 'El email no existe en la base de datos.' });

           const comparePass = await compareHash(password, userExist.payload.password);
           if (!comparePass) return done(null,false,{ status: 'Error', message: 'La contraseña es incorrecta.' });

           const result = {
               id: userExist.payload._id,
               role: userExist.payload.role,
               cart: userExist.payload.cart
           };
           done(null, result);
       } catch (error) {
           errorLogger.error(error);
           done(error);
       }
   }))

    passport.use('jwt',new Strategy({
        jwtFromRequest: ExtractJwt.fromExtractors([cookieExtractor]),
        secretOrKey: config.jwt.secret
        },
        async function (jwt_payload, done) {
       try{
           const data = await User.getById(jwt_payload.uid);
           if(data.payload === null) {
               errorLogger.error('Un usuario fue borrado de la base de datos pero aún mantiene su Token.');
               return done(null,false,{status: 'Error', message:'No hay usuario en la base.'});
           }
           const result = {
               id: data.payload._id,
               first_name: data.payload.first_name,
               last_name: data.payload.last_name,
               email: data.payload.email,
               age: data.payload.age,
               adress: data.payload.adress,
               phone: data.payload.phone,
               role: data.payload.role,
               username: data.payload.username,
               cart: data.payload.cart
           };
           return done(null, result, {status: 'Success', message:'Usuario encontrado.'});
       } catch (error) {
           errorLogger.error(error);
           return done(error, false);
       }
    }));
}

export default initializePassportConfig;