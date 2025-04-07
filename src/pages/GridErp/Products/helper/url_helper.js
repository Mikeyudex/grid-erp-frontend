
const baseUrl = "http://localhost:5000";
const baseUrlImport = "http://localhost:4405";
export const companyId = "3423f065-bb88-4cc5-b53a-63290b960c1a";

// PRODUCTS
export const GET_LAST_SKU= baseUrl + "/products/last-sku";

//Attributes
export const GET_ATTR_PRODUCT= baseUrl + "/products/attributes/getByCompanyId";
export const ADD_ATTR_PRODUCT= baseUrl + "/products/attributes/create";

export const ADD_PRODUCT= baseUrl + "/products/create";
export const SYNC_PRODUCT_WOOCOMMERCE= baseUrl + "/api-woocommerce/syncProduct";
export const SYNC_PRODUCT_WOOCOMMERCE_QUEUE= baseUrl + "/api-woocommerce/queue/syncProduct";
export const UPDATE_PRODUCT= baseUrl + "/products/update";
export const DELETE_PRODUCT= baseUrl + "/products/delete";
export const GET_PRODUCTS = baseUrl + "/products/getAllByCompany";
export const GET_PRODUCTS_LITE = baseUrl + "/products/getAllByCompanyLite";
export const GET_CATEGORIES_PRODUCT = baseUrl + "/products/category/getCategoriesFull";
export const GET_CATEGORIES_PRODUCT_SELECT = baseUrl + "/products/category/getCategoriesFullSelect";
export const GET_TYPES_PRODUCT = baseUrl + "/products/types-product/getAll";
export const IMPORT_PRODUCTS = baseUrlImport + "/import/import-products-xlsx";


export const GET_WAREHOUSES_BYCOMPANY = baseUrl + "/warehouse/getbyCompany";
export const GET_WAREHOUSES_BYCOMPANY_SELECT = baseUrl + "/warehouse/getbyCompanySelect";
export const GET_PROVIDERS_BYCOMPANY = baseUrl + "/provider/getbyCompany";
export const GET_TAXES_BYCOMPANY = baseUrl + "/taxes/getbyCompany";
export const GET_UNIT_OF_MEASURE = baseUrl + "/units/getAll";
export const UPLOAD_IMAGES = baseUrl + "/products/upload";
export const DELETE_FILE = baseUrl + "/products/deleteFile";

export const GET_CLIENTS_BY_FIELDS = baseUrl + "/customers/getAllByFields";
export const GET_TYPE_OF_PIECES = baseUrl + "/type-of-piece";
export const GET_MAT_MATERIAL_PRICES = baseUrl + "/precios-tapete-material";
export const CALCULATE_FINAL_PRICE = baseUrl + "/precios-tapete-material/calcular-precio-final";
export const CREATE_PURCHASE_ORDER = baseUrl + "/purchase-order/create";