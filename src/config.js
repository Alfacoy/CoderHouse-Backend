import __dirname  from './utils.js';
import dotenv from 'dotenv';
dotenv.config();

const config = {
    fileSystem: {
        baseUrl: `${__dirname}/files/`//Borrar
    },
    mongo: {
        baseUrl: `mongodb+srv://${process.env.MONGO_USER}:${process.env.MONGO_PASS}@${process.env.MONGO_DB}.zg59x.mongodb.net`
    },
    firebase: {//Borrar
        serviceAccount: {
            "type": process.env.TYPE,
            "project_id": process.env.PROJECT_ID,
            "private_key_id": process.env.PRIVATE_KEY_ID,
            "private_key": process.env.PRIVATE_KEY,
            "client_email": process.env.CLIENT_EMAIL,
            "client_id": process.env.CLIENT_ID,
            "auth_uri":  process.env.AUTH_URI,
            "token_uri": process.env.TOKEN_URI,
            "auth_provider_x509_cert_url": process.env.AUTH_PROVIDER_X509,
            "client_x509_cert_url": process.env.CLIENT_X509
        },
        baseUrl: process.env.FIREBASE_URL
    },
    jwt: {
        secret: process.env.JWT_SECRET
    },
    gmail: {
        password: process.env.GMAIL_PASS
    },
    cloudinary: {
        API: process.env.CLOUDINARY_URL
    }
}

export default config;