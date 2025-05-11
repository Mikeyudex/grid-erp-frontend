import { BASE_URL } from "../../../../helpers/url_helper";

const baseUrl = BASE_URL

//customers
export const GET_CUSTOMERS = baseUrl + "/customers/getAll";
export const ADD_CUSTOMER = baseUrl + "/customers/create";
export const GET_TYPES_CUSTOMERS = baseUrl + "/customers/getTypes";
export const ADD_CUSTOMER_TYPE = baseUrl + "/customers/createTypeCustomer";