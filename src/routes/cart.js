import { Router } from 'express';
import { showCart, addToCart, deleteCart, deleteProductCart, buyCart } from '../controllers/cart.js';

const APICart = Router();

/*=========================================*/
/*=                  API                  =*/
/*=========================================*/
APICart.get('/:id/products', showCart);
APICart.post('/:id/product', addToCart);
APICart.post('/:cid/buy', buyCart);
APICart.delete('/:id', deleteCart);
APICart.delete('/:id/product/:id_prod', deleteProductCart);

export default APICart;