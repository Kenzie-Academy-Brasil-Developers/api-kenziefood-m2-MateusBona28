import Api from "./Api.js";

const ulProducts = document.getElementById("owner-product-list")



const productsArray = await Api.getUserProducts()
console.log(productsArray)


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