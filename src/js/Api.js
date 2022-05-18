//criar class para acessar o api
class Api {
    static baseUrl = "https://api-kenzie-food.herokuapp.com"
    
    static async getPublicProducts() {
        const response = await fetch(`${this.baseUrl}/products`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json"
            },
        })
        .then(response => response.json())
        .then(response => response)
        .catch(error => error)
        
        return response
    }
    
    static async getPrivateProducts(token) {
        const response = await fetch('https://api-kenzie-food.herokuapp.com/my/products', {
            method: "GET",
            headers: {
                "Authorization": `Bearer ${token}`,
                "Content-Type": "application/json"
            },
        })
        .then(response => response.json())
        .then(response => response)
        .catch(error => error)
    
        return response
    }

    static async getUserRegister(data) {
        const registerUrl = "/auth/register"
        const response = await fetch(`${this.baseUrl}${registerUrl}`,{
            method: "POST",
            headers: {
                "Content-Type" : "application/json"
            },
            body: JSON.stringify(data)
        })
    }

    static async getUserLogin(data) {
        const loginUrl = "/auth/login"
        const response = await fetch(`${this.baseUrl}${loginUrl}`,{
            method: "POST",
            headers: {
                "Content-Type" : "application/json"
            },
            body: JSON.stringify(data)
        })
        const newData = await response.json()
        localStorage.setItem("token", newData)
        //console.log(newData)
    }

    static async getUserProducts(data) {

        const productsUrl = "/my/products"

        const response = await fetch(`${this.baseUrl}${productsUrl}`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${localStorage.getItem("token")}`
            },
            body: JSON.stringify(data)
        })

        const newData = await response.json()

        return newData
    }

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
    }

    static async deletePost(id) {

        const deleteUrl = `/my/products/${id}`

        fetch(`${this.baseUrl}${deleteUrl}`,{
            method: "DELETE",
            headers: {
                "Authorization" : `Bearer ${localStorage.getItem("token")}`
            }
        }).finally(()=>{
            window.location.href = "dashboard.html"
        })
    }

    static async editPost(id, token, data) {
        const response = await fetch(`${this.baseUrl}/my/products/${id}`, {
            method: "PATCH",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`
            },
            body: JSON.stringify(data)
        })
        .then(response => response.json())
        .then(response => response)
        .catch(error => error)

        return response
    }
}

export default Api;