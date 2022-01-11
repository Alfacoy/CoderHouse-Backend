import { Router } from 'express';
import mock from '../helper/mocks.js';

const APIFakeProducts = Router();
const fakeProduct = new mock();

APIFakeProducts.get('', (req, res) => {
    res.send(fakeProduct.generate(5));
})


export default APIFakeProducts;

