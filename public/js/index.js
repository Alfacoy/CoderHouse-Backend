/* const path = 'http://localhost:8080/api/productos/';

// ELEMENTS
const buscar = document.querySelector('#buscar');

// OBJECT-RENDER
const render = document.querySelector("#render");
const renderCleaner = document.querySelector("#limpiarRender")

// EVENT-LISTENER
// SEARCH-BY-PID
document.addEventListener('submit', (event) => {
    event.preventDefault()
    cleanRender(render);

    if (event.target.id === 'productByID') {
        const productByID = document.querySelector("#productByID");
        const data = new FormData(productByID);
        const pid = data.get('pid')
        if (pid) {
            fetch(`${path}${pid}`)
                .then(res => res.json())
                .then(item => {
                    if (render.firstChild !== null) {
                        render.removeChild(render.firstChild);
                    }
                    const card = createCard(item.title, item.thumbnail, item.price)
                    render.appendChild(card);
                })
                .catch(err => {
                    if (render.firstChild !== null) {
                        render.removeChild(render.firstChild);
                    }
                    
                    const P = document.createElement('p');
                    P.innerText = "error";
                    render.appendChild(P)
                })
        }
    }

    if (event.target.id === 'addNewProduct') {
        const addNewProduct = document.querySelector('#addNewProduct');
        const newProduct = new FormData(addNewProduct);
        const product = {
            title: newProduct.get('title'),
            thumbnail: newProduct.get('image'),
            price: newProduct.get('price')
        }

        fetch(`${path}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(product)
        })
            .then(res => res.json())
            .then(data => {
                console.log(data.id)
                createMessage(render, `ID: ${data.id}`)
            })
    }

    if (event.target.id === 'updateProduct') {
        const updateProduct = document.querySelector('#updateProduct');
        const data = new FormData(updateProduct);
        const obj = {
            id: parseInt(data.get('idUpdate')),
            title: data.get('titleUpdate'),
            thumbnail: data.get('imageUpdate'),
            price: parseInt(data.get('priceUpdate'))
        }
        fetch(`${path}${obj.id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(obj)
        }).then(res => res.json())
            .then(data => {
                createMessage(render,data.message)
        })
    }

    if (event.target.id === 'deleteProduct') {
        const deleteProduct = document.querySelector('#deleteProduct');
        const data = new FormData(deleteProduct);
        const pid = data.get('deleteById');
        fetch(`${path}${pid}`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json'
            }
        })
            .then(res => res.json())
            .then(data => {
                createMessage(render, data.message)
            })
            .catch(err => {
                console.log(err)
            })
    }

})

// CLEAN-RENDER
renderCleaner.addEventListener('click', () => cleanRender(render));

// SEARCH-ALL
buscar.addEventListener('click', (event) => {
    event.preventDefault();
    cleanRender(render)
    fetch("http://localhost:8080/api/productos/")
        .then(res => res.json())
        .then(data => data.map(item => {
            const card = createCard(item.title, item.thumbnail, item.price)
            render.appendChild(card);
        })
        )
}) */






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
