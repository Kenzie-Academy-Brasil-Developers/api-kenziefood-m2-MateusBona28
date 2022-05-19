import Api from "./Api.js";

const api_products = await Api.getPublicProducts()
const cart_items_list     = document.querySelector("#cart-list")
const cart_items_quantity = document.querySelector("#cart-footer-total-amount > span")
const cart_items_price    = document.querySelector("#cart-footer-total-price > span")


let globalFinalPrice = 0
let globalQuantity = 0


localStorage.setItem("productsInStorage", "")

verifyCart()


async function actualizeCart() {

    const newCartProductsArray = await Api.getCartProducts()
    const ulCartItems = document.getElementById("cart-list")

    const footerFinalPrice = document.querySelector("#cart-footer-total-price > span")
    const footerProductsQuantity = document.querySelector("#cart-footer-total-amount > span")
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

        verifyCart()
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

async function deleteCartProductOff(event) {


    if(event.target.id === "testeId"){
        const newProductsInLocalStorage = localStorage.getItem("productsInStorage").split(",")
        const footerFinalPrice = document.querySelector("#cart-footer-total-price > span")
        const footerProductsQuantity = document.querySelector("#cart-footer-total-amount > span")
        const footerFinalPriceModal = document.querySelector("#modal-cart-footer-total-amount > span")
        const footerProductsQuantityModal = document.querySelector("#modal-cart-footer-total-price > span")
        const productPrice = document.getElementsByClassName("preco-produtos")

        const ulCartItems = document.getElementById("cart-list")
        const ulModalCartItems = document.getElementById("cart-list-modal")

        const newProducts = await Api.getPublicProducts()
        ulCartItems.innerHTML = ""
        ulModalCartItems.innerHTML = ""
        globalFinalPrice = 0
        globalQuantity = 0

        const productId = event.target.dataset.id
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

        let priceCounter = 1

        for(let i = 0; i< productPrice.length; i++){
            const item = productPrice[i]

            if(item.id === event.target.title && priceCounter === 1){
                priceCounter -= 1
                globalQuantity -= 1
            }
        }

        newProducts.forEach(product =>{
            
            for(let i = 0; i < attProducts.length; i++){

                const id = attProducts[i]

                if(id === product.id && id !== ""){

                    globalFinalPrice += product.preco

                    globalQuantity += 1

                    const newProduct = renderizeCartProductOff(product)
                    ulCartItems.appendChild(newProduct)
                    const newProductModal = renderizeCartProductOff(product)
                    ulModalCartItems.appendChild(newProductModal)
                }
            }
        })

        footerFinalPrice.innerText = `R$: ${globalFinalPrice.toFixed(2).split('.').join(',')}`
        footerProductsQuantity.innerText = `${globalQuantity}`

        footerFinalPriceModal.innerText = `R$: ${globalFinalPrice.toFixed(2).split('.').join(',')}`
        footerProductsQuantityModal.innerText = `${globalQuantity}`

        localStorage.setItem("productsInStorage", attProducts)

        verifyCart()
    }
}

async function actualizeModalCart() {

    const newCartProductsArray = await Api.getCartProducts()

    const ulModalCartItems = document.getElementById("cart-list-modal")

    const modalFinalPrice = document.querySelector("#modal-cart-footer-total-price > span")
    const modalProductsAmount = document.querySelector("#modal-cart-footer-total-amount > span")
    

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

        modalFinalPrice.innerText = `R$ ${finalPrice.toFixed(2).split('.').join(',')}`
        modalProductsAmount.innerText = `${quantity}`
    }
}

async function addProductToCart(event) {

    const idProduct = event.target.id
    if(localStorage.getItem("token") === null){

        const divNoProducts = document.getElementById("cart-body")
        divNoProducts.style.display = "none"

        const newProductsInLocalStorage = [localStorage.getItem("productsInStorage")]
        const ulCartItems = document.getElementById("cart-list")
        const ulModalCartItems = document.getElementById("cart-list-modal")
        ulCartItems.style.display = "block"

        const footerFinalPrice = document.querySelector("#cart-footer-total-price > span")
        const footerProductsQuantity = document.querySelector("#cart-footer-total-amount > span")
        const footerFinalPriceModal = document.querySelector("#modal-cart-footer-total-amount > span")
        const footerProductsQuantityModal = document.querySelector("#modal-cart-footer-total-price > span")

        newProductsInLocalStorage.push(idProduct)

        const newProducts = await Api.getPublicProducts()

        newProductsInLocalStorage.forEach(id =>{
            
            for(let i = 0; i < newProducts.length; i++){

                const product = newProducts[i]

                if(id === product.id){

                    globalFinalPrice += product.preco

                    globalQuantity += 1

                    const newProduct = renderizeCartProductOff(product)
                    ulCartItems.appendChild(newProduct)
                    const newProductModal = renderizeCartProductOff(product)
                    ulModalCartItems.appendChild(newProductModal)
                }
            }
        })

        footerFinalPrice.innerText = `R$ ${globalFinalPrice.toFixed(2).split('.').join(',')}`
        footerProductsQuantity.innerText = `${globalQuantity}`

        footerFinalPriceModal.innerText = `R$: ${globalFinalPrice.toFixed(2).split('.').join(',')}`
        footerProductsQuantityModal.innerText = `${globalQuantity}`

        localStorage.setItem("productsInStorage", newProductsInLocalStorage)

        verifyCart()

    }
    else{
        await Api.postCartProduct(idProduct)

        const divNoProducts = document.getElementById("cart-body")
        divNoProducts.style.display = "none"
        const modalDivNoProducts = document.getElementById("modal-cart-body")
        //modalDivNoProducts.style.display = "none"

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
        const cardFooterAddCart = document.createElement('i')

        cardFooter.classList.add('card-footer-addcart')
        cardFooterPrice.innerText = 'R$' + (element.preco.toFixed(2)).split('.').join(',')
        cardFooterAddCart.classList.add('card-footer-addbtn', 'fa-solid', 'fa-cart-shopping')
        cardFooterAddCart.addEventListener('click', addProductToCart)

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
    cartProductCard.classList.add("cart-card")
    const productImg = document.createElement("img")
    productImg.classList.add("cart-img")

    const divProductInfo = document.createElement("div")
    divProductInfo.classList.add("div-product-info")
    const productName = document.createElement("h3")
    productName.classList.add("product-cart-title")

    const productPrice = document.createElement("span")
    productPrice.classList.add("product-cart-price")

    const productQuantity = document.createElement("span")
    productQuantity.classList.add("cart-product-category")
    
    const btnRemoveProduct = document.createElement("i")

    const productCategory = document.createElement("span")
    productCategory.classList.add("cart-product-category")


    productImg.setAttribute("src", `${product.products.imagem}`)
    productName.innerText = `${product.products.nome}`
    productPrice.innerText = `R$: ${product.products.preco.toFixed(2).split(".").join(",")}`
    productQuantity.innerText = `Quantidade: ${product.quantity}`
    productCategory.innerText = product.products.categoria

    btnRemoveProduct.title = "delete-cart-item"
    btnRemoveProduct.id = `${product.products.id}`
    btnRemoveProduct.classList.add("fa-solid", "fa-trash", "delete-cart-product")

    divProductInfo.appendChild(productName)
    divProductInfo.appendChild(productCategory)
    divProductInfo.appendChild(productQuantity)
    divProductInfo.appendChild(productPrice)


    cartProductCard.appendChild(productImg)
    cartProductCard.appendChild(divProductInfo)
    cartProductCard.appendChild(btnRemoveProduct)

    return cartProductCard
}

function renderizeCartProductOff(product) {

    const ulCartItems = document.getElementById("cart-list")
    const ulModalCartItems = document.getElementById("cart-list-modal")

    ulCartItems.addEventListener("click", deleteCartProductOff)
    ulModalCartItems.addEventListener("click", deleteCartProductOff)

    const cartProductCard = document.createElement("li")
    cartProductCard.classList.add("cart-card")
    cartProductCard.classList.add("cart-card")

    const productImg = document.createElement("img")
    productImg.classList.add("cart-img")

    const divProductInfo = document.createElement("div")
    divProductInfo.classList.add("div-product-info")

    const productName = document.createElement("h3")
    const productPrice = document.createElement("span")
    const btnRemoveProduct = document.createElement("i")
  

    productImg.setAttribute("src", `${product.imagem}`)
    productName.innerText = `${product.nome}`
    productPrice.innerText = `Preço: ${product.preco}`
    productPrice.id = product.preco
    productPrice.classList.add("preco-produtos")

    productName.classList.add("product-cart-title")
    productPrice.classList.add("product-cart-price")
    const productCategory = document.createElement("span")
    productCategory.classList.add("cart-product-category")

    btnRemoveProduct.title = product.preco
    btnRemoveProduct.id = `testeId`
    btnRemoveProduct.dataset.id = product.id
    btnRemoveProduct.classList.add("fa-solid", "fa-trash", "delete-cart-product")
    productCategory.innerText = product.categoria

    divProductInfo.appendChild(productName)
    divProductInfo.appendChild(productCategory)
    divProductInfo.appendChild(productPrice)

    cartProductCard.appendChild(productImg)
    cartProductCard.appendChild(divProductInfo)
    cartProductCard.appendChild(btnRemoveProduct)

    return cartProductCard
}

async function verifyCart() {

    if(localStorage.getItem("token") === null){

        const arrProducts = localStorage.getItem("productsInStorage")
        const divNoProducts = document.getElementById("cart-body")
        const divNoProductsModal = document.getElementById("empty-modal-cart-message")
        const divUlProducts = document.getElementById("cart-list")
        divUlProducts.style.display = "block"

        if(arrProducts.length > 1){
            divNoProducts.style.display = "none"
            divNoProductsModal.style.display = "none"
            divUlProducts.style.display = "block"
        }
        else{
            divNoProducts.style.display = "flex"
            divNoProductsModal.style.display = "flex"
            divUlProducts.style.display = "none"
        }
    }
    else{

        const newCartProductsArray = await Api.getCartProducts()
        const divNoProducts = document.getElementById("cart-body")
        const divNoProductsModal = document.getElementById("empty-modal-cart-message")
        const divUlProducts = document.getElementById("cart-list")
        const divUlProductsModal = document.getElementById("cart-list-modal")

        if(newCartProductsArray.length > 0){
            divNoProducts.style.display = "none"
            divNoProductsModal.style.display = "none"
            divUlProducts.style.display = "block"
            divUlProductsModal.style.display = "flex"
        }
        else{
            divNoProducts.style.display = "flex"
            divNoProductsModal.style.display = "flex"
            divUlProducts.style.display = "none"
            divUlProductsModal.style.display = "none"
        }
    }
}



async function verifyUserLogged() {
    if(localStorage.getItem("token") === null){
        localStorage.setItem("userIsLogged", false)
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
const btnFinalizePurchase = document.getElementById("finalize-purchase")

btnFinalizePurchase.addEventListener("click", displayModal)

function redirectToRegister() {
    redirectRegister.addEventListener('click', () => {
        modalLogin.style.display = 'none'
        modalRegister.style.display = 'flex'
    })

    const modalLoginRegister = document.getElementById("login-register")
    const modalGoRegister = document.getElementById("goTo-register")

    modalGoRegister.addEventListener("click", () => {
        modalLoginRegister.style.display = "none"
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

    const modalLoginRegister = document.getElementById("login-register")
    const modalGoLogin = document.getElementById("goTo-login")
    const modalSignIn = document.getElementById("login-register")

    modalGoLogin.addEventListener("click", () => {
        modalLoginRegister.style.display = "none"
        modalRegister.style.display = 'none'
        modalLogin.style.display = 'flex'
    })
}
redirectToLogin()

cartHeadder.addEventListener('click', displayModal)
btnRegisterForm.addEventListener("click", registerNewUser)
btnLoginForm.addEventListener("click", logUser)
profileImg.addEventListener("click", (event)=>{
    if(localStorage.getItem("token") !== null){
        
        
        const modalLogout = document.getElementById("modal-logout")
        modalLogout.style.display = "flex"
    }
    else{
        
        const modalLoginRegister = document.getElementById("login-register")
        modalLoginRegister.style.display = "flex"
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

const productsPub = await Api.getPublicProducts()

productsHomePage(productsPub)

function filterPerCategory() {
    const list = document.getElementsByClassName('category-button')
    for (let i = 0; i < list.length; i++) {
        list[i].addEventListener('click', (event) => {
            for (let i = 0; i < list.length; i++) {
                list[i].classList.remove("active")
            }
            const e = event.target
            e.classList.add("active")

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
}

logoutBtn.addEventListener("click", () => {
    localStorage.clear()
    window.location.href = "/index.html"
})

const searchInput = document.getElementById('search-product-input')
searchInput.addEventListener('keyup', (e) => {
    const searchProducts = productsPub.filter(product => product.nome.toLowerCase().includes(e.currentTarget.value.toLowerCase()))
    console.log(searchProducts)
    console.log(e.currentTarget.value)
    productsHomePage(searchProducts)
})