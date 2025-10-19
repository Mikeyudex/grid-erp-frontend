import { BASE_URL } from "../../../../helpers/url_helper";

const baseUrl = BASE_URL

// Obtener los ajustes de stock mas recientes
export const GET_RECENT_ADJUSTMENT = baseUrl + "/stock-adjustments/recent";
export const CREATE_STOCK_ADJUSTMENT = baseUrl + "/stock-adjustments/create";

export const GET_PRODUCTS_BY_WAREHOUSE = baseUrl + "/products/getAllByWarehouse";

export const GET_ALL_TRANSFER_STOCK = baseUrl + "/movements/getAll";
export const CREATE_TRANSFER_STOCK = baseUrl + "/movements/create-transfer";

export const companyId = "66becedd790bddbc9b1e2cbc";

