/*=========================================*/
/*=             REGISTER USER              =*/
/*=========================================*/
const registerForm = document.querySelector('#registerFormUser');
registerForm.addEventListener('submit', (event) => {
    event.preventDefault();
    let data = new FormData(registerForm);
    let obj = {
        email: data.get('email'),
        password: data.get('password'),
        first_name: data.get('nameToRegister'),
        last_name: data.get('lastNameToRegister'),
        adress: data.get('adressToRegister'),
        age: data.get('ageToRegister'),
        phone: data.get('phoneToRegister')
    }
    fetch('/auth/register', {
        method: "POST",
        body: JSON.stringify(obj),
        headers:{
            "Content-Type":"application/json"
        }
    }).then(res => res.json()).then(data => {
        if (data.status === 'Error') return console.error('Hubo un error al tratar de registrarse.');
        if (data.status === 'Success') {
            localStorage.setItem('CartID', data.payload.cart);
            localStorage.setItem('Authorization',data.payload.token);
            localStorage.setItem('Cart', JSON.stringify([]));
            return location.replace('/');
        }
    })
})

