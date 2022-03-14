import { Router } from 'express';
import mock from '../helpers/mocks.js';

const APIFakeProducts = Router();
const fakeProduct = new mock();

APIFakeProducts.get('/', (req, res) => {
    if(!req.body.quantity) return res.status(404).send({status: 'Error', message: 'Debes agregar un "quantity" en la petición.'})
    const data = fakeProduct.generate(req.body.quantity);
    if (data.status === 'error') return res.status(400).send(data.message);
    res.status(200).send(data.payload);
})

export default APIFakeProducts;

