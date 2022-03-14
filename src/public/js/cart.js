/*=========================================*/
/*=              AUTH USER                =*/
/*=========================================*/
fetch('/carrito', {
    headers: {
        'Authorization': localStorage.getItem('Authorization'),
    }
}).then(res => res.json()).then(data => {
    console.log(data)
    if (data.status === 'Error') return location.replace('/login');
})

/*=========================================*/
/*=                 CART                  =*/
/*=========================================*/

fetch('/auth/info', {
    headers: {
        'Email': localStorage.getItem('Email')
    }
}).then(res => res.json()).then(data => console.log(data))













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


const buyCart = document.querySelector('#buyCart');
addEventListener('click', () => {
    console.log('Hola')
})