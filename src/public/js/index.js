/*=========================================*/
/*=               SOCKET                  =*/
/*=========================================*/
const socket = io();
// UPDATE PRODUCTS
socket.on('updateProducts', data => {
    const listOfProducts = document.querySelector('#listOfProducts');
    const productos = data.payload;
    fetch('templates/Cards.handlebars')
        .then(res => res.text())
        .then(template => {
            const productsTemplate = Handlebars.compile(template);
            const templateObject = {
                productos: productos
            }
            const html = productsTemplate(templateObject);
            listOfProducts.innerHTML = html;
        })
})

/*=========================================*/
/*=                 CART                  =*/
/*=========================================*/
function addCart(target) {
    const cartId = localStorage.getItem('CartID')
    const prodId = {
        pid: target.name
    };

    fetch(`/api/cart/${cartId}/product`, {
        method: 'POST',
        body: JSON.stringify(prodId),
        headers: {
            'Content-Type': 'application/json'
        }
    }).then(res => res.json())
        .catch(error => console.error('Error:', error))
        .then(data => {
            if (data.status != 'Error') {
                const storage = JSON.parse(localStorage.getItem('Cart'));
                const title = target.parentNode.parentNode.firstElementChild.firstElementChild.textContent;
                const price = target.parentNode.previousElementSibling.firstElementChild.children[3].textContent;
                const stock = target.parentNode.previousElementSibling.firstElementChild.children[5].textContent;

                const newProduct = {
                    title,
                    price,
                    stock,
                    id: prodId.pid
                }
                const newStorage = [
                    ...storage,
                    newProduct
                ]
                localStorage.setItem('Cart', JSON.stringify(newStorage))
            } 
        })
}







/*=========================================*/
/*=                 UTILS                 =*/
/*=========================================*/
/*
const createCard = (title, thumbnail, price) => {
    // CREATE-CARD
    const card = document.createElement('div');
    const titleCard = document.createElement('p');
    const priceCard = document.createElement('span');
    const thumbnailCard = document.createElement('img');

    // POPULATE-CONTENT
    titleCard.innerText = title
    priceCard.innerText = price
    thumbnailCard.setAttribute('src', thumbnail)

    // POPULATE-CARD
    card.appendChild(titleCard);
    card.appendChild(priceCard);
    card.appendChild(thumbnailCard)

    return card
}

const cleanRender = (zone) => {
    while (zone.firstChild) {
        zone.removeChild(zone.firstChild)
    }
}

const createMessage = (zone, message) => {
    const p = document.createElement('p');
    p.innerText = message
    p.setAttribute('class', 'lead')
    zone.appendChild(p);
} */