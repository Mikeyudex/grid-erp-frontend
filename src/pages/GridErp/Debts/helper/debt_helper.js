import { getToken } from "../../../../helpers/jwt-token-access/get_token";
import { BASE_URL } from "../../../../helpers/url_helper";


export class DebtHelper {
    constructor() {
        this.baseUrl = `${BASE_URL}/debt`;
    }

    async getDebts(page = 1, limit = 10, search = '') {
        let token = getToken();
        return fetch(`${this.baseUrl}?page=${page}&limit=${limit}&search=${search}`, {
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

    async getDebt(id) {
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

    async createDebt(debt) {
        let token = getToken();
        return fetch(`${this.baseUrl}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                "Authorization": `Bearer ${token}`,
            },
            body: JSON.stringify(debt),
        })
            .then(response => response.json())
            .then(data => data)
            .catch(err => console.log(err));
    }

    async updateDebt(debt) {
        let token = getToken();
        return fetch(`${this.baseUrl}/${debt._id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                "Authorization": `Bearer ${token}`,
            },
            body: JSON.stringify(debt),
        })
            .then(response => response.json())
            .then(data => data)
            .catch(err => console.log(err));
    }

    async deleteDebt(id) {
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

    async bulkDeleteDebts(ids) {
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
}