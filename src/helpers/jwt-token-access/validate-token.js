import { getCookie } from "../cookies/cookie_helper";
import { BASE_URL, VALIDATE_TOKEN } from "../url_helper";


export const validateToken = async () => {
    const jwt = getCookie('jwt-quality');
    if (!jwt) {
        return false;
    }
    try {
        let response = await fetch(`${BASE_URL}${VALIDATE_TOKEN}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${jwt}`
            }
        });
        const data = await response.json();

        if (data?.statusCode === 200 && data?.message === 'token validado') {
            return true;
        } else {
            return false;
        }
    } catch (error) {
        console.log(error);
        return false;
    }
};