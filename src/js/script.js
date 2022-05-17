import Api from "./Api.js";

const cartHeadder = document.getElementById('cart-header');
const modalCart = document.getElementById('modal-cart');
const btnRegisterForm = document.getElementById("register-button")
const btnLoginForm = document.getElementById("login-button")
const closeModal = document.getElementsByClassName('close-modal');

cartHeadder.addEventListener('click', displayModal)
btnRegisterForm.addEventListener("click", registerNewUser)
btnLoginForm.addEventListener("click", logUser)

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

async function registerNewUser(event) {
    
    event.preventDefault()

    const registerForm = document.getElementById("form-register")

    const userInfo = registerForm.elements

    const newUser = {}

    for(let i = 0; i < userInfo.length; i++){

        const info = userInfo[i]

        if(userInfo[i].value !== ""){
            newUser[info.name] = info.value
        }
    }

    await Api.getUserRegister(newUser)
}

async function logUser(event) {

    event.preventDefault()

    const formLogin = document.getElementById("form-login")

    const loginInfo = formLogin.elements

    const user = {}

    for(let i = 0; i < loginInfo.length; i++){

        const info = loginInfo[i]

        if(info.value !== ""){
            user[info.name] = info.value
        }
    }

    await Api.getUserLogin(user)
}