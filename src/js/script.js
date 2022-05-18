import Api from "./Api.js";

const api_products = await Api.getPublicProducts()
const cart_items_list     = document.querySelector("#cart-list")
const cart_items_quantity = document.querySelector("#cart-footer-total-amount > p")
const cart_items_price    = document.querySelector("#cart-footer-total-price > p")

if(localStorage.getItem('productsInCart') != undefined){
    let ids_from_localStorage = localStorage.getItem('productsInCart')
    let products_from_localStorage = find_on_API_by_ID(ids_from_localStorage.split(','))
    cart_products(products_from_localStorage)
}


function productsHomePage(products) {
    const containerCards = document.querySelector('.container-cards')
    
    containerCards.innerHTML = ''

    products.forEach(element => {
        const card = document.createElement('article')
        card.classList.add('card')
        card.dataset.id = element.id

        const figure = document.createElement('figure')
        const img = document.createElement('img')
        img.src = element.imagem
        img.alt = element.nome

        figure.appendChild(img)

        const cardBody = document.createElement('div')
        cardBody.classList.add('card-body')

        const cardBodyTitle = document.createElement('h2')
        cardBodyTitle.innerText = element.nome
        const CardBodyDesc = document.createElement('p')
        CardBodyDesc.classList.add('card-desc')
        CardBodyDesc.innerText = element.descricao

        cardBody.append(cardBodyTitle, CardBodyDesc)

        const cardCategory = document.createElement('div')
        cardCategory.classList.add('card-category')
        cardCategory.innerText = element.categoria

        const cardFooter = document.createElement('div')
        const cardFooterPrice = document.createElement('p')
        const cardFooterAddCart = document.createElement('button')

        cardFooterPrice.innerText = element.preco
        cardFooterAddCart.innerText = 'Add'
        cardFooterAddCart.addEventListener('click', () => {

            if(localStorage.getItem('productsInCart') == undefined || localStorage.getItem('productsInCart') == ''){
                localStorage.setItem('productsInCart', element.id)
                cart_items_list.innerHTML = ''
                let ids_from_localStorage = localStorage.getItem('productsInCart')
                let products_from_localStorage = find_on_API_by_ID(ids_from_localStorage.split(','))
                cart_products(products_from_localStorage)
            } else {
                cart_items_list.innerHTML = ''
                localStorage.setItem('productsInCart', localStorage.getItem('productsInCart') + ',' + element.id)
                let ids_from_localStorage = localStorage.getItem('productsInCart')
                let products_from_localStorage = find_on_API_by_ID(ids_from_localStorage.split(','))
                cart_products(products_from_localStorage)
            }
        })
        //cardFooterAddCart.dataset.id = element.id
        cardFooter.append(cardFooterPrice, cardFooterAddCart)

        card.append(figure, cardBody, cardCategory, cardFooter)

        containerCards.append(card)
    })
}


function cart_item_template(image, name, description, price, id) {
    const cart_item = document.createElement("li")
    cart_item.id = id
    cart_item.innerHTML =  `<div class="cart-item-header">
                                <img src="${image}" alt="product" class="cart-item-image">

                                <div class="cart-item-info">
                                    <h4 class="cart-item-name">${name}</h4>
                                    <p class="cart-item-description">
                                        ${description}
                                    </p>
                                </div>

                                <button class="cart-remove-button">teste</button>
                            </div>

                            <div class="cart-item-footer">
                                <div class="cart-item-price">
                                    <p>
                                        R$${price}
                                    </p>
                                </div>

                                <div class="cart-item-quantity">
                                    <p>
                                        1
                                    </p>
                                </div>
                            </div>`

    cart_items_list.appendChild(cart_item)
    remove_buttons()
    quantity_update(cart_items_list.children)
    price_update()
}

function cart_products(array) {
    array.forEach(element => {
        cart_item_template(element.imagem,
                           element.nome,
                           element.descricao,
                           element.preco,
                           element.id)
    });
}

function find_on_API_by_ID(productsIds) {
    let products = []
    productsIds.forEach(ids => {
        api_products.find(element => {
            if (element.id === ids) {
                products.push(element)
            }
        })
    })
    return products
}

function remove_buttons() {
    const get_remove_buttons = document.getElementsByClassName("cart-remove-button")
    for (let i = 0; i < get_remove_buttons.length; i++) {
        get_remove_buttons[i].addEventListener("click", target => {

            const product_ID = target.path[2].id
            target.path[2].remove()

            const arr_ids_from_localStorage = localStorage.getItem('productsInCart').split(',')
            const remove_product_ID = arr_ids_from_localStorage.filter(id => id != product_ID).join(',')
            
            localStorage.setItem('productsInCart', remove_product_ID)
            
            
            const products_from_localStorage = find_on_API_by_ID(arr_ids_from_localStorage)

            quantity_update(cart_items_list.children)
            price_update()
        })
    }
}



function quantity_update(array) {
    cart_items_quantity.innerText = 'Quantidade:' + array.length
}

function price_update() {
    const precos = document.querySelectorAll('.cart-item-price > p')
    let final_price = 0
    
    for(let i = 0; i < precos.length; i++){
        const priceNumber = +precos[i].innerText.split('R$')[1]
        final_price += priceNumber
    }
    

    cart_items_price.innerText = 'Total: R$' + final_price
}

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
const logoutBtn = document.getElementById('index-logout-button')

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


/* essa func ta criando os filtros via dom mas os filtros já estão criados
    direto no HTML, verificar o qual dos 2 vai ser utilizado 
function createFilterElements() {
    const categoryList = document.getElementById('category-list')

    const liTodos = document.createElement('li')
    const liPanificadora = document.createElement('li')
    const liFrutas = document.createElement('li')
    const liBebidas = document.createElement('li')

    liTodos.classList.add('category-button')
    liPanificadora.classList.add('category-button')
    liFrutas.classList.add('category-button')
    liBebidas.classList.add('category-button')

    liTodos.innerText = 'Todos'
    liPanificadora.innerText = 'Panificadora'
    liFrutas.innerText = 'Frutas'
    liBebidas.innerText = 'Bebidas'

    categoryList.append(liTodos, liPanificadora, liFrutas, liBebidas)

    
}

createFilterElements()*/

function filterPerCategory() {
    const list = document.getElementById('category-list')
    list.addEventListener('click', (event) => {
        const e = event.target
        const target = e.innerText
        const filter = productsPub.filter(element => {
            return element.categoria === target
        })
        
        if(target !== 'Todos') {
            productsHomePage(filter)
        } else {
            productsHomePage(productsPub)
        }
    })
}

const productsPub = await Api.getPublicProducts()

productsHomePage(productsPub)

filterPerCategory()

logoutBtn.addEventListener("click", () => {
    localStorage.clear()
    window.location.href = "/index.html"
})
