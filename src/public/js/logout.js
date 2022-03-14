/*=========================================*/
/*=             LOGOUT USER               =*/
/*=========================================*/
fetch('/auth/logout').then(res => res.json()).then(data => {
    localStorage.removeItem('Authorization');
    localStorage.removeItem('CartID');
    localStorage.removeItem('Email');
    if (data.status === 'Success') return location.replace('/login');
});

