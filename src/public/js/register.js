/*=========================================*/
/*=             REGISTER USER              =*/
/*=========================================*/
const registerForm = document.querySelector('#registerFormUser');
registerForm.addEventListener('submit', (event) => {
    event.preventDefault();
    let data = new FormData(registerForm);
    const userToRegister = {
        first_name: data.get('nameToRegister'),
        last_name: data.get('lastNameToRegister'),
        email: data.get('emailToRegister'),
        adress: data.get('adressToRegister'),
        age: data.get('ageToRegister'),
        phone: data.get('phoneToRegister'),
        picture: data.get('avatarToRegister'),
        password: data.get('passToRegister')
    }   
    fetch('/auth/register', {
        method: "POST",
        body: data
    }).then(res => res.json()).then(data => {
        if (data.status === 'Error') return console.error('Hubo un error al tratar de registrarse.');
        if (data.status === 'Success') {
            localStorage.setItem('Authorization', data.token);
            localStorage.setItem('CartID', data.cart);
            localStorage.setItem('Email', data.email);
            localStorage.setItem('Cart', JSON.stringify([]));
            return location.replace('/');
        }
    })
})

