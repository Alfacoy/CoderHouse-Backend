import { request, response } from 'express';
import { Cart, Product } from '../daos/index.js';
import {sendEmail} from "../helpers/mail.js";
import {sendMessageToSMS, sendMessageToWS} from "../helpers/twilio.js";

const showCart = (req = request, res = response) => {
    // Muestra todos los productos de un carrito
    let { id } = req.params;
    Cart.getById(id).then(item => {
        if (item.status === 'Error') {
            res.status(404).send(item.message);
        } else {
            res.status(200).send(item.payload)
        }
    })
}

const createCart = (req = request, res = response) => {
    // Crea un nuevo carrito y retorna el ID
    const newCart = {
        productos: []
    }
    Cart.save(newCart).then(item => {
        if (item.status === 'Error') {
            res.status(404).send(item.message);
        } else {
            res.status(201).send({ id: JSON.stringify(item.id)})
        }
    })
}

const addToCart = (req = request, res = response) => {
    // Agrega productos al carrito según su ID
    const { id } = req.params;
    const { pid } = req.body;

    Cart.addToCart(id, pid).then(e => {
        if (e.status === 'Error') {
            return res.status(404).send({
                status: 'Error',
                message: e.message
            });
        } else {
            return res.status(201).send({
                status: 'Success',
                message: e.message
             })
        }
    })
}

const deleteCart = (req = request, res = response) => {
    // Borra un carrito con todos sus productos
    let { id } = req.params;
    Cart.deleteById(id)
        .then(item => {
            if (item.status === 'Error') {
                res.status(404).send(item.message);
            } else {
                res.status(200).send(item.message)
            }
        })
}

const deleteProductCart = (req = request, res = response) => {
    // Borra un producto del carrita
    let { id, id_prod } = req.params;

    Cart.removeFromCart(id, id_prod).then(e => {
        if (e.status === 'Error') {
            res.status(404).send(e.message);
        } else {
            res.status(200).send(e.message);
        }
    })
}

const buyCart = async (req = request, res = response) => {
    const {cid} = req.params;
    const {email,fullName,phone} = req.body
    let list = ``;
    let body = `<ul>${list}</ul>`;

    if(!email || !fullName) return res.status(404).send({status: 'Error', message: 'Faltan datos para realizar la compra.'})

    try{
        const productsInCart = await Cart.getById (cid);

        if(!productsInCart.payload) return res.status(404).send({status: 'Error', message: 'No hay productos en el carro para comprar.'})
        const products = productsInCart.payload.productos;
        for(let i = 0; i < products.length; i++){
            try{
                let detail = await Product.getById(products[i]).then(prod => `${prod.payload.title}: $${prod.payload.price}`)
                list += `<li>${detail}</li>`
                await Cart.removeFromCart(cid,products[i])
            } catch (error){
                return res.status(400).send({status: 'Error', message: error})
            }
        }

        body =  `
            <p>Se realizó la siguiente compra en tu tienda:</p>
            <ul>${list}</ul>
            `

        await sendEmail(`Nuevo pedido de ${fullName} - ${email}.`, body);
        /*await sendMessageToWS(`Nuevo pedido de ${fullName} - ${email}.`)*/
        await sendMessageToSMS('Su pedido se encuentra en proceso');
        return res.send({status: 'Success', message: 'Se realizo la compra de manera correcta.'});
    } catch (error) {
        return res.status(400).send({status: 'Error', message: error})
    }
}

export {
    showCart,
    createCart,
    addToCart,
    buyCart,
    deleteCart,
    deleteProductCart
}