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
            const divCardBody = document.createElement("div")
            const cardProductName = document.createElement("h2")
            const cardCategories = document.createElement("div")
            const cardDescription = document.createElement("p")
            const cardImgfigure = document.createElement("figure")
            const cardEditProduct = document.createElement("button")
            const cardDeleteProduct = document.createElement("button")

            productCardLi.classList.add("product-card", "card")
            productCardLi.id = product.id

            cardImgfigure.append(cardImg)
            cardImg.setAttribute("src", `${product.imagem}`)

            divCardBody.classList.add("card-body")
            cardProductName.innerText = product.nome
            cardDescription.innerText = product.descricao
            cardDescription.classList.add("card-desc")
            cardCategories.innerText = product.categoria
            cardCategories.classList.add("card-category")
            divCardBody.append(cardProductName, cardDescription)
            
            cardEditProduct.classList.add("edit-product")
            cardEditProduct.innerText = "Editar produto"
            cardEditProduct.id = product.id
            
            cardDeleteProduct.classList.add("delete-product")
            cardDeleteProduct.id = product.id
            cardDeleteProduct.innerText = "Deletar produto"
            cardDeleteProduct.addEventListener('click', displayConfirmDelete)

            productCardLi.append(cardImgfigure, divCardBody, cardCategories, cardEditProduct, cardDeleteProduct)

            ulProducts.classList.add('container-cards')
            ulProducts.appendChild(productCardLi)
        });
    }
    else{
        ulProducts.innerText = "Você ainda não cadastrou nenhum produto!"
    }
    
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
