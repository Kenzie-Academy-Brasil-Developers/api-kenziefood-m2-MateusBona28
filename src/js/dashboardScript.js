import Api from "./Api.js";

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
            const cardImg = document.createElement("img")
            const cardProductName = document.createElement("h3")
            const cardCategories = document.createElement("span")
            const cardDescription = document.createElement("span")
            const cardEditProduct = document.createElement("button")
            const cardDeleteProduct = document.createElement("img")

            productCardLi.classList.add("product-card")
            productCardLi.id = product.id

            cardImg.setAttribute("src", `${product.imagem}`)

            cardProductName.innerText = product.nome
            
            cardCategories.innerText = product.categoria

            cardDescription.innerText = product.descricao

            cardEditProduct.classList.add('edit-product')
            cardEditProduct.setAttribute("src", "#")
            cardEditProduct.id = product.id
            cardEditProduct.innerText = 'Editar'
            cardEditProduct.addEventListener('click', editProduct)
            
            cardDeleteProduct.classList.add("delete-product")
            cardDeleteProduct.setAttribute("src", "#")
            cardDeleteProduct.id = product.id
            cardDeleteProduct.addEventListener('click', displayConfirmDelete)

            productCardLi.appendChild(cardImg)
            productCardLi.appendChild(cardProductName)
            productCardLi.appendChild(cardCategories)
            productCardLi.appendChild(cardDescription)
            productCardLi.appendChild(cardEditProduct)
            productCardLi.appendChild(cardDeleteProduct)

            ulProducts.appendChild(productCardLi)
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
const logoutBtn = document.getElementById('dashboard-logout-button')

/*

se descomentar isso ele dá conflito com o script.js,
    pq o script tá lendo esse eventListener por algum motivo

logoutBtn.addEventListener("click", () => {
    localStorage.clear()
    window.location.href = "/index.html"
})*/


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

