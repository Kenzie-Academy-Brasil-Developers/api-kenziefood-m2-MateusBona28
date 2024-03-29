import Api from "./Api.js";

const logoutBtn = document.getElementById('index-logout-button')
const ulProducts = document.getElementById("owner-product-list")
const btnAddProduct = document.getElementById("new-product-button")
const allModals = document.getElementsByClassName("modal")
const btnPostProduct = document.getElementById("add-product")
const deleteProduct = document.getElementsByClassName("delete-product")
const profileImg = document.getElementById("profile-image")
const redirectRegister = document.getElementById('redirect-register')
const redirectLogin = document.getElementById('redirect-login')
const modalLogin = document.getElementById('login')
const modalRegister = document.getElementById('register')
const btnRegisterForm = document.getElementById('register-button')
const btnLoginForm = document.getElementById('login-button')
const closeModal = document.getElementsByClassName('close-modal');

btnLoginForm.addEventListener("click", logUser)
btnRegisterForm.addEventListener("click", registerNewUser)

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


redirectToRegister()

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


btnAddProduct.addEventListener("click", displayNewProductModal)

let productsArray = await Api.getUserProducts()

renderizeUserProducts(productsArray)


for(let i = 0; i < deleteProduct.length; i++){
    let productsArray = await Api.getUserProducts()
    deleteProduct[i].addEventListener("click", displayConfirmDelete)
}

btnPostProduct.addEventListener("click", postNewProduct)

function renderizeUserProducts(productsArray) {

    ulProducts.innerHTML = ''
    if(productsArray.length > 0){
        productsArray.forEach(product => {
            
            const productCardLi = document.createElement("li")
            const cardProdutoName = document.createElement("div")
            const cardImgArea = document.createElement("figure")
            const cardImg = document.createElement("img")
            const cardProductName = document.createElement("h3")
            const cardCategoriesArea = document.createElement('div')
            const cardCategories = document.createElement("span")
            const cardDescriptionArea = document.createElement('div')
            const cardDescription = document.createElement("span")
            const cardOptions = document.createElement("div")
            const cardEditProduct = document.createElement("i")
            const cardDeleteProduct = document.createElement("i")

            cardProdutoName.classList.add('card-area', 'card-name-area')
            cardCategoriesArea.classList.add('card-area')
            cardDescriptionArea.classList.add('card-area')
            cardOptions.classList.add('card-area', 'card-buttons')

            productCardLi.classList.add("product-card")
            productCardLi.id = product.id

            cardImg.setAttribute("src", `${product.imagem}`)

            cardProductName.innerText = product.nome
            
            cardCategories.innerText = product.categoria
            cardCategories.classList.add('card-category-dashboard')

            cardDescription.innerText = product.descricao
            cardDescription.classList.add('card-description-dashboard')

            cardEditProduct.classList.add('edit-product')

            cardEditProduct.id = product.id
            cardEditProduct.classList.add('fas', 'fa-edit', "card-option-button")
            cardEditProduct.addEventListener('click', editProduct)
            
            cardDeleteProduct.classList.add("delete-product", "fa-solid", "fa-trash", "card-option-button")
            
            cardDeleteProduct.id = product.id
            cardDeleteProduct.addEventListener('click', displayConfirmDelete)

            cardImgArea.append(cardImg)
            cardProdutoName.append(cardImgArea, cardProductName)
            cardCategoriesArea.append(cardCategories)
            cardDescriptionArea.append(cardDescription)
            cardOptions.append(cardEditProduct, cardDeleteProduct)  
            productCardLi.append(cardProdutoName, cardCategoriesArea, cardDescriptionArea, cardOptions)

            ulProducts.append(productCardLi)
        });
    }
    else{
        ulProducts.innerText = "Você ainda não cadastrou nenhum produto!"
    }
    
}

function editProduct(event) {
    const token = localStorage.getItem("token")
    
    const modalContainer = document.querySelector('.modal-edit-container')
    const formEdit = document.getElementById('form-edit-product')
    const sendBtn = document.querySelector('.modal-edit-btn')
    const cancelBtn = document.querySelector('.modal-cancel-btn')
    const closeModal = document.querySelector('.close-modal')
    const e = event.target
    const id = e.id
    const product = productsArray.filter(element => {
        return element.id === id
    })
    formEdit[0].value = product[0].nome
    formEdit[1].value = product[0].descricao
    formEdit[2].value = product[0].categoria
    formEdit[3].value = product[0].preco
    formEdit[4].value = product[0].imagem
    
    modalContainer.style.display = 'flex'
    sendBtn.addEventListener('click', async () => {
        const data = {
            nome: formEdit[0].value,
            preco: formEdit[3].value,
            categoria: formEdit[2].value,
            imagem: formEdit[4].value,
            descricao: formEdit[1].value
        }
        const respostaApi = await Api.editPost(id, token, data)
        modalContainer.style.display = 'none'
        
        let productsArray = await Api.getUserProducts()
        renderizeUserProducts(productsArray)

        if(respostaApi) {
            editSuccessModalDisplay()
        } else {
            editErrorModalDisplay()
        }
        setTimeout(() => {
            const bodyModal = document.getElementById('edit-success-product-status-modal')
            bodyModal.style.display = 'none';
            const bodyModalError = document.getElementById('error-product-status-modal')
            bodyModalError.style.display = 'none';
            
        }, 3000)
    })
    cancelBtn.addEventListener('click', () => {
        modalContainer.style.display = 'none'
    })
    
}

renderizeUserProducts(productsArray)



function displayNewProductModal(event) {

    const modalProduct = document.getElementById("add-product-modal")

    modalProduct.style.display = "flex"

    event.preventDefault()
}

async function postNewProduct(event) {

    event.preventDefault()

    const formNewProduct = document.getElementById("form-add-product")
    const newProductInfo = formNewProduct.elements
    const newProduct = {}

    for(let i = 0; i < newProductInfo.length; i++){
        const info = newProductInfo[i]
        if(info.value !== ""){
            newProduct[info.name] = info.value
        }
    }

    const requestStatus = await Api.postNewProduct(newProduct)
    
    if (requestStatus === false) {
        errorModalDisplay()
    } else {
        successModalDisplay()
    }

    productsArray = await Api.getUserProducts()
    renderizeUserProducts(productsArray)

    const modalProduct = document.getElementById("add-product-modal")

    modalProduct.style.display = "none"

    setTimeout(() => {
        const bodyModal = document.getElementById('success-product-status-modal')
        bodyModal.style.display = 'none';
        const bodyModalError = document.getElementById('error-product-status-modal')
        bodyModalError.style.display = 'none';
        
    }, 3000)
}

function displayConfirmDelete(event) {
    
    event.preventDefault()

    const productId = event.target.id

    const confirmDeleteModal = document.getElementById("confirm-delete")

    confirmDeleteModal.style.display = "flex"

    const btnCancel = document.getElementById("cancel-delete")
    const btnDelete = document.getElementById("delete-product")

    btnCancel.addEventListener("click", (event)=>{

        event.preventDefault()

        confirmDeleteModal.style.display = "none"
    })

    btnDelete.addEventListener("click", async (event)=>{

        event.preventDefault()

        const respostaApi = await Api.deletePost(productId)
        const comfirmDelete = document.getElementById("confirm-delete")
        comfirmDelete.style.display = 'none'

        let productsArray = await Api.getUserProducts()
        renderizeUserProducts(productsArray)

        if(respostaApi) {
            deleteSuccessModalDisplay()
        } else {
            deleteErrorModalDisplay()
        }
        setTimeout(() => {
            const bodyModal = document.getElementById('delete-success-product-status-modal')
            bodyModal.style.display = 'none';
            const bodyModalError = document.getElementById('delete-error-product-status-modal')
            bodyModalError.style.display = 'none';
            
        }, 3000)

    })
}

logoutBtn.addEventListener("click", () => {
    localStorage.clear()
    window.location.href = window.location.href
})

function closeModalFunctionality() {
    for(let i = 0; i < closeModal.length; i++) {
        closeModal[i].addEventListener('click', (event) => {
            const modals = document.getElementsByClassName("modal")
            for(let j = 0; j < modals.length; j++) {
                modals[j].style.display = 'none'
            }
        })
    }
}

function filterPerCategoryDashboard() {
    const list = document.getElementById('category-list')
    list.addEventListener('click', (event) => {
        const e = event.target
        const target = e.innerHTML
        const filter = productsArray.filter(element => {
            return element.categoria === target
        })

        if(target !== 'Todos') {
            renderizeUserProducts(filter)
        } else {
            renderizeUserProducts(productsArray)
        }
    })
}

const searchInput = document.getElementById('search-product-input')
searchInput.addEventListener('keyup', (e) => {
    const searchProducts = productsArray.filter(product => product.nome.toLowerCase().includes(e.currentTarget.value.toLowerCase()))
    renderizeUserProducts(searchProducts)
})

filterPerCategoryDashboard()
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
        
            const filter = userProducts.filter(element => {
                return element.categoria === target
            })
            
            if(target !== 'Todos') {
                renderizeUserProducts(filter)
            } else {
                renderizeUserProducts(userProducts)
            }
        })
    }
}


const userProducts = await Api.getUserProducts()

renderizeUserProducts(userProducts)

closeModalFunctionality()

filterPerCategory()

function errorModalDisplay() {
    const modalBody    = document.getElementById("error-product-status-modal")
    const modalMessage = document.getElementById("error-status-message")
    const modalBtn     = document.getElementById("close-error-modal-status-btn")

    modalBody.style.display = "flex"
    modalBody.classList.add("dashboard-body-modal")
    modalMessage.classList.add("dashboard-modal-status-message")
    modalBtn.classList.add("close-dashboard-error-modal-status")
    modalBtn.classList.add("close-modal")
}

function successModalDisplay() {
    const modalBody    = document.getElementById("success-product-status-modal")
    const modalMessage = document.getElementById("success-status-message")
    const modalBtn     = document.getElementById("close-success-modal-status-btn")

    modalBody.style.display = "flex"
    modalBody.classList.add("dashboard-body-modal")
    modalMessage.classList.add("dashboard-modal-status-message")
    modalBtn.classList.add("close-dashboard-error-modal-status")
    modalBtn.classList.add("close-dashboard-error-modal-status", "close-modal")
}


function deleteErrorModalDisplay() {
    const modalBody    = document.getElementById("delete-error-product-status-modal")
    const modalMessage = document.getElementById("delete-error-status-message")
    const modalBtn     = document.getElementById("close-error-delete-modal-status-btn")

    modalBody.style.display = "flex"
    modalBody.classList.add("dashboard-body-modal")
    modalMessage.classList.add("dashboard-modal-status-message")
    modalBtn.classList.add("close-dashboard-error-modal-status")
    modalBtn.classList.add("close-dashboard-error-modal-status", "close-modal")
}

function deleteSuccessModalDisplay() {
    const modalBody    = document.getElementById("delete-success-product-status-modal")
    const modalMessage = document.getElementById("delete-success-status-message")
    const modalBtn     = document.getElementById("close-success-delete-modal-status-btn")

    modalBody.style.display = "flex"
    modalBody.classList.add("dashboard-body-modal")
    modalMessage.classList.add("dashboard-modal-status-message")
    modalBtn.classList.add("close-dashboard-error-modal-status")
    modalBtn.classList.add("close-dashboard-error-modal-status", "close-modal")
}

function editErrorModalDisplay() {
    const modalBody    = document.getElementById("edit-error-product-status-modal")
    const modalMessage = document.getElementById("edit-error-status-message")
    const modalBtn     = document.getElementById("close-error-edit-modal-status-btn")

    modalBody.style.display = "flex"
    modalBody.classList.add("dashboard-body-modal")
    modalMessage.classList.add("dashboard-modal-status-message")
    modalBtn.classList.add("close-dashboard-error-modal-status", "close-modal")
}

function editSuccessModalDisplay() {
    const modalBody    = document.getElementById("edit-success-product-status-modal")
    const modalMessage = document.getElementById("edit-success-status-message")
    const modalBtn     = document.getElementById("close-success-edit-modal-status-btn")

    modalBody.style.display = "flex"
    modalBody.classList.add("dashboard-body-modal")
    modalMessage.classList.add("dashboard-modal-status-message")
    modalBtn.classList.add("close-dashboard-error-modal-status")
    modalBtn.classList.add("close-dashboard-error-modal-status", "close-modal")
}