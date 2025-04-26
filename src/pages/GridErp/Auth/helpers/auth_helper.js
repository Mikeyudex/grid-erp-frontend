import { APIClient } from "../../../../helpers/api_helper";
import * as url from "./url_helper";
import moment from "moment";
import 'moment/locale/es';

moment.locale('es');

const api = new APIClient();

export class AuthHelper {

    login = (payload) => api.post(`${url.LOGIN}`, payload);
    signUp = (payload) => api.post(`${url.SIGN_UP}`, payload);


}