import { request, response } from 'express';
import cloudinary from 'cloudinary'
import { errorLogger} from "../helpers/logger.js";
import { User } from '../daos/index.js';
import config from "../config.js";

const imageStorage = cloudinary.v2
imageStorage.config(config.cloudinary.API)

const updateAvatar = async (req = request, res = response) => {
    if(!req.files) return res.status(404).send({status: 'Error', message: 'No hay archivo que actualizar.'})
    try{
        const { email } = req.body
        const user = await User.getUserByEmail(email);
        const {tempFilePath} = req.files.avatar;
        const avatar = await imageStorage.uploader.upload(tempFilePath);
        await User.update(user.payload._id, {
            picture: avatar.secure_url
        })
        res.status(200).send({status: 'Success', message: 'Usuario actualizado con éxito.'} )
    } catch (error) {
        errorLogger.error(error)
        res.status(400).send({status: 'Error', error})
    }
}

export {
    updateAvatar
}