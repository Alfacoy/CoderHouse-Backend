import passport from 'passport';
import fbStrategy from 'passport-facebook';
import { user } from './daos/index.js';

const FacebookStrategy = fbStrategy.Strategy;
const DOMAIN = '3035-190-175-29-205.ngrok.io'
const URL = `https://${DOMAIN}/auth/facebook/callback`;

const initializePassportConfig = () => {
    passport.use('facebook', new FacebookStrategy({
        clientID: process.env.CLIENT_ID_FACEBOOK,
        clientSecret: process.env.PASS_FACEBOOK,
        callbackURL: URL,
        profileFields: ['emails', 'picture', 'displayName']
    }, async (accessToken, refreshToken, profile, done) => {
        try {
            let findUser = await user.getUserByEmail(profile);
            const newDataUser = {
                payload: {
                    ...findUser.payload._doc,
                    picture: profile.photos[0].value,
                    displayName: profile.displayName
                }
            }
            await user.update(newDataUser.payload._id, newDataUser.payload)
            try {
                let facebookUser = await user.getUserByEmail(profile);
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