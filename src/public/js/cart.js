/*=========================================*/
/*=                 CART                  =*/
/*=========================================*/

const cartList = document.querySelector('#cartList');
const productos = JSON.parse(localStorage.getItem('Cart'));
const email = document.querySelector('#email').textContent;
const fullName = document.querySelector('#fullName').textContent;
const phone = document.querySelector('#phone').textContent;
fetch('templates/cartList.handlebars')
    .then(res => res.text())
    .then(template => {
        const productsTemplate = Handlebars.compile(template);
        const templateObject = {
            productos: productos
        }
        const html = productsTemplate(templateObject);
        cartList.innerHTML = html;

        const totalPrice = document.querySelector('#totalPriceOfProd');
        const quantityProd = document.querySelector("#quantityOfProd");

        const myCart = JSON.parse(localStorage.getItem('Cart'));
        let resultOfTotalPrice = 0
        for (let i = 0; i < myCart.length; i++){
            resultOfTotalPrice += parseInt(myCart[i].price.slice(1));
        }

        totalPrice.innerText = resultOfTotalPrice;
        quantityProd.innerText = myCart.length;

        const buyCart = document.querySelector('#buyCart');
        buyCart.addEventListener('click', () => {
            const obj = {
                email,
                fullName,
                phone
            }
            let itsOkey = confirm("¿Quieres realizar está compra?");
            if (itsOkey){
                const cartID = localStorage.getItem('CartID');
                fetch(`api/cart/${cartID}/buy`,{
                    method: "POST",
                    body: JSON.stringify(obj),
                    headers: {'Content-Type':'application/json'}
                })
                    .then(res => res.json())
                    .then(data => {
                        localStorage.setItem('Cart',JSON.stringify([]));
                        alert(data.message)
                        location.replace('/')
                    })
            }
        })
    })




