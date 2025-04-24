import axios from "axios"

export default class HttpService {
    private readonly API_URL : string = import.meta.env.VITE_API_URL;
    private readonly headers = {
        'Content-Type': 'application/json',
    }

    constructor(){}

    async post( endpoint: string, body: any, callback: Function ){
        axios
        .post(`${this.API_URL}${endpoint}`, body, { headers: this.headers })
        .then((res) => callback( null, res.data ))
        .catch((err) => callback( err.response.data.message, null ))
    }
}