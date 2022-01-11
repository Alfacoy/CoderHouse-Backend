import { Router } from 'express';
import mock from '../helper/mocks.js';

const APIFakeProducts = Router();
const fakeProduct = new mock();

APIFakeProducts.get('', (req, res) => {
    const data = fakeProduct.generate(5);
    if (data.status === 'error') {
        res.status(400).send(data.message);
    } else {
        res.status(200).send(data.payload);
    }
})


export default APIFakeProducts;

