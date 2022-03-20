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





 /*
const chatButton = document.querySelector('#chatButton');

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
 */

/*=========================================*/
/*=                 UTILS                 =*/
/*=========================================*/
/* const addMessageChat = (user, date, message) => {
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
} */