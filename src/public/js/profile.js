/*=========================================*/
/*=              AUTH USER                =*/
/*=========================================*/
fetch('/auth/currentUser', {
    headers: {
        'Authorization': localStorage.getItem('Authorization'),
    }
}).then(res => res.json()).then(data => {
    if (data.status === 'Error') return location.replace('/login');
    /* 
    const username = document.querySelector('#userNameDB');
    const picture = document.querySelector('#picture');
    if (data.status === 'Success') {
        localStorage.setItem('currentUser', JSON.stringify(data))
        username.innerHTML = data.payload.displayName || data.payload.email;
        if (data.payload.picture) {
            picture.setAttribute('src', `${data.payload.picture}`)
        }
    } */
})


fetch('/auth/info', {
    headers: {
        'Email': localStorage.getItem('Email'),
    }
}).then(res => res.json()).then(data => {
    console.log(data)
})