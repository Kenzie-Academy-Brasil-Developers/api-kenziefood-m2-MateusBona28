//criar class para acessar o api
class Api {

    static baseUrl = "https://api-kenzie-food.herokuapp.com"

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
}

export default Api;