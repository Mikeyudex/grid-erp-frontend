import { APIClient } from "../../../../helpers/api_helper";
import * as url from "./url_helper";


const api = new APIClient();

export class PurchaseHelper {
    changeStatusPurchaseOrder = async (orderId, userId, data) => api.put(`${url.CHANGE_STATUS_PURCHASE_ORDER}/${orderId}/${userId}`, data);
    assignItemToProductionOperator = async (orderId, itemId, userId) => api.put(`${url.ASSIGN_ITEM_TO_PRODUCTION_OPERATOR}/${orderId}/${itemId}/${userId}`);
    assignOrderToZone = async (orderId, zoneId, userId) => api.put(`${url.ASSIGN_ORDER_TO_ZONE}/${orderId}/${zoneId}/${userId}`);
    changeStatusByItem = async (orderId, itemId, userId, data) => api.put(`${url.CHANGE_STATUS_PURCHASE_ORDER_BY_ITEM}/${orderId}/${itemId}/${userId}`, data);

    filterMaterialByMat = (matType, setFilteredMaterialTypes, matMaterialPrices) => {
        if (matType) {
            setFilteredMaterialTypes(Object.keys(matMaterialPrices[matType]));
        }
    };

    handleKeyDown = (e, createEmptyRow, setOrderItems) => {
        // Si la tecla presionada NO es Enter, salir
        if (e.key !== 'Enter') return;

        // Si el foco está dentro de un input, textarea o select, salir
        const tag = (e.target).tagName.toLowerCase();
        if (['input', 'textarea', 'select'].includes(tag)) return;

        // Lógica para crear nueva fila
        const newRow = createEmptyRow();
        setOrderItems(prev => [...prev, newRow]);
    };
}

export const purchaseOrderStatus = {
    libre: 'libre',
    asignado: 'asignado',
    fabricacion: 'fabricacion',
    despachado: 'despachado',
}