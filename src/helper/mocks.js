import faker from 'faker';

export default class mock{
    generate = (n) => {
        let fakeProduct = [];
        for (let i = 0; i < n; i++) {
            let data = {
                title: faker.commerce.product(),
                price: faker.commerce.price(1, 10000, 0, '$'),
                thumbnail: faker.image.imageUrl(300, 400, 'business', true, true)
            }
            fakeProduct.push(data);
        }
        return fakeProduct;
    }
}