import { getToken } from "../../../../helpers/jwt-token-access/get_token";
import { BASE_URL } from "../../../../helpers/url_helper";



export class AdministrationHelper {
    constructor() {
        this.baseUrl = `${BASE_URL}/users`;
    }

    async getUsers() {
        try {
            let token = getToken();
            const response = await fetch(`${this.baseUrl}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    "Authorization": `Bearer ${token}`,
                },
            })
            return response;
        } catch (error) {
            throw new Error(error);
        }
    }
}