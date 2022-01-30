/*=========================================*/
/*=              AUTH USER                =*/
/*=========================================*/
fetch('/auth/currentUser').then(res => res.json()).then(data => {
    const username = document.querySelector('#userNameDB');
    const picture = document.querySelector('#picture');
    if (data.status === 'Error') return location.replace('./pages/login.html');
    if (data.status === 'Success') {
        localStorage.setItem('currentUser', JSON.stringify(data))
        username.innerHTML = data.payload.displayName || data.payload.email;
        if (data.payload.picture) {
            picture.setAttribute('src', `${data.payload.picture}`)
        }
    }
})
    
const logoutBtn = document.querySelector('#logoutBtn');
logoutBtn.addEventListener('click', () => {
    fetch('/auth/logout').then(res => res.json()).then(data => {
        console.log(data)
        if (data.status === 'Error') return console.log(data.message)
        location.replace('./pages/logout.html')   
    })    
})

/*=========================================*/
/*=               SOCKET                  =*/
/*=========================================*/
const socket = io();
const chatButton = document.querySelector('#chatButton');

// UPDATE PRODUCTS
socket.on('updateProducts', data => {
    const listOfProducts = document.querySelector('#listOfProducts');
    const productos = data.payload;
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

// UPDATE WEB CHAT
socket.on('updateChat', data => {
    const chatBox = document.querySelector('#chatBox');
    const messages = data.payload;
    if (messages.length > 0) {
        messages.map(item => {
            chatBox.appendChild(addMessageChat(item.author.email, item.createdAt, item.text))
        })
    } else {
        createMessage(chatBox, 'No hay mensajes de chat.')
    }   
})

socket.on('webChat', (message) => {
    const chatBox = document.querySelector('#chatBox');
    const list = message;
    if (list) return chatBox.appendChild(addMessageChat(list.author.email,list.createdAt, list.text))  
})

// EVENT LISTENER WEB CHAT
chatButton.addEventListener('click', (event) => {
    event.preventDefault();
    const chatInputMessage = document.querySelector('#messageChat');
    const chatInputEmail = document.querySelector('#emailChat');
    const chatInputFirstName = document.querySelector('#firstNameChat');
    const chatInputLastName = document.querySelector('#lastNameChat');
    const chatInputAge = document.querySelector('#ageChat');
    const objMessage = {
        email: chatInputEmail.value,
        firstName: chatInputFirstName.value,
        lastName: chatInputLastName.value,
        age: chatInputAge.value,
        message: chatInputMessage.value,
    }
    socket.emit('webChat', objMessage);
    chatInputMessage.value = '';
})

/*=========================================*/
/*=               PRODUCT                 =*/
/*=========================================*/
// Formulario agregar producto
const formAddProduct = document.querySelector('#formAddProduct');
formAddProduct.addEventListener('submit', (event) => {
    event.preventDefault();
    const messageBox = document.querySelector('#messageBox');
    const data = new FormData(formAddProduct);
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
        if (messageBox.firstChild) {
            cleanRender(messageBox); 
        }
        if (data.error === -2) return createMessage(messageBox, 'No tienes permisos para crear un producto.')
        createMessage(messageBox, 'Producto creado con éxito.')
    })
    
    setTimeout(() => {
        cleanRender(messageBox)
    }, 5000);
})

/*=========================================*/
/*=                 UTILS                 =*/
/*=========================================*/
const addMessageChat = (user, date, message) => {
    const body = document.createElement('p');
    const userSpan = document.createElement('span');
    const dateSpan = document.createElement('span');
    const messageSpan = document.createElement('span');

    userSpan.innerText = `${user} `;
    dateSpan.innerText = `${formatDate(date)} `;
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

const createMessage = (zone, message) => {
    const p = document.createElement('p');
    p.innerText = message
    p.setAttribute('class', 'lead')
    zone.appendChild(p);
}