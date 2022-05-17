//criar class para acessar o api
class Api {

    static baseURL = 'https://api-kenzie-food.herokuapp.com/'
    
    static register(data) {

        return fetch(`${Api.baseURL}/register`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        })
            .then(res => res.json())
            .catch(err => console.log(err))
    }

}

        

export default Api;