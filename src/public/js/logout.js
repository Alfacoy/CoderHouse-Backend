/*=========================================*/
/*=             LOGOUT USER               =*/
/*=========================================*/
fetch('/auth/logout').then(res => res.json()).then(data => {
    localStorage.removeItem('CartID');
    if (data.status === 'Success') return location.replace('/login');
});

