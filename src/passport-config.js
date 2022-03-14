import passport from 'passport';
import { Strategy, ExtractJwt } from 'passport-jwt' 
import { User } from './daos/index.js';
import config from './config.js';

const initializePassportConfig = () => {
    console.log('holamunmdooo')
    var opts = {}
    opts.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken();
    opts.secretOrKey = config.jwt.secret;
    passport.use(new Strategy(opts, function (jwt_payload, done) {
        console.log(jwt_payload)
        /* User.findOne({ id: jwt_payload.sub }, function (err, user) {
            if (err) {
                return done(err, false);
            }
            if (user) {
                return done(null, user);
            } else {
                return done(null, false);
                // or you could create a new account
            }
        }); */
    }));
}

export default initializePassportConfig;