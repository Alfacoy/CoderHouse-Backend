/*=========================================*/
/*=                 CART                  =*/
/*=========================================*/

const cartList = document.querySelector('#cartList');
const productos = JSON.parse(localStorage.getItem('Cart'));
fetch('templates/cartList.handlebars')
    .then(res => res.text())
    .then(template => {
        const productsTemplate = Handlebars.compile(template);
        const templateObject = {
            productos: productos
        }
        const html = productsTemplate(templateObject);
        cartList.innerHTML = html;
    })

/*
const buyCart = document.querySelector('#buyCart');
buyCart.addEventListener('click', () => {
    console.log('Hola')
})*/
