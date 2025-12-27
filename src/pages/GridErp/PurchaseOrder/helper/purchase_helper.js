import { SaveIcon, SkipBackIcon, XCircleIcon } from "lucide-react";
import { APIClient, ApiClientFetch } from "../../../../helpers/api_helper";
import { getToken } from "../../../../helpers/jwt-token-access/get_token";
import { BASE_URL } from "../../../../helpers/url_helper";
import * as url from "./url_helper";


const api = new APIClient();
const apiFetch = new ApiClientFetch();

export class PurchaseHelper {
    changeStatusPurchaseOrder = async (orderId, userId, data) => api.put(`${url.CHANGE_STATUS_PURCHASE_ORDER}/${orderId}/${userId}`, data);
    assignItemToProductionOperator = async (orderId, itemId, userId) => api.put(`${url.ASSIGN_ITEM_TO_PRODUCTION_OPERATOR}/${orderId}/${itemId}/${userId}`);
    assignOrderToZone = async (orderId, zoneId, userId) => api.put(`${url.ASSIGN_ORDER_TO_ZONE}/${orderId}/${zoneId}/${userId}`);
    changeStatusByItem = async (orderId, itemId, userId, data) => api.put(`${url.CHANGE_STATUS_PURCHASE_ORDER_BY_ITEM}/${orderId}/${itemId}/${userId}`, data);
    releaseOrder = async (orderId, userId) => apiFetch.update(`${url.RELEASE_ORDER}/${orderId}/${userId}`);
    dispatchOrder = async (orderId, userId) => apiFetch.update(`${url.DISPATCH_ORDER}/${orderId}/${userId}`);
    autoAsignarOrder = async (orderId, userId, zoneId) => apiFetch.update(`${url.AUTO_ASIGN_ORDER}/${orderId}/${userId}/${zoneId}`);
    getSalesAdvisors = async () => apiFetch.get(`${url.GET_SALES_ADVISORS}`);
    searchProductByFullText = async (typeProduct, search) => apiFetch.get(`${url.SEARCH_PRODUCT_BY_FULL_TEXT}?typeProduct=${typeProduct}&search=${search}`);

    getAdvanceByCustomer = async (customerId, typeOperation = 'anticipo', page = 1, limit = 10) => {
        try {
            let token = getToken();
            let response = await fetch(`${BASE_URL}/accounting/income/getAllByCustomerAndTypeOperation/${customerId}/${typeOperation}?page=${page}&limit=${limit}`,
                {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`
                    }
                }
            );
            return response.json();
        } catch (error) {
            console.error("Error fetching advance by customer:", error);
            throw error;

        }
    }

    filterMaterialByMat = (matType, setFilteredMaterialTypes, matMaterialPrices) => {
        if (matType) {
            setFilteredMaterialTypes(Object.keys(matMaterialPrices[matType]));
        }
    };

    filterMaterialByMatSync = (matType, matMaterialPrices) => {
        if (!matType || !matMaterialPrices[matType]) return [];
        return Object.keys(matMaterialPrices[matType]);
    };

    handleKeyDown = (e, createEmptyRow, setOrderItems) => {
        // Si la tecla presionada NO es Enter, salir
        if (e.key !== 'Enter') return;

        // Si el foco está dentro de un input, textarea o select, salir
        const tag = (e.target).tagName.toLowerCase();
        if (['input', 'textarea', 'select'].includes(tag)) return;

        // Lógica para crear nueva fila
        this.handleCreateEmptyRow(createEmptyRow, setOrderItems);
    };

    handleCreateEmptyRow = (createEmptyRow, setOrderItems) => {
        const newRow = createEmptyRow();
        setOrderItems(prev => [...prev, newRow]);
    }
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


// helper local para sumar totales de items
export const sumTotalOrderFromItems = (items) =>
    items.reduce((acc, it) => acc + (it.totalItem ?? (it.priceItem * (it.quantity ?? 1))), 0);

// helper para crear un método de pago por defecto
export const createDefaultPayment = (valor = 0) => ({
    cuenta: "",
    typeOperation: "",
    fecha: new Date().toISOString().split("T")[0],
    valor,
    soporte: null,
});

export const actionsSpeedDialPurchaseOrder = (mode, onClick) => {

    return [
        { icon: <SaveIcon />, name: `${mode === "edit" ? "Actualizar" : "Crear"}`, onClick: onClick },
        { icon: <XCircleIcon />, name: 'Cancelar' },
    ];
}
