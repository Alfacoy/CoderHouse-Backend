const io = io()

// Formulario agregar producto
document.addEventListener('submit', (event) => {
    event.preventDefault();
    const form = document.querySelector('#formAddProduct');
    const data = new FormData(form);
    const obj = {
        title: data.get('title'),
        price: data.get('price'),
        thumbnail: data.get('thumbnail')
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

            console.log(data)
            location.href="/"
        })
})

// FUNCTIONS
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

const createMessage = (zone,message) => {
    const p = document.createElement('p');
    p.innerText = message
    zone.appendChild(p);
}

const cleanRender = (zone) => {
    while (zone.firstChild) {
        zone.removeChild(zone.firstChild)
    }
}
