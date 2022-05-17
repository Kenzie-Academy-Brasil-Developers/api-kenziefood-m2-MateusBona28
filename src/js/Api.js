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

        const newData = response.json()

        localStorage.setItem("token", newData.token)
        localStorage.setItem("userId", newData.userId)
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

        const newData = response.json()

        console.log(newData)
    }
}

export default Api;