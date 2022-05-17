import Api from "./Api.js";
import productsHomePage from "./dashboardScript.js"

function verifyUserLogged() {
    if(localStorage.getItem("token") === ""){
        localStorage.setItem("userIsLogged", false)
    }
    else{
        localStorage.setItem("userIsLogged", true)
    }
}

verifyUserLogged()

//localStorage.clear()

const cartHeadder = document.getElementById('cart-header');
const modalCart = document.getElementById('modal-cart');
const modalLogin = document.getElementById('login')
const modalRegister = document.getElementById('register')
const btnRegisterForm = document.getElementById('register-button')
const btnLoginForm = document.getElementById('login-button')
const closeModal = document.getElementsByClassName('close-modal');
const profileImg = document.getElementById("profile-image")
const redirectRegister = document.getElementById('redirect-register')
const redirectLogin = document.getElementById('redirect-login')


function redirectToRegister() {
    redirectRegister.addEventListener('click', () => {
        modalLogin.style.display = 'none'
        modalRegister.style.display = 'flex'
    })
}
redirectToRegister()

function redirectToLogin() {
    redirectLogin.addEventListener('click', () => {
        modalRegister.style.display = 'none'
        modalLogin.style.display = 'flex'
    })
}
redirectToLogin()

cartHeadder.addEventListener('click', displayModal)
btnRegisterForm.addEventListener("click", registerNewUser)
btnLoginForm.addEventListener("click", logUser)
profileImg.addEventListener("click", (event)=>{
    if(localStorage.getItem("userIsLogged")){
    }
    else{
        modalRegister.style.display = "flex";
        modalLogin.style.display = "flex";
    }
})

function displayModal() {
    modalCart.style.display = 'flex';
}

function closeModalFunctionality() {
    for(let i = 0; i < closeModal.length; i++) {
        closeModal[i].addEventListener('click', (event) => {

            const modals = document.getElementsByClassName("modal")
            modals[i].style.display = "none"
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

    localStorage.setItem("userIsLogged", true)

    console.log(localStorage.getItem("userIsLogged"))
    console.log(localStorage.getItem("token"))
}

// const token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjEzZWViNTk3LTUzZGQtNDQ0MS04M2ZmLTkzMjIzYjFiY2Q5MyIsImlhdCI6MTY1Mjc5NTc3OCwiZXhwIjoxNjUzNjU5Nzc4LCJzdWIiOiJbb2JqZWN0IFVuZGVmaW5lZF0ifQ.8g38AzX3nY_zbsi_fCf9JCvakfxgcSUHsm5GrTSGNdM'
// const produtos = await Api.getPrivateProducts(token)

const productsPub = await Api.getPublicProducts()

productsHomePage(productsPub)
