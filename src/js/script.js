import Api from "./Api.js";

const api_products = await Api.getPublicProducts()
const cart_items_list     = document.querySelector("#cart-list")
const cart_items_quantity = document.querySelector("#cart-footer-total-amount > p")
const cart_items_price    = document.querySelector("#cart-footer-total-price > p")

function cart_item_template(image, name, description, price, id) {
    const cart_item = document.createElement("li")
    cart_item.id = id
    cart_item.innerHTML =  `<div class="cart-item-header">
                                <img src="${image}" alt="product" class="cart-item-image">

                                <div class="cart-item-info">
                                    <h4 class="cart-item-name">${name}</h4>
                                    <p class="cart-item-description">
                                        ${description}
                                    </p>
                                </div>

                                <button class="cart-remove-button">teste</button>
                            </div>

                            <div class="cart-item-footer">
                                <div class="cart-item-price">
                                    <p>
                                        R$${price}
                                    </p>
                                </div>

                                <div class="cart-item-quantity">
                                    <p>
                                        1
                                    </p>
                                </div>
                            </div>`

    cart_items_list.appendChild(cart_item)
    localStorage.setItem(`@${id}`, id)
}

function cart_products(array) {
    array.forEach(element => {
        cart_item_template(element.imagem,
                           element.nome,
                           element.descricao,
                           element.preco,
                           element.id)
    });
}

function find_on_API_by_ID(productsIds) {
    let products = []
    productsIds.forEach(ids => {
        api_products.find(element => {
            if (element.id === ids) {
                products.push(element)
            }
        })
    })
    return products
}

/* remover esses IDS de teste e passar o array com os novos IDS pra buscar na API */
let ids_for_test = ["7ceaf644-8169-472a-8610-54f68f3cea7e",
                    "dba6fb97-89fa-410f-818e-2445a4e013c0",
                    "20072a65-cd42-4433-8541-a6a6e9637084",
                    "c4e8e1ed-91a9-497e-b67a-47d23fca32a2"]

let produtos_teste = find_on_API_by_ID(ids_for_test)

cart_products(produtos_teste)

function remove_buttons() {
    const get_remove_buttons = document.getElementsByClassName("cart-remove-button")
    for (let i = 0; i < get_remove_buttons.length; i++) {
        get_remove_buttons[i].addEventListener("click", target => {

            const product_ID = target.path[2].id
            target.path[2].remove()
            
            /* passar novo array de IDS aqui */
            produtos_teste = produtos_teste.filter(element => product_ID !== element.id)
            
            localStorage.removeItem(`@${product_ID}`)

            /* colocar aqui a requisição de delete da API e passar
            a const productID como parâmetro */
            
            /* passar novo array de IDS aqui */
            quantity_update(produtos_teste)
            price_update(produtos_teste)
        })
    }
}

remove_buttons()

function quantity_update(array) {
    cart_items_quantity.innerText = array.length
}

function price_update(array) {
    let final_price = 0
    array.forEach(element => {
        final_price += element.preco
    })
    cart_items_price.innerText = final_price
}