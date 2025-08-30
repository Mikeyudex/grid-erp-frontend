import { getToken } from "../../../../helpers/jwt-token-access/get_token";
import { BASE_URL } from "../../../../helpers/url_helper";



export class RetentionHelper {
    constructor() {
        this.baseUrl = `${BASE_URL}/retention`;
    }

    async getRetentions() {
        let token = getToken();
        return fetch(`${this.baseUrl}/getAll`, {
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

    async createRetention(data) {
        let token = getToken();
        return fetch(`${this.baseUrl}/create`, {
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

    async updateRetention(data) {
        let token = getToken();
        return fetch(`${this.baseUrl}/update/${data._id}`, {
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

    async deleteRetention(id) {
        let token = getToken();
        return fetch(`${this.baseUrl}/delete/${id}`, {
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

    async bulkDeleteRetentions(ids) {
        let token = getToken();
        return fetch(`${this.baseUrl}/bulkDelete`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
                "Authorization": `Bearer ${token}`,
            },
            body: JSON.stringify({ ids }),
        })
            .then(response => response.json())
            .then(data => data)
            .catch(err => console.log(err));
    }

    async getRetention(id) {
        let token = getToken();
        return fetch(`${this.baseUrl}/getById/${id}`, {
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