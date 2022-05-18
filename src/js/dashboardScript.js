import Api from "./Api.js";

const logoutBtn = document.getElementById('dashboard-logout-button')

function productsHomePage(products) {
    const containerCards = document.querySelector('#owner-product-list')
    console.log(products)
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

        cardFooterPrice.innerText = element.preco
        cardFooterAddCart.innerText = 'Add'
        cardFooterAddCart.dataset.id = element.id
        cardFooter.append(cardFooterPrice, cardFooterAddCart)

        card.append(figure, cardBody, cardCategory, cardFooter)

        containerCards.append(card)
    })
}

function filterPerCategory() {
    const list = document.getElementById('category-list')
    list.addEventListener('click', (event) => {
        const e = event.target
        const target = e.innerText
        const filter = privateProducts.filter(element => {
            return element.categoria === target
        })
        
        if(target !== 'Todos') {
            productsHomePage(filter)
        } else {
            productsHomePage(privateProducts)
        }
    })
}

const privateProducts = await Api.getPrivateProducts()

productsHomePage(privateProducts)

filterPerCategory()

logoutBtn.addEventListener("click", () => {
    localStorage.clear()
    window.location.href = "/index.html"
})

export default productsHomePage