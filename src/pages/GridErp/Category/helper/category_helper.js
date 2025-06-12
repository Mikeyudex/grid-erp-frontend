import moment from "moment";
import 'moment/locale/es';

import { companyId, GET_CATEGORIES } from "./url_helper";
import { APIClient, ApiClientFetch } from "../../../../helpers/api_helper";

moment.locale('es');

const api = new APIClient();
const apiFetch = new ApiClientFetch();

export class CategoryHelper {

    getCategories(page, limit) {
        return apiFetch.get(`${GET_CATEGORIES}/${companyId}?page=${page}&limit=${limit}`);
    }

}