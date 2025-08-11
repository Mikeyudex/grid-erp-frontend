import { getToken } from "./jwt-token-access/get_token";
import { BASE_URL, UPLOAD_FILE } from "./url_helper";



export const handleFileUpload = async (file) => {
    try {
        let formData = new FormData();
        formData.append("file", file);
        let token = getToken();
        let response = await fetch(`${BASE_URL}${UPLOAD_FILE}`, {
            method: "POST",
            headers: {
                "Authorization": `Bearer ${token}`,
            },
            body: formData,
        });
        let data = await response.json();
        let url = data?.url;
        if (url) {
            url = `${BASE_URL}${url}`;
        }
        return { url };
    } catch (error) {
        throw new Error('Error al subir archivo: ' + error.message);
    }
}