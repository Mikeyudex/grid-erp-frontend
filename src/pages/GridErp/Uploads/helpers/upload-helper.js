import { GET_UPLOAD_HISTORY_BYUSERID } from "./url-helper";





export class UploadHelper {


    async getUploadHistoryByUserId(userId) {
        let response = await fetch(`${GET_UPLOAD_HISTORY_BYUSERID}/${userId}`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
            },
        });

        if (response.ok) {
            return response.json();
        } else {
            throw new Error("Error al obtener el historial de cargues");
        }
    }

}