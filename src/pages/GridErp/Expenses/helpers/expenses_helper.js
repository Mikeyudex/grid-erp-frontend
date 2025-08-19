import { getToken } from "../../../../helpers/jwt-token-access/get_token";
import { BASE_URL } from "../../../../helpers/url_helper";



export class ExpensesHelper {
    constructor() {
        this.baseUrl = `${BASE_URL}/accounting/type-of-expense`;
    }

    async getTypeOfExpenses() {
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

    async getTypeOfExpense(id) {
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

    async createTypeOfExpense(typeOfExpense) {
        let token = getToken();
        return fetch(`${this.baseUrl}/create`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                "Authorization": `Bearer ${token}`,
            },
            body: JSON.stringify(typeOfExpense),
        })
            .then(response => response.json())
            .then(data => data)
            .catch(err => console.log(err));
    }

    async updateTypeExpense(typeOfExpense) {
        let token = getToken();
        return fetch(`${this.baseUrl}/update/${typeOfExpense._id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                "Authorization": `Bearer ${token}`,
            },
            body: JSON.stringify(typeOfExpense),
        })
            .then(response => response.json())
            .then(data => data)
            .catch(err => console.log(err));
    }

    async deleteTypeExpense(id) {
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

    async bulkDeleteTypeExpenses(ids) {
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