import moment from "moment";
import 'moment/locale/es';

import { companyId, GET_SUBCATEGORIES } from "./url_helper";
import { APIClient } from "../../../../helpers/api_helper";

moment.locale('es');

const api = new APIClient();

export class SubCategoryHelper {

    getSubCategories(page, limit) {
        return api.get(`${GET_SUBCATEGORIES}?companyId=${companyId}&page=${page}&limit=${limit}`);
    }

}