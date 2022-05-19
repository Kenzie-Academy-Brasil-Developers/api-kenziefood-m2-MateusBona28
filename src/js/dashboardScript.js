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
            //cardEditProduct.setAttribute("src", "#")
            //cardEditProduct.innerText = 'Editar'
            cardEditProduct.id = product.id
            cardEditProduct.classList.add('fas', 'fa-edit', "card-option-button")
            cardEditProduct.addEventListener('click', editProduct)
            
            cardDeleteProduct.classList.add("delete-product", "fa-solid", "fa-trash", "card-option-button")
            //cardDeleteProduct.setAttribute("src", "#")
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
    // const editBtn = document.querySelectorAll('.edit-product')
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
    sendBtn.addEventListener('click', () => {
        const data = {
            nome: formEdit[0].value,
            preco: formEdit[3].value,
            categoria: formEdit[2].value,
            imagem: formEdit[4].value,
            descricao: formEdit[1].value
        }
        Api.editPost(id, token, data)
        modalContainer.style.display = 'none'
        setTimeout(() => {
            document.location.reload(true)
        }, 1500)
    })
    cancelBtn.addEventListener('click', () => {
        modalContainer.style.display = 'none'
    })
    closeModal.addEventListener('click', () => {
        modalContainer.style.display = 'none'
    })
    // editBtn.forEach(element => {
    //     element.addEventListener('click', (event) => {
    //         const e = event.target
    //         const id = e.id
    //         const product = productsArray.filter(element => {
    //             return element.id === id
    //         })
    //         formEdit[0].value = product[0].nome
    //         formEdit[1].value = product[0].preco
    //         formEdit[2].value = product[0].categoria
    //         formEdit[3].value = product[0].imagem
    //         formEdit[4].value = product[0].descricao
    //         modalContainer.style.display = 'flex'
    //         sendBtn.addEventListener('click', () => {
    //             const data = {
    //                 nome: formEdit[0].value,
    //                 preco: formEdit[1].value,
    //                 categoria: formEdit[2].value,
    //                 imagem: formEdit[3].value,
    //                 descricao: formEdit[4].value
    //             }
    //             Api.editPost(id, token, data)
    //             modalContainer.style.display = 'none'
    //             setTimeout(() => {
    //                 document.location.reload(true)
    //             }, 1500)
    //         })
    //         cancelBtn.addEventListener('click', () => {
    //             modalContainer.style.display = 'none'
    //         })
    //         closeModal.addEventListener('click', () => {
    //             modalContainer.style.display = 'none'
    //         })
    //     })
    // })
}

renderizeUserProducts(productsArray)
// const logoutBtn = document.getElementById('dashboard-logout-button')



// logoutBtn.addEventListener("click", () => {
//     localStorage.clear()
//     window.location.href = "/index.html"
// })


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

    await Api.postNewProduct(newProduct)

    productsArray = await Api.getUserProducts()
    renderizeUserProducts(productsArray)

    const modalProduct = document.getElementById("add-product-modal")

    modalProduct.style.display = "none"
}

function displayConfirmDelete(event) {
    
    event.preventDefault()

    const productId = event.target.id
    console.log(productId)

    const confirmDeleteModal = document.getElementById("confirm-delete")

    confirmDeleteModal.style.display = "flex"

    const btnCancel = document.getElementById("cancel-delete")
    const btnDelete = document.getElementById("delete-product")

    btnCancel.addEventListener("click", (event)=>{

        event.preventDefault()

        confirmDeleteModal.style.display = "none"
    })

    btnDelete.addEventListener("click", (event)=>{

        event.preventDefault()

        Api.deletePost(productId)
    })
}

logoutBtn.addEventListener("click", () => {
    localStorage.clear()
    window.location.href = "/index.html"
})

function closeModalFunctionality() {
    for(let i = 0; i < closeModal.length; i++) {
        closeModal[i].addEventListener('click', (event) => {

            const modals = document.getElementsByClassName("modal")
            modals[i].style.display = "none"
        })
    }
}

closeModalFunctionality()