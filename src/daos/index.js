let Product;
let Cart;
let User;
let persistens = "mongo";

switch (persistens) {
    case "fileSystem":
        const { default: ProductFileSystem } = await import('./product/productFileSystem.js');
        const { default: CartFileSystem } = await import('./cart/cartFileSystem.js');
        Product = new ProductFileSystem();
        Cart = new CartFileSystem();
        break;
    case "mongo":
        const { default: ProductMongo } = await import('./product/productMongo.js');
        const { default: CartMongo } = await import('./cart/cartMongo.js');
        const { default: UserMongo } = await import('./user/userMongo.js');
        Product = new ProductMongo();
        Cart = new CartMongo();
        User = new UserMongo();
        break;
    case "firebase":
        const { default: ProductFirebase } = await import('./product/productFirebase.js');
        const { default: CartFirebase } = await import('./cart/cartFirebase.js');
        Product = new ProductFirebase();
        Cart = new CartFirebase();
        break
    default:
}

export {
    Product,
    Cart,
    User,
    persistens
}