import { GET_CUSTOMERS, GET_TYPES_CUSTOMERS } from "./url_helper";


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


}