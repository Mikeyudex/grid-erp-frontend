import { getCookie } from "../cookies/cookie_helper";


export const getToken = () => {
    const userId = localStorage.getItem('userId');
    if(!userId) {
        return null;
    }
    const token = getCookie('jwt-quality');
    return token;
};