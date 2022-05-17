import Api from "./Api.js";

const cartHeadder = document.getElementById('cart-header');
const modalCart = document.getElementById('modal-cart');
const closeModal = document.getElementsByClassName('close-modal');

cartHeadder.addEventListener('click', displayModal)

function displayModal() {
    modalCart.style.display = 'flex';
}

function closeModalFunctionality() {
    for(let i = 0; i < closeModal.length; i++) {
        closeModal[i].addEventListener('click', (event) => {
            modalCart.style.display = 'none'
        })
    }
}
closeModalFunctionality()
