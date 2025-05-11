import { APIClient } from "../../../../helpers/api_helper";
import * as url from "./url_helper";


const api = new APIClient();

export class PurchaseHelper {
    changeStatusPurchaseOrder = async (orderId, userId, data) => api.putFetch(`${url.CHANGE_STATUS_PURCHASE_ORDER}/${orderId}/${userId}`, data);
    assignItemToProductionOperator = async (orderId, itemId, userId) => api.put(`${url.ASSIGN_ITEM_TO_PRODUCTION_OPERATOR}/${orderId}/${itemId}/${userId}`);
    assignOrderToZone = async (orderId, zoneId, userId) => api.put(`${url.ASSIGN_ORDER_TO_ZONE}/${orderId}/${zoneId}/${userId}`);
    changeStatusByItem = async (orderId, itemId, userId, data) => api.put(`${url.CHANGE_STATUS_PURCHASE_ORDER_BY_ITEM}/${orderId}/${itemId}/${userId}`, data);
}

export const purchaseOrderStatus = {
    libre: 'libre',
    asignado: 'asignado',
    fabricacion: 'fabricacion',
    despachado: 'despachado',
}