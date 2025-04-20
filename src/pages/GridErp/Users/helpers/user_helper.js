import { APIClient } from "../../../../helpers/api_helper";
import * as url from "./url_helper";

const api = new APIClient();

export class UserHelper {

    getUsers = () => api.get(`${url.GET_USERS}`);
}