import { APIClient, ApiClientFetch } from "../../../../helpers/api_helper";
import { getToken } from "../../../../helpers/jwt-token-access/get_token";
import { BASE_URL } from "../../../../helpers/url_helper";
import * as url from "./url_helper";
import moment from "moment";
import 'moment/locale/es';

moment.locale('es');

const api = new APIClient();
const apiFetch = new ApiClientFetch();

export class ProductHelper {
    companyId = "66becedd790bddbc9b1e2cbc";
    // get attributes of product
    getAttrProduct = companyId => api.get(`${url.GET_ATTR_PRODUCT}/${companyId}`);
    addAttrProduct = payload => api.create(`${url.ADD_ATTR_PRODUCT}`, payload);
    importProducts = companyId => api.create(`${url.IMPORT_PRODUCTS}/${companyId}`);


    addProduct = payload => api.create(`${url.ADD_PRODUCT}`, payload);
    getProducts = (page, limit) => apiFetch.get(`${url.GET_PRODUCTS}?page=${page}&limit=${limit}`);
    getProductsLite = (page, limit) => apiFetch.get(`${url.GET_PRODUCTS_LITE}?page=${page}&limit=${limit}`);
    getCategoriesFullByProduct = companyId => apiFetch.get(`${url.GET_CATEGORIES_PRODUCT}?companyId=${companyId}`);
    getCategoriesFullByCompanySelect = companyId => api.get(`${url.GET_CATEGORIES_PRODUCT_SELECT}?companyId=${companyId}`);
    getLastSku = companyId => api.get(`${url.GET_LAST_SKU}/${companyId}`);
    deleteImageProduct = fileName => api.delete(`${url.DELETE_FILE}/${fileName}`);
    getTypesProduct = () => apiFetch.get(url.GET_TYPES_PRODUCT);

    //Sync product in marketplace
    syncProductWooCommerce = (payload, companyId) => api.create(`${url.SYNC_PRODUCT_WOOCOMMERCE}/${companyId}`, payload);
    syncProductWooCommerceQueue = (payload, companyId, idProduct) => api.create(`${url.SYNC_PRODUCT_WOOCOMMERCE_QUEUE}/${companyId}/${idProduct}`, payload);

    //Bodega
    getWarehouseByCompany = companyId => api.get(`${url.GET_WAREHOUSES_BYCOMPANY}?companyId=${companyId}`);
    getWarehouseByCompanySelect = companyId => api.get(`${url.GET_WAREHOUSES_BYCOMPANY_SELECT}?companyId=${companyId}`);

    //proveedor
    getProviderByCompany = companyId => api.get(`${url.GET_PROVIDERS_BYCOMPANY}?companyId=${companyId}`);

    //proveedor
    getAllUnitsMeasure = () => apiFetch.get(`${url.GET_UNIT_OF_MEASURE}`);

    //Impuestos
    getAllTaxes = () => apiFetch.get(`${url.GET_TAXES_BYCOMPANY}`);

    getClients = (page, limit, fields) => apiFetch.get(`${url.GET_CLIENTS_BY_FIELDS}?page=${page}&limit=${limit}&fields=${[fields]}`);

    getTypeOfPieces = () => apiFetch.get(`${url.GET_TYPE_OF_PIECES}`);

    getMatMaterialPrices = () => apiFetch.get(`${url.GET_MAT_MATERIAL_PRICES}`);

    addMaterialPrice = payload => api.create(`${url.ADD_MATERIAL_PRICE}`, payload);

    calcularPrecioFinalProducto = (productId, tipoTapete, material, cantidad, typeCustomerId) => apiFetch.get(`${url.CALCULATE_FINAL_PRICE}/${productId}/${tipoTapete}/${material}/${cantidad}/${typeCustomerId}`);

    calcularPrecioFinalProductoDesdePrecioBase = (precioBase, tipoTapete, material, cantidad, typeCustomerId) => apiFetch.get(`${url.CALCULATE_FINAL_PRICE_FROM_BASE_PRICE}/${precioBase}/${tipoTapete}/${material}/${cantidad}/${typeCustomerId}`);

    getPurchaseOrders = (page, limit, fields) => apiFetch.get(`${url.GET_PURCHASE_ORDERS}?page=${page}&limit=${limit}&fields=${[fields]}`);

    getPurchaseOrderById = (id) => apiFetch.get(`${url.GET_PURCHASE_ORDER_BY_ID}/${id}`);

    getPurchaseOrdersFromViewProduction = (page, limit, zoneId) => api.get(`${url.GET_PURCHASE_ORDERS_FROM_VIEW_PRODUCTION}?page=${page}&limit=${limit}&zoneId=${zoneId}`);

    getPurchaseOrdersFetch = async (page, limit, zoneId) => apiFetch.get(`${url.GET_PURCHASE_ORDERS}?page=${page}&limit=${limit}&zoneId=${zoneId}`);

    getPurchaseOrdersFree = async (page, limit) => apiFetch.get(`${url.GET_PURCHASE_ORDERS_FREE}?page=${page}&limit=${limit}`);

    getCountPurchaseOrdersByStatus = async (status) => apiFetch.get(`${url.GET_COUNT_PURCHASE_ORDERS_BY_STATUS}?status=${status}`);

    validateForm = (setErrors, formData) => {
        const newErrors = {};

        /* if (!formData.warehouseId || formData.warehouseId === '') {
            newErrors.warehouseId = 'La bodega es requerida';
        } */

        /* if (!formData.providerId || formData.providerId === '') {
            newErrors.providerId = 'El proveedor es requerido';
        } */

        if (!formData.name || formData.name === '') {
            newErrors.name = 'El nombre es requerido';
        }

        /* if (!formData.description || formData.description === '') {
            newErrors.description = 'La descripción es requerida';
        } */

        if (!formData.id_type_product || formData.id_type_product === '' || formData.id_type_product === '0') {
            newErrors.id_type_product = 'El tipo de vehículo es requerido';
        }

        if (!formData.id_category || formData.id_category === '') {
            newErrors.id_category = 'La marca es requerida';
        }

        /* if (!formData.id_sub_category || formData.id_sub_category === '') {
            newErrors.id_sub_category = 'La subcategoría es requerida';
        } */

        if (!formData.taxId || formData.taxId === '') {
            newErrors.taxId = 'El impuesto es requerido';
        }

        /* if (!formData.quantity || formData.quantity === '' || formData.quantity === 0) {
            newErrors.quantity = 'La cantidad es requerida';
        } */

        /* if (!formData.unitOfMeasureId || formData.unitOfMeasureId === '') {
            newErrors.unitOfMeasureId = 'La unidad de medida es requerida';
        } */

        if (!formData.costPrice || formData.costPrice === '' || formData.costPrice === 0) {
            newErrors.costPrice = 'El precio base es requerido';
        }

        /* if (!formData.salePrice || formData.salePrice === '' || formData.salePrice === 0) {
            newErrors.salePrice = 'El precio de venta es requerido';
        } */

        setErrors(newErrors);

        return Object.keys(newErrors).length === 0; // Devuelve true si no hay errores
    }

    getProductById = async (id) => {
        try {
            let token = getToken();
            let response = await fetch(`${url.GET_PRODUCT_BY_ID}/${id}`,
                {
                    method: "GET",
                    headers: {
                        "Content-Type": "application/json",
                        "Authorization": `Bearer ${token}`,
                    },
                }
            );
            if (response && response.status === 200) {
                let data = await response.json();
                return data;
            } else {
                return null;
            }
        } catch (error) {
            console.log(error);
            return null;
        }
    };

    uploadImage = async (file) => {
        try {
            let formData = new FormData();
            formData.append("file", file);
            let token = getToken();
            let response = await fetch(`${url.UPLOADIMAGE}`, {
                method: "POST",
                headers: {
                    "Authorization": `Bearer ${token}`,
                },
                body: formData,
            });
            let data = await response.json();
            let _url = data?.url;
            if (_url) {
                _url = `${BASE_URL}${_url}`;
            }
            return {
                url: _url,
                success: true,
            };
        } catch (error) {
            console.log(error);
            return {
                success: false,
                message: error.message,
            };
        }
    };
}

export const optionsSnackbarDanger = {
    position: 'top-right',
    style: {
        backgroundColor: '#ffece3',
        border: '2px solid #de6c37',
        color: '#de6c37',
        fontFamily: 'Menlo, monospace',
        fontSize: '1.2em',
        textAlign: 'center',
        marginTop: '3.5em',
    },
    closeStyle: {
        color: '#de6c37',
        fontSize: '16px',
    },
};

export const optionsSnackbarSuccess = {
    position: 'top-right',
    style: {
        backgroundColor: '#dbf8f4',
        border: '2px solid #0eb6b6',
        color: '#0eb6b6',
        fontFamily: 'Menlo, monospace',
        fontSize: '1.2em',
        textAlign: 'center',
        marginTop: '3.5em',
    },
    closeStyle: {
        color: '#0eb6b6',
        fontSize: '16px',
    },
};

export const numberFormatPrice = (value = "") => {

    let USDollar = new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: "USD",
    });
    let operator = USDollar.format(value).split(".")[0]

    return operator;
};



export const handleValidDate = (date) => {
    const date1 = moment(new Date(date)).format("DD MMM Y");
    return date1;
};

export const handleValidTime = (time) => {
    const time1 = new Date(time);
    const getHour = time1.getUTCHours();
    const getMin = time1.getUTCMinutes();
    const getTime = `${getHour}:${getMin}`;
    var meridiem = "";
    if (getHour >= 12) {
        meridiem = "PM";
    } else {
        meridiem = "AM";
    }
    const updateTime = moment(getTime, 'hh:mm').format('hh:mm') + " " + meridiem;
    return updateTime;
};