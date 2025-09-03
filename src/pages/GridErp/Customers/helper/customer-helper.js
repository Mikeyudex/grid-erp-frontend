import { getToken } from "../../../../helpers/jwt-token-access/get_token";
import { GET_CUSTOMER_BY_ID, GET_CUSTOMERS, GET_CUSTOMERS_TYPES, GET_CUSTOMERS_TYPES_DOCUMENTS, GET_POSTAL_CODE_FROM_CITY, GET_PROVIDERS, GET_TYPES_CUSTOMERS } from "./url_helper";


export class CustomerHelper {

    // Obtener los clientes
    getCustomers = async (page, limit) => {
        try {
            let response = await fetch(`${GET_CUSTOMERS}?page=${page}&limit=${limit}`,
                {
                    method: "GET",
                    headers: {
                        "Content-Type": "application/json",
                    },
                }
            );

            if (response && response.status === 200) {
                let data = await response.json();
                return data?.data ?? [];
            } else {
                return [];
            }
        } catch (error) {
            console.log(error);
            return [];
        }
    };

    // Obtener los proveedores
    getProviders = async () => {
        try {
            let response = await fetch(`${GET_PROVIDERS}`,
                {
                    method: "GET",
                    headers: {
                        "Content-Type": "application/json",
                    },
                }
            );

            if (response && response.status === 200) {
                let data = await response.json();
                return data?.data ?? [];
            } else {
                return [];
            }
        } catch (error) {
            console.log(error);
            return [];
        }
    };

    getCustomerById = async (id) => {
        try {
            let token = getToken();
            let response = await fetch(`${GET_CUSTOMER_BY_ID}/${id}`, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
            });
            if (response && response.status === 200) {
                let data = await response.json();
                return data?.data;
            } else {
                return [];
            }
        } catch (error) {
            console.log(error);
            return [];
        }
    };

    getTypesCustomer = async () => {
        try {
            let response = await fetch(`${GET_TYPES_CUSTOMERS}`, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                },
            });
            if (response && response.status === 200) {
                let data = await response.json();
                return data?.data ?? [];
            } else {
                return [];
            }
        } catch (error) {
            console.log(error);
            return [];
        }
    };

    getTypeOfClients = async () => {
        try {
            let token = getToken();
            let response = await fetch(`${GET_CUSTOMERS_TYPES}`, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
            });
            if (response && response.status === 200) {
                let data = await response.json();
                return data?.data ?? [];
            } else {
                return [];
            }
        } catch (error) {
            console.log(error);
            return [];
        }
    };

    getTypeOfDocuments = async () => {
        try {
            let token = getToken();
            let response = await fetch(`${GET_CUSTOMERS_TYPES_DOCUMENTS}`, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
            });
            if (response && response.status === 200) {
                let data = await response.json();
                return data?.data ?? [];
            } else {
                return [];
            }
        } catch (error) {
            console.log(error);
            return [];
        }
    };

    getPostalCodeFromCity = async (city) => {
        try {
            let response = await fetch(`${GET_POSTAL_CODE_FROM_CITY}?placename=${city}&country=CO&username=yudexlabs`);
            if (response && response.status === 200) {
                let data = await response.json();
                let postalCodes = data?.postalCodes;
                if (postalCodes && Array.isArray(postalCodes) && postalCodes.length > 0) {
                    return postalCodes[0]?.postalCode;
                }
                return null;
            } else {
                return [];
            }
        } catch (error) {
            console.log(error);
            return null;
        }
    };
}

//Type of customer
export const typeOfCustomerOptions = [
    {
        label: "Persona natural",
        value: "PN",
    },
    {
        label: "Persona jurídica",
        value: "PJ",
    }
]

export const typeOfDocumentOptions = [
    {
        label: "Cédula de ciudadanía",
        value: "CC",
    },
    {
        label: "NIT",
        value: "NIT",
    },
    {
        label: "Pasaporte",
        value: "P",
    },
    {
        label: "Tarjeta de identidad",
        value: "TI",
    },
    {
        label: "Cédula de extranjería",
        value: "CE",
    },
    {
        label: "Otro",
        value: "O",
    }
]