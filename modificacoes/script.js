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

    /* aqui ta a diferença entre a função antiga e essa nova,
        tem que botar essa verificação na função antiga*/
    if (requestStatus === false) {
        errorModalDisplay()
    } else {
        successModalDisplay()
    }
    
    productsArray = await Api.getUserProducts()
    renderizeUserProducts(productsArray)
}

function errorModalDisplay() {
    const modalBody    = document.getElementById("error-product-status-modal")
    const modalMessage = document.getElementById("error-status-message")
    const modalBtn     = document.getElementById("close-error-modal-status-btn")

    modalBody.style.display = "flex"
    modalBody.classList.add("dashboard-body-modal")
    modalMessage.classList.add("dashboard-modal-status-message")
    modalBtn.classList.add("close-dashboard-error-modal-status")
}

function successModalDisplay() {
    const modalBody    = document.getElementById("success-product-status-modal")
    const modalMessage = document.getElementById("success-status-message")
    const modalBtn     = document.getElementById("close-success-modal-status-btn")

    modalBody.style.display = "flex"
    modalBody.classList.add("dashboard-body-modal")
    modalMessage.classList.add("dashboard-modal-status-message")
    modalBtn.classList.add("close-dashboard-error-modal-status")
}

function deleteErrorModalDisplay() {
    const modalBody    = document.getElementById("delete-error-product-status-modal")
    const modalMessage = document.getElementById("delete-error-status-message")
    const modalBtn     = document.getElementById("close-error-delete-modal-status-btn")

    modalBody.style.display = "flex"
    modalBody.classList.add("dashboard-body-modal")
    modalMessage.classList.add("dashboard-modal-status-message")
    modalBtn.classList.add("close-dashboard-error-modal-status")
}

function deleteSuccessModalDisplay() {
    const modalBody    = document.getElementById("delete-success-product-status-modal")
    const modalMessage = document.getElementById("delete-success-status-message")
    const modalBtn     = document.getElementById("close-success-delete-modal-status-btn")

    modalBody.style.display = "flex"
    modalBody.classList.add("dashboard-body-modal")
    modalMessage.classList.add("dashboard-modal-status-message")
    modalBtn.classList.add("close-dashboard-error-modal-status")
}

function editErrorModalDisplay() {
    const modalBody    = document.getElementById("edit-error-product-status-modal")
    const modalMessage = document.getElementById("edit-error-status-message")
    const modalBtn     = document.getElementById("close-error-edit-modal-status-btn")

    modalBody.style.display = "flex"
    modalBody.classList.add("dashboard-body-modal")
    modalMessage.classList.add("dashboard-modal-status-message")
    modalBtn.classList.add("close-dashboard-error-modal-status")
}

function editSuccessModalDisplay() {
    const modalBody    = document.getElementById("edit-success-product-status-modal")
    const modalMessage = document.getElementById("edit-success-status-message")
    const modalBtn     = document.getElementById("close-success-edit-modal-status-btn")

    modalBody.style.display = "flex"
    modalBody.classList.add("dashboard-body-modal")
    modalMessage.classList.add("dashboard-modal-status-message")
    modalBtn.classList.add("close-dashboard-error-modal-status")
}

/*  atualizar as requisições da API, colocar essas no lugar que retornam
    response.ok

static async postNewProduct(data) {
    const addProductUrl = "/my/products"
    const response = await fetch(`${this.baseUrl}${addProductUrl}`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${localStorage.getItem("token")}`
        },
        body: JSON.stringify(data)
    })
    return response.ok
}

static async deletePost(id) {
    const deleteUrl = `/my/products/${id}`
    let response = fetch(`${this.baseUrl}${deleteUrl}`,{
        method: "DELETE",
        headers: {
            "Authorization" : `Bearer ${localStorage.getItem("token")}`
        }
    })

    //.finally(()=>{
    //    window.location.href = "dashboard.html"
    //})
    return response.ok
}

*/