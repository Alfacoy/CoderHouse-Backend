/*=========================================*/
/*=             LOGIN USER                =*/
/*=========================================*/
const loginForm = document.querySelector('#loginFormUser');
loginForm.addEventListener('submit', (event) => {
    event.preventDefault();
    let data = new FormData(loginForm);
    const userToLogin = {
        username: data.get('firstNameLog')
    }
    fetch('/login', {
        method: "POST",
        body: JSON.stringify(userToLogin),
        headers: {'Content-Type':'application/json'}
    }).then(res => res.json()).then(data => {
        if (data.status === 'Error') return console.error('Hubo un error al tratar de logearse.');
        if(data.status === 'Success') return location.replace('../index.html');  
    })
})