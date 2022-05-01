const formUpdateProfile = document.querySelector('#formUpdateProfile');
const isCorrect = document.querySelector('#isCorrect');
formUpdateProfile.addEventListener('submit', (event) => {
    event.preventDefault();
    const data = new FormData(formUpdateProfile);

    fetch('/user/profile', {
        method: 'POST',
        headers: {
            'Authorization': localStorage.getItem('Authorization')
        },
        body: data,
    })
        .then(res=> res.json())
        .then(data => {
            const avatar = document.getElementsByName('avatar');
            avatar[0].value = ''
            isCorrect.textContent = data.message
        })
})
