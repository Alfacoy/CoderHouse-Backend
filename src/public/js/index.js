/*=========================================*/
/*=              INICIO SOCKET            =*/
/*=========================================*/
const socket = io();
const chatButton = document.querySelector('#chatButton');

// SOCKET PARA PRODUCTOS
socket.on('updateProducts', data => {
    const listOfProducts = document.querySelector('#listOfProducts');
    let productos = data.payload;
    fetch('templates/Productos.handlebars')
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

// SOCKET PARA WEB CHAT
socket.on('updateChat', data => {
    const chatBox = document.querySelector('#chatBox');
    const messages = data.payload; // MODIFICAR LOS MENSAJES EN DATABASEFS
    if (messages) {
        messages.map(item => {
            chatBox.appendChild(addMessageChat(item.user, formatDate(item.date),item.message))
        })
    }
})

socket.on('webChat', (message) => {
    const chatBox = document.querySelector('#chatBox');
    const list = message;
    if (list) {
        chatBox.appendChild(addMessageChat(list.user, formatDate(list.date),list.message))
    } 
})

// EVENT LISTENER WEB CHAT
chatButton.addEventListener('click', (event) => {
    event.preventDefault();

    const chatInputMessage = document.querySelector('#messageChat');
    const chatInputEmail = document.querySelector('#emailChat');
    const objMessage = {
        user: chatInputEmail.value,
        message: chatInputMessage.value,
    }
    socket.emit('webChat', objMessage);

    chatInputMessage.value = '';
})
/*=========================================*/
/*=               FIN SOCKET              =*/
/*=========================================*/


/*=========================================*/
/*=            INICIO PRODUCTO            =*/
/*=========================================*/
// Formulario agregar producto
document.addEventListener('submit', (event) => {
    event.preventDefault();
    const form = document.querySelector('#formAddProduct');
    const data = new FormData(form);
    const obj = {
        title: data.get('title'),
        price: data.get('price'),
        thumbnail: data.get('thumbnail'),
        description: data.get('description'),
        stock: data.get('stock')
    }
    fetch('/api/productos/', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(obj)
    })
        .then(res => res.json())
        .then(data => {
           /*  location.href="/" */
        })
})
/*=========================================*/
/*=              FIN PRODUCTO             =*/
/*=========================================*/


/*=========================================*/
/*=             INICIO UTILS              =*/
/*=========================================*/
const addMessageChat = (user, date, message) => {
    const body = document.createElement('p');
    const userSpan = document.createElement('span');
    const dateSpan = document.createElement('span');
    const messageSpan = document.createElement('span');

    userSpan.innerText = `${user} `;
    dateSpan.innerText = `${date}: `;
    messageSpan.innerText = `${message}`;

    body.classList.add('lead');
    userSpan.setAttribute('style', 'color: blue; font-weight: bold;');
    dateSpan.setAttribute('style', 'color: brown;');
    messageSpan.setAttribute('style', 'color: green; font-style: italic;');

    body.appendChild(userSpan);
    body.appendChild(dateSpan);
    body.appendChild(messageSpan);

    return body;
}

const formatDate = date => {
    const data = new Date(date)
    const arr = {
        day: data.getDate(),
        month: data.getMonth() + 1,
        year: data.getFullYear(),
        hours: data.getHours(),
        minutes: data.getMinutes(),
        seconds: data.getSeconds()
    }
    const newDate = `[${arr.day}/${arr.month}/${arr.year} ${arr.hours}:${arr.minutes}:${arr.seconds}]`;
    return newDate;
}

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

// DEPRECATED
const createMessage = (zone, message) => {
    const p = document.createElement('p');
    p.innerText = message
    zone.appendChild(p);
}
/*=========================================*/
/*=             FIN UTILS                 =*/
/*=========================================*/