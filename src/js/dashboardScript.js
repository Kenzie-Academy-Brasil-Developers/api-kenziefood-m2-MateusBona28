import Api from "./Api.js";

const logoutBtn = document.getElementById('dashboard-logout-button')
const ulProducts = document.getElementById("owner-product-list")
const btnAddProduct = document.getElementById("new-product-button")
const allModals = document.getElementsByClassName("modal")
const btnPostProduct = document.getElementById("add-product")
const deleteProduct = document.getElementsByClassName("delete-product")

btnAddProduct.addEventListener("click", displayNewProductModal)

let productsArray = await Api.getUserProducts()

renderizeUserProducts(productsArray)


for(let i = 0; i < allModals.length; i++){
    const modal = allModals[i]
    modal.addEventListener("click", closeModal)
}

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

            cardDescription.innerText = product.descricao

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
    formEdit[1].value = product[0].preco
    formEdit[2].value = product[0].categoria
    formEdit[3].value = product[0].imagem
    formEdit[4].value = product[0].descricao
    modalContainer.style.display = 'flex'
    sendBtn.addEventListener('click', () => {
        const data = {
            nome: formEdit[0].value,
            preco: formEdit[1].value,
            categoria: formEdit[2].value,
            imagem: formEdit[3].value,
            descricao: formEdit[4].value
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

function closeModal(event) {

    event.preventDefault()
    if(event.target.classList == 'close-modal'){
        const targetModal = event.target.closest('.modal')
        targetModal.style.display = 'none'
    }
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
