import twilio from "twilio";
import config from "../config.js";
import {errorLogger, logger} from "./logger.js";

const accounID = config.twilio.ID;
const token = config.twilio.TOKEN;
const client = twilio(accounID,token);


const sendMessageToWS = async (html) => {
    const option = {
        body: html,
        from: 'whatsapp:+14155238886',
        to:'whatsapp:+5491132060512'
    }
    try{
        const message= await client.messages.create(option);
        console.log('WS')
        logger.info(message)
    } catch (error) {
        errorLogger.error(error)
    }
}

const sendMessageToSMS = async (html,to) => {
    console.log('SMS HOLA')
    const option = {
        body: html,
        /*to:'+5491132060512'*/
        to: '+17629999105'
    }
    try{
        const message= await client.messages.create(option);
        console.log('SMS')
        logger.info(message)
    } catch (error) {
        errorLogger.error(error)
    }
}

export {
    sendMessageToWS,
    sendMessageToSMS
}


