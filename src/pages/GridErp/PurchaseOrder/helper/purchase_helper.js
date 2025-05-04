import { APIClient } from "../../../../helpers/api_helper";
import * as url from "./url_helper";


const api = new APIClient();

export class PurchaseHelper {
    changeStatusPurchaseOrder = async (orderId, itemId, userId, data) => api.put(`${url.CHANGE_STATUS_PURCHASE_ORDER}/${orderId}/${itemId}/${userId}`, data);
    assignItemToProductionOperator = async (orderId, itemId, userId) => api.put(`${url.ASSIGN_ITEM_TO_PRODUCTION_OPERATOR}/${orderId}/${itemId}/${userId}`);
}

export const purchaseOrderStatus = {
    libre: 'libre',
    asignado: 'asignado',
    fabricacion: 'fabricacion',
    despachado: 'despachado',
}