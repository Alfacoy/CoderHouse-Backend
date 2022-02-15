import passport from 'passport';
import fbStrategy from 'passport-facebook';
import { user } from './daos/index.js';

const FacebookStrategy = fbStrategy.Strategy;
const DOMAIN = 'coderhouse-alfacoy.herokuapp.com'
const URL = `https://${DOMAIN}/auth/facebook/callback`;

const initializePassportConfig = () => {
    passport.use('facebook', new FacebookStrategy({
        clientID: process.env.CLIENT_ID_FACEBOOK,
        clientSecret: process.env.PASS_FACEBOOK,
        callbackURL: URL,
        profileFields: ['emails', 'picture', 'displayName']
    }, async (accessToken, refreshToken, profile, done) => {
        try {
            let findUser = await user.getUserByEmail(profile.emails[0].value);
            const newDataUser = {
                payload: {
                    ...findUser.payload._doc,
                    picture: profile.photos[0].value,
                    displayName: profile.displayName
                }
            }
            await user.update(newDataUser.payload._id, newDataUser.payload)
            try {
                let facebookUser = await user.getUserByEmail(profile.emails[0].value);
                done(null, facebookUser);
            } catch (err) {
                done(err);
            }
        } catch (err) {
            done(err);
        }
    }))
}

passport.serializeUser((facebookUser, done) => {
    done(null, facebookUser.payload._id);
})

passport.deserializeUser(async (id, done) => {
    let getUser = await user.getById(id);
    done(null, getUser)
})

export default initializePassportConfig;