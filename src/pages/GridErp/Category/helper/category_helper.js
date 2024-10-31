import moment from "moment";
import 'moment/locale/es';

import { companyId, GET_CATEGORIES } from "./url_helper";
import { APIClient } from "../../../../helpers/api_helper";

moment.locale('es');

const api = new APIClient();

export class CategoryHelper {

    getCategories(page, limit) {
        return api.get(`${GET_CATEGORIES}/${companyId}?page=${page}&limit=${limit}`);
    }

}