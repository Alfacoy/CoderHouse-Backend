import Contenedor from "../../classes/databaseMongo.js";
import productSchema from "../../models/product.js";

export default class ProductMongo extends Contenedor {
    constructor() {
        super('product',productSchema)
    }
}