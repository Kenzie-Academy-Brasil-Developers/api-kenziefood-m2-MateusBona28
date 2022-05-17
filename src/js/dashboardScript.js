import Api from "./Api.js";

const ulProducts = document.getElementById("owner-product-list")
const btnAddProduct = document.getElementById("new-product-button")
const allModals = document.getElementsByClassName("modal")
const closeModals = document.getElementsByClassName("close-modal")
const btnPostProduct = document.getElementById("add-product")
const deleteProduct = document.getElementsByClassName("delete-product")


btnAddProduct.addEventListener("click", displayNewProductModal)

const productsArray = await Api.getUserProducts()
console.log(productsArray)

renderizeUserProducts(productsArray)


for(let i = 0; i < allModals.length; i++){
    
    const modal = allModals[i]

    modal.addEventListener("click", closeAllModals)
}

for(let i = 0; i < deleteProduct.length; i++){

    deleteProduct[i].addEventListener("click", displayConfirmDelete)
    
}

btnPostProduct.addEventListener("click", postNewProduct)


function renderizeUserProducts(productsArray) {

    if(productsArray.length > 0){
        productsArray.forEach(product => {
            
            const productCardLi = document.createElement("li")
            const cardImg = document.createElement("img")
            const cardProductName = document.createElement("h3")
            const cardCategories = document.createElement("span")
            const cardDescription = document.createElement("span")
            const cardEditProduct = document.createElement("img")
            const cardDeleteProduct = document.createElement("img")

            productCardLi.classList.add("product-card")
            productCardLi.id = product.id

            cardImg.setAttribute("src", `${product.imagem}`)

            cardProductName.innerText = product.nome
            
            cardCategories.innerText = product.categoria

            cardDescription.innerText = product.descricao

            cardEditProduct.setAttribute("src", "#")
            
            cardDeleteProduct.classList.add("delete-product")
            cardDeleteProduct.setAttribute("src", "#")
            cardDeleteProduct.id = product.id

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

function displayNewProductModal(event) {

    const modalProduct = document.getElementById("add-product-modal")

    modalProduct.style.display = "flex"

    event.preventDefault()


}

function closeAllModals(event) {

    event.preventDefault()

    for(let i = 0; i < closeModals.length; i++){
        if(event.target.id === "close-modal"){
            allModals[i].style.display = "none"
        }
    }
}

async function postNewProduct(event) {

    event.preventDefault()

    const formNewProduct = document.getElementById("form-add-product")

    const newProductInfo = formNewProduct.elements

    console.log(newProductInfo)

    const newProduct = {}

    for(let i = 0; i < newProductInfo.length; i++){

        const info = newProductInfo[i]

        if(info.value !== ""){
            newProduct[info.name] = info.value
        }
    }

    await Api.postNewProduct(newProduct)
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