import { BASE_URL, BASE_URL_IMPORT } from "../../../../helpers/url_helper";

const baseUrl = BASE_URL;
const baseUrlImport = BASE_URL_IMPORT;
export const companyId = "66becedd790bddbc9b1e2cbc";


export const CHANGE_STATUS_PURCHASE_ORDER = baseUrl + "/purchase-order/update-order-status";
export const CHANGE_STATUS_PURCHASE_ORDER_BY_ITEM = baseUrl + "/purchase-order/update-item-status";
export const ASSIGN_ITEM_TO_PRODUCTION_OPERATOR = baseUrl + "/purchase-order/assign-item-to-production-operator";
export const ASSIGN_ORDER_TO_ZONE = baseUrl + "/purchase-order/assign-order-to-zone";
export const RELEASE_ORDER = baseUrl + "/purchase-order/release-order";
export const DISPATCH_ORDER = baseUrl + "/purchase-order/dispatch-order";
export const AUTO_ASIGN_ORDER = baseUrl + "/purchase-order/auto-assign-order";
export const DELETE_PURCHASE_ORDER = baseUrl + "/purchase-order/delete-order";
export const BULK_DELETE_PURCHASE_ORDER = baseUrl + "/purchase-order/bulk-delete";
export const GET_SALES_ADVISORS = baseUrl + "/users/advisors/getAll";