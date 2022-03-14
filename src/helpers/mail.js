import { createTransport } from 'nodemailer';
import config from '../config.js';

const sendEmail = async (to) => {
    const trasporter = createTransport({
        service: "gmail",
        port: 587,
        secure: false,
        auth: {
            user: "briandurand1990@gmail.com",
            pass: config.gmail.password
        }
    })

    const mailOptions = {
        from: "Servidor Node",
        to: "ninanbudevelop@gmail.com",
        subject: 'Mail de prueba',
        html: `<h1>Hola Mundo</h1>`
    }

    try {
        const info = await trasporter.sendMail(mailOptions)
    } catch (error) {
        console.log(error)
    }
}

export {
    sendEmail
}