import { APIClient, ApiClientFetch } from "../../../../helpers/api_helper";
import * as url from "./url_helper";


const api = new APIClient();
const apiFetch = new ApiClientFetch();

export class PurchaseHelper {
    changeStatusPurchaseOrder = async (orderId, userId, data) => api.put(`${url.CHANGE_STATUS_PURCHASE_ORDER}/${orderId}/${userId}`, data);
    assignItemToProductionOperator = async (orderId, itemId, userId) => api.put(`${url.ASSIGN_ITEM_TO_PRODUCTION_OPERATOR}/${orderId}/${itemId}/${userId}`);
    assignOrderToZone = async (orderId, zoneId, userId) => api.put(`${url.ASSIGN_ORDER_TO_ZONE}/${orderId}/${zoneId}/${userId}`);
    changeStatusByItem = async (orderId, itemId, userId, data) => api.put(`${url.CHANGE_STATUS_PURCHASE_ORDER_BY_ITEM}/${orderId}/${itemId}/${userId}`, data);
    releaseOrder = async (orderId, userId) => apiFetch.update(`${url.RELEASE_ORDER}/${orderId}/${userId}`);

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

// Puntajes por estado de tapete
export const estadoPuntajes = {
    Pendiente: 0,
    Fabricación: 1,
    Inventario: 2,
    Entregado: 3,
}

// Función para calcular el porcentaje de progreso de un pedido
export const calculateOrderProgress = (productos) => {
    if (!productos || productos.length === 0) return 0

    const puntajeActual = productos.reduce((total, producto) => {
        return total + (estadoPuntajes[producto.estado] || 0)
    }, 0)

    const puntajeEsperado = productos.length * 3 // Máximo puntaje por producto

    return puntajeEsperado > 0 ? (puntajeActual / puntajeEsperado) * 100 : 0
}

// Función para obtener el color del badge según el porcentaje
export const getProgressBadgeColor = (percentage) => {
    if (percentage <= 33) return "danger"
    if (percentage <= 66) return "warning"
    return "success"
}

// Función para obtener el texto del progreso
export const getProgressText = (percentage) => {
    if (percentage <= 33) return "Bajo"
    if (percentage <= 66) return "Medio"
    return "Alto"
}