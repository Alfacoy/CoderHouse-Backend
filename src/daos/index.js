let product;
let cart;
let persistens = "mongo";

switch (persistens) {
    case "fileSystem":
        const { default: ProductFileSystem } = await import('./product/productFileSystem.js');
        const { default: CartFileSystem } = await import('./cart/cartFileSystem.js');
        product = new ProductFileSystem();
        cart = new CartFileSystem();
        break;
    case "mongo":
        const { default: ProductMongo } = await import('./product/productMongo.js');
        const { default: CartMongo } = await import('./cart/cartMongo.js');
        product = new ProductMongo();
        cart = new CartMongo();
        break;
    case "firebase":
        const { default: ProductFirebase } = await import('./product/productFirebase.js');
        const { default: CartFirebase } = await import('./cart/cartFirebase.js');
        product = new ProductFirebase();
        cart = new CartFirebase();
        break
    default:
}

export {
    product,
    cart,
    persistens
}