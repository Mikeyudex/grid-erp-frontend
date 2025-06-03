import { BASE_URL } from "../../../../helpers/url_helper";

const baseUrl = BASE_URL

//customers
export const GET_CUSTOMERS = baseUrl + "/customers/getAll";
export const ADD_CUSTOMER = baseUrl + "/customers/create";
export const GET_TYPES_CUSTOMERS = baseUrl + "/customers/getTypes";
export const ADD_CUSTOMER_TYPE = baseUrl + "/customers/createTypeCustomer";
export const GET_CUSTOMER_BY_ID = baseUrl + "/customers/getById";
export const UPDATE_CUSTOMER = baseUrl + "/customers/updateCustomer";

//customers types
export const GET_CUSTOMERS_TYPES = baseUrl + "/typeOfCustomer/getAll";
export const ADD_CUSTOMER_TYPES = baseUrl + "/typeOfCustomer/create";
export const GET_CUSTOMERS_TYPES_BY_ID = baseUrl + "/typeOfCustomer/getById";
export const UPDATE_CUSTOMERS_TYPES = baseUrl + "/typeOfCustomer/update";
export const DELETE_CUSTOMERS_TYPES = baseUrl + "/typeOfCustomer/delete";
export const BULK_DELETE_CUSTOMERS_TYPES = baseUrl + "/typeOfCustomer/bulkDelete";

//customers type documents
export const GET_CUSTOMERS_TYPES_DOCUMENTS = baseUrl + "/typeOfDocument/getAll";
export const ADD_CUSTOMER_TYPES_DOCUMENTS = baseUrl + "/typeOfDocument/create";
export const GET_CUSTOMERS_TYPES_DOCUMENTS_BY_ID = baseUrl + "/typeOfDocument/getById";
export const UPDATE_CUSTOMERS_TYPES_DOCUMENTS = baseUrl + "/typeOfDocument/update";
export const DELETE_CUSTOMERS_TYPES_DOCUMENTS = baseUrl + "/typeOfDocument/delete";
export const BULK_DELETE_CUSTOMERS_TYPES_DOCUMENTS = baseUrl + "/typeOfDocument/bulkDelete";

export const GET_POSTAL_CODE_FROM_CITY = "http://api.geonames.org/postalCodeSearchJSON";