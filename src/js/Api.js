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

}

export default Api;