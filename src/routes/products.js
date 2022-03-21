import { Router } from 'express';
import { getAllProducts, getProductByPID, updateProduct, deleteProduct, saveProduct} from "../controllers/products.js";
import { middlewareAuthRole } from '../helpers/middlewares.js';

const APIProducts = Router();

/*=========================================*/
/*=                  API                  =*/
/*=========================================*/

APIProducts.get('/', getAllProducts);
APIProducts.get('/:pid', getProductByPID);
APIProducts.post('/', middlewareAuthRole, saveProduct);
APIProducts.put('/:pid', middlewareAuthRole, updateProduct);
APIProducts.delete('/:pid', middlewareAuthRole, deleteProduct)

export default APIProducts;