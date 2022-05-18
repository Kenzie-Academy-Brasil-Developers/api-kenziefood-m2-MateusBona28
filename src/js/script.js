import Api from "./Api.js";

const api_products = await Api.getPublicProducts()
const cart_items_list     = document.querySelector("#cart-list")
const cart_items_quantity = document.querySelector("#cart-footer-total-amount > span")
const cart_items_price    = document.querySelector("#cart-footer-total-price > span")


let globalFinalPrice = 0
let globalQuantity = 0


localStorage.setItem("productsInStorage", [])


async function actualizeCart() {

    const newCartProductsArray = await Api.getCartProducts()
    const ulCartItems = document.getElementById("cart-list")

    const footerFinalPrice = document.querySelector("#cart-footer-total-price>span")
    const footerProductsQuantity = document.querySelector("#cart-footer-total-amount>span")
    let finalPrice = 0
    let quantity = 0

    ulCartItems.innerHTML = ""

    if(localStorage.getItem("token") === null){
    }
    else{
        newCartProductsArray.forEach(product =>{

            quantity += product.quantity

            finalPrice += product.quantity * product.products.preco

            const liProduct = renderizeCartProduct(product)

            ulCartItems.appendChild(liProduct)

        })
            
        footerFinalPrice.innerText = `${finalPrice.toFixed(2).split(".").join(",")}`
        footerProductsQuantity.innerText = `${quantity}`
    }
    
}

async function deleteCartProduct(event) {

    const target = event.target.title

    const newCartProductsArray = await Api.getCartProducts()

    if(target === "delete-cart-item"){
        await Api.deleteCartProduct(event.target.id)

        newCartProductsArray.forEach(product =>{
    
            renderizeCartProduct(product)
    
        })
    }

    actualizeCart()
    actualizeModalCart()

}

function deleteCartProductOff(event) {


    const newProductsInLocalStorage = localStorage.getItem("productsInStorage").split(",")
    const footerFinalPrice = document.getElementById("cart-footer-total-price")
    const footerProductsQuantity = document.getElementById("cart-footer-total-amount")
    const productPrice = document.getElementsByClassName("preco-produtos")

    const productId = event.target.id
    let removeCounter = 1

    const attProducts = []

    newProductsInLocalStorage.forEach(id =>{

        if(id === productId && removeCounter === 1){
            removeCounter -= 1
        }
        else{
            attProducts.push(id)
        }
    })

    localStorage.setItem("productsInStorage", attProducts)

    const closeLi = event.target.closest("li")

    let priceCounter = 1

    for(let i = 0; i< productPrice.length; i++){
        const item = productPrice[i]

        if(item.id === event.target.title && priceCounter === 1){
            priceCounter -= 1
            globalFinalPrice -= item.id
            globalQuantity -= 1
        }
    }

    footerFinalPrice.innerText = `Total: R$${globalFinalPrice}`
    footerProductsQuantity.innerText = `Total de produtos no carrinho : ${globalQuantity}`

    closeLi.style.display = "none"
}

async function actualizeModalCart() {

    const newCartProductsArray = await Api.getCartProducts()

    const ulModalCartItems = document.getElementById("cart-list-modal")

    const modalFinalPrice = document.getElementById("modal-cart-footer-total-price")
    const modalProductsAmount = document.getElementById("modal-cart-footer-total-amount")

    let finalPrice = 0
    let quantity = 0

    ulModalCartItems.innerHTML = ""

    if(localStorage.getItem("token") === null){
    }
    else{
        newCartProductsArray.forEach(product =>{

            quantity += product.quantity

            finalPrice += product.quantity * product.products.preco

            const liProduct = renderizeCartProduct(product)

            ulModalCartItems.appendChild(liProduct)

        })

        modalFinalPrice.innerText = `Total: R$${finalPrice}`
        modalProductsAmount.innerText = `Total de produtos no carrinho : ${quantity}`
    }
}

async function addProductToCart(event) {

    const idProduct = event.target.id
    if(localStorage.getItem("token") === null){

        const newProductsInLocalStorage = [localStorage.getItem("productsInStorage")]
        const ulCartItems = document.getElementById("cart-list")

        const footerFinalPrice = document.getElementById("cart-footer-total-price")
        const footerProductsQuantity = document.getElementById("cart-footer-total-amount")

        const product = api_products.filter((product)=>{
            if(product.id === idProduct){

                globalFinalPrice += product.preco

                globalQuantity += 1
                
                const newProduct = renderizeCartProductOff(product)

                ulCartItems.appendChild(newProduct)
            }
        })

        footerFinalPrice.innerText = `Total: R$${globalFinalPrice}`
        footerProductsQuantity.innerText = `Total de produtos no carrinho : ${globalQuantity}`

        newProductsInLocalStorage.push(idProduct)

        localStorage.setItem("productsInStorage", newProductsInLocalStorage)

    }
    else{
        await Api.postCartProduct(idProduct)
        const newCartProductsArray = await Api.getCartProducts()

        newCartProductsArray.forEach(product =>{

            renderizeCartProduct(product)
            
        })

        actualizeCart()
        actualizeModalCart()
    }
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

        cardFooterPrice.innerText = 'R$' + (element.preco.toFixed(2) + ' ').split('.').join(',')
        cardFooterAddCart.innerText = 'Add'
        cardFooterAddCart.addEventListener('click', addProductToCart)

            

            /*if(localStorage.getItem('productsInCart') == undefined || localStorage.getItem('productsInCart') == ''){
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
        })*/
        cardFooterAddCart.id = element.id
        cardFooter.append(cardFooterPrice, cardFooterAddCart)

        card.append(figure, cardBody, cardCategory, cardFooter)

        containerCards.append(card)
    })
}


function renderizeCartProduct(product) {
    
    const ulCartItems = document.getElementById("cart-list")
    const ulModalCartItems = document.getElementById("cart-list-modal")

    ulCartItems.addEventListener("click", deleteCartProduct)
    ulModalCartItems.addEventListener("click", deleteCartProduct)

    const cartProductCard = document.createElement("li")
    const productImg = document.createElement("img")
    const productName = document.createElement("h3")
    const productPrice = document.createElement("span")
    const productQuantity = document.createElement("span")
    const btnRemoveProduct = document.createElement("button")
  

    productImg.setAttribute("src", `${product.products.imagem}`)
    productName.innerText = `${product.products.nome}`
    productPrice.innerText = `Preço: ${product.products.preco}`
    productQuantity.innerText = `Quantidade: ${product.quantity}`

    btnRemoveProduct.innerText = "Remover"
    btnRemoveProduct.title = "delete-cart-item"
    btnRemoveProduct.id = `${product.products.id}`

    cartProductCard.appendChild(productImg)
    cartProductCard.appendChild(productName)
    cartProductCard.appendChild(productPrice)
    cartProductCard.appendChild(productQuantity)
    cartProductCard.appendChild(btnRemoveProduct)

    //ulCartItems.appendChild(cartProductCard)

    return cartProductCard
}

function renderizeCartProductOff(product) {

    const ulCartItems = document.getElementById("cart-list")
    const ulModalCartItems = document.getElementById("cart-list-modal")

    ulCartItems.addEventListener("click", deleteCartProductOff)
    ulModalCartItems.addEventListener("click", deleteCartProductOff)

    const cartProductCard = document.createElement("li")
    const productImg = document.createElement("img")
    const productName = document.createElement("h3")
    const productPrice = document.createElement("span")
    const btnRemoveProduct = document.createElement("button")
  

    productImg.setAttribute("src", `${product.imagem}`)
    productName.innerText = `${product.nome}`
    productPrice.innerText = `Preço: ${product.preco}`
    productPrice.id = product.preco
    productPrice.classList.add("preco-produtos")

    btnRemoveProduct.innerText = "Remover"
    btnRemoveProduct.title = product.preco
    btnRemoveProduct.id = `testeId`

    cartProductCard.appendChild(productImg)
    cartProductCard.appendChild(productName)
    cartProductCard.appendChild(productPrice)
    cartProductCard.appendChild(btnRemoveProduct)

    return cartProductCard
}



async function verifyUserLogged() {
    if(localStorage.getItem("token") === null){
        localStorage.setItem("userIsLogged", false)
        modalLogin.style.display = "flex"
    }
    else{
        localStorage.setItem("userIsLogged", true)
        const newCartProductsArray = await Api.getCartProducts()

        newCartProductsArray.forEach(product =>{

            renderizeCartProduct(product)

        })

        actualizeCart()
        actualizeModalCart()
    }
}


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
verifyUserLogged()
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

    const arrProductsInCart = localStorage.getItem("productsInStorage").split(",")

    arrProductsInCart.forEach(async (productId) =>{
        if(productId !== ""){
            await Api.postCartProduct(productId)
        }
    })

    actualizeCart()
    actualizeModalCart()

    console.log(localStorage.getItem("userIsLogged"))
    console.log(localStorage.getItem("token"))
}

function createFilterElements() {
    const categoryList = document.getElementById('category-list')

    const liTodos = document.createElement('li')
    const liPanificadora = document.createElement('li')
    const liFrutas = document.createElement('li')
    const liBebidas = document.createElement('li')

    liTodos.classList.add('category-button')
    liTodos.classList.add('active')
    liPanificadora.classList.add('category-button')
    liFrutas.classList.add('category-button')
    liBebidas.classList.add('category-button')

    liTodos.innerText = 'Todos'
    liPanificadora.innerText = 'Panificadora'
    liFrutas.innerText = 'Frutas'
    liBebidas.innerText = 'Bebidas'

    categoryList.append(liTodos, liPanificadora, liFrutas, liBebidas)

    filterPerCategory()
}

createFilterElements()

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


logoutBtn.addEventListener("click", () => {
    localStorage.clear()
    window.location.href = "/index.html"
})