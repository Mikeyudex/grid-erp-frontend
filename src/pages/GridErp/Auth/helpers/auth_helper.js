import { APIClient } from "../../../../helpers/api_helper";
import { getToken } from "../../../../helpers/jwt-token-access/get_token";
import * as url from "./auth_url_helper";
import moment from "moment";
import 'moment/locale/es';

moment.locale('es');

const api = new APIClient();

export class AuthHelper {

    login = (payload) => api.create(`${url.SIGN_IN}`, payload);
    signUp = (payload) => api.create(`${url.SIGN_UP}`, payload);
    getResourcesByRoleId = (roleId) => api.get(`${url.GET_RESORCES_BY_ROLE}${roleId}`);
    getZones = () => api.get(`${url.GET_ZONES}`);
    getZoneById = (zoneId) => api.get(`${url.GET_ZONE_BY_ID}/${zoneId}`);
    generateQrCodeOtp = (email) => api.get(`${url.GENERATE_QR_OTP}/${email}`);
    requestPasswordReset = (payload) => api.create(`${url.REQUEST_PASSWORD_RESET}`, payload);
    verifyOtp = (payload) => api.create(`${url.VERIFY_OTP}`, payload);

    // fetch
    getZonesFetch = async () => {
        try {
            let token = getToken();
            let response = await fetch(`${url.GET_ZONES}`, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`,
                },
            });

            if (response && response.status === 200) {
                let data = await response.json();
                return data;
            }
        }
        catch (error) {
            console.log(error);
            return null;
        }
    };
}