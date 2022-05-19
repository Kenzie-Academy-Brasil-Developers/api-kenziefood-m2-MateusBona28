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
    
    static async getPrivateProducts() {
        const response = await fetch('https://api-kenzie-food.herokuapp.com/my/products', {
            method: "GET",
            headers: {
                "Authorization": `Bearer ${localStorage.getItem("token")}`,
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
        }).then((response)=>{
            return response.json()
            
        }).then((response)=>{
            localStorage.setItem("token", response)
        }).finally(()=>{
            window.location.href = "index.html"
        })
        
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

    static async postCartProduct(id) {

        const postCartProductUrl = "/cart/add"

        const response = await fetch(`${this.baseUrl}${postCartProductUrl}`,{
            method: "POST",
            headers: {
                "Content-Type" : "application/json",
                "Authorization": `Bearer ${localStorage.getItem("token")}`,
            },
            body: JSON.stringify({"product_id": id})
        })

        const newData = await response.json()

        return newData
        
    }

    static async getCartProducts() {

        const getCartProducts = "/cart"

        const response = await fetch(`${this.baseUrl}${getCartProducts}`,{
            method: "GET",
            headers: {
                "Content-Type" : "application/json",
                "Authorization": `Bearer ${localStorage.getItem("token")}`
            },
        })

        const data = await response.json()

        return data
    }

    static async deleteCartProduct(id){

        const deleteProductUrl = `/cart/remove/${id}`

        const response = await fetch(`${this.baseUrl}${deleteProductUrl}`,{
            method: "DELETE",
            headers: {"Authorization" : `Bearer ${localStorage.getItem("token")}`}
        })
    }
}

export default Api;