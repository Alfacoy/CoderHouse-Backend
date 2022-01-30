/*=========================================*/
/*=             REGISTER USER              =*/
/*=========================================*/
const registerForm = document.querySelector('#registerFormUser');
registerForm.addEventListener('submit', (event) => {
    event.preventDefault();
    let data = new FormData(registerForm);
    const userToRegister = {
        email: data.get('emailToRegister'),
        password: data.get('passToRegister')
    }   
    fetch('/auth/register', {
        method: "POST",
        body: JSON.stringify(userToRegister),
        headers: { 'Content-Type': 'application/json' }
    }).then(res => res.json()).then(data => {
        if (data.status === 'Error') return console.error('Hubo un error al tratar de registrarse.');
        if (data.status === 'Success') return location.replace('../index.html'); 
    })
})

