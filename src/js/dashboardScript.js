import Api from "./Api.js";

const ulProducts = document.getElementById("owner-product-list")
const btnAddProduct = document.getElementById("new-product-button")
const allModals = document.getElementsByClassName("modal")
const closeModals = document.getElementsByClassName("close-modal")
const btnPostProduct = document.getElementById("add-product")


btnAddProduct.addEventListener("click", displayNewProductModal)

for(let i = 0; i < allModals.length; i++){
    
    const modal = allModals[i]

    modal.addEventListener("click", closeAllModals)
}

btnPostProduct.addEventListener("click", postNewProduct)

let productsArray = await Api.getUserProducts()


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

            cardImg.setAttribute("src", `${product.imagem}`)

            cardProductName.innerText = product.nome
            
            cardCategories.innerText = product.categoria

            cardDescription.innerText = product.descricao

            cardEditProduct.setAttribute("src", "#")
            cardEditProduct.id = product.id
            
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
