import { IndexedDBService } from "../indexedDb/indexed-db-helper";


const indexedDBService = new IndexedDBService();

export const returnToSignIn = async (navigate) => {
    try {
        document.cookie = "jwt-quality=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
        localStorage.clear();
        await indexedDBService.clearStore();
        return navigate('/auth-signin');
    } catch (error) {
        console.log(error);
        return navigate('/auth-signin');
    }
};


export const logoutUserBackoffice = async (navigate) => {
    try {
        document.cookie = "jwt-quality=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
        localStorage.clear();
        await indexedDBService.clearStore();
        return navigate('/auth-signin');
    } catch (error) {
        console.log(error);
        return navigate('/auth-signin');
    }
};