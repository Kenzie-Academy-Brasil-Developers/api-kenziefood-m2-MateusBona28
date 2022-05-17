//criar class para acessar o api
class Api {
    static async getPublicProducts() {
        const response = await fetch('https://api-kenzie-food.herokuapp.com/products', {
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
}

export default Api;