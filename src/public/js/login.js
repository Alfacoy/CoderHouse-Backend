/*=========================================*/
/*=             LOGIN USER                =*/
/*=========================================*/
const loginForm = document.querySelector('#loginFormUser');
loginForm.addEventListener('submit', (event) => {
    event.preventDefault();
    let data = new FormData(loginForm);
    const userToLogin = {
        email: data.get('emailToLog'),
        password: data.get('passToLogin')
    }
    fetch('/auth/login', {
        method: "POST",
        body: JSON.stringify(userToLogin),
        headers: {'Content-Type':'application/json'}
    }).then(res => res.json()).then(data => {
        if (data.status === 'Error') return console.error(data.message);
        if(data.status === 'Success') return location.replace('../index.html');
    })
})

/*=========================================*/
/*=          LOGIN USER FACEBOOK          =*/
/*=========================================*/
const loginBtn = document.querySelector('#facebookLogin');
loginBtn.addEventListener('click', (event) => {
    event.preventDefault();
    location = 'http://localhost:8080/auth/facebook';
})