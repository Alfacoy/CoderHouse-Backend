/*=========================================*/
/*=              AUTH USER                =*/
/*=========================================*/
/*fetch('/auth/currentUser', {
    headers: {
        'Authorization': localStorage.getItem('Authorization'),
    }
}).then(res => res.json()).then(data => {
    if (data.status === 'Error') return location.replace('/login');
})*/

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
            'Content-Type': 'application/json',
            'Authorization': localStorage.getItem('Authorization') 
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