/*=========================================*/
/*=             LOGOUT USER               =*/
/*=========================================*/
const userNameField = document.querySelector('#userName');
const userNameData = JSON.parse(localStorage.getItem('currentUser')).payload.username;
userNameField.innerText = userNameData;
setTimeout(() => {
    location.replace('./login.html');
}, 2000);
