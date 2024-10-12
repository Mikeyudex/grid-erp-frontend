import { APIClient } from "../../../../../../helpers/api_helper";
import * as url from "./url_helper";

const api = new APIClient();

export class WooCommerceHelper {
    // get caterories woocommerce
    getCategoriesWoocommerce = companyId => api.get(`${url.GET_CATEGORIES_WOO}/${companyId}`);
}