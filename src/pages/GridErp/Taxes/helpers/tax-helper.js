import { getToken } from "../../../../helpers/jwt-token-access/get_token";
import { BASE_URL } from "../../../../helpers/url_helper";



export class TaxHelper {
    constructor() {
        this.baseUrl = `${BASE_URL}/taxes`;
    }

    async getAll() {
        let token = getToken();
        return fetch(`${this.baseUrl}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                "Authorization": `Bearer ${token}`,
            },
        })
            .then(response => response.json())
            .then(data => data)
            .catch(err => console.log(err));
    }

    async create(data) {
        let token = getToken();
        return fetch(`${this.baseUrl}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                "Authorization": `Bearer ${token}`,
            },
            body: JSON.stringify(data),
        })
            .then(response => response.json())
            .then(data => data)
            .catch(err => {
                throw err;
            });
    }

    async update(data) {
        let token = getToken();
        return fetch(`${this.baseUrl}/${data._id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                "Authorization": `Bearer ${token}`,
            },
            body: JSON.stringify(data),
        })
            .then(response => response.json())
            .then(data => data)
            .catch(err => console.log(err));
    }

    async delete(id) {
        let token = getToken();
        return fetch(`${this.baseUrl}/${id}`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
                "Authorization": `Bearer ${token}`,
            },
        })
            .then(response => response.json())
            .then(data => data)
            .catch(err => console.log(err));
    }

    async getById(id) {
        let token = getToken();
        return fetch(`${this.baseUrl}/${id}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                "Authorization": `Bearer ${token}`,
            },
        })
            .then(response => response.json())
            .then(data => data)
            .catch(err => console.log(err));
    }
}