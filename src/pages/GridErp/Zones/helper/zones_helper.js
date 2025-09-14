import { getToken } from "../../../../helpers/jwt-token-access/get_token";
import { BASE_URL } from "../../../../helpers/url_helper";


export class ZonesHelper {
    async getZones() {
        try {
            let token = getToken();
            let response = await fetch(`${BASE_URL}/users/zones/getAll`, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`,
                },
            })

            if (!response.ok) {
                throw new Error("Error al obtener las zonas");
            }
            let data = await response.json();
            let zones = data?.data ?? [];

            if (zones && Array.isArray(zones) && zones.length > 0) {
                return zones;
            }
            return [];
        } catch (error) {
            throw new Error("Error al obtener las zonas: " + error.message);
        }

    }

    async getAccounts() {
        let token = getToken();
        fetch(`${BASE_URL}/accounting/account/getAll`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`,
            },
        })
            .then(async (response) => {
                if (!response.ok) {
                    throw new Error("Error al obtener las cuentas");
                }
                let data = await response.json();
                let accounts = data?.data ?? [];
                if (accounts && Array.isArray(accounts) && accounts.length > 0) {
                    return accounts;
                }
                return [];
            })
            .catch(err => {
                console.error("Error:", err)
            })
    }

    async addZone(zone) {
        let token = getToken();
        const response = await fetch(`${BASE_URL}/users/zones/add`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`,
            },
            body: JSON.stringify(zone),
        })

        if (!response.ok) {
            throw new Error("Error al agregar la sede")
        }
        return true;
    }

    async updateZone(zone) {
        let token = getToken();
        const response = await fetch(`${BASE_URL}/users/zones/update/${zone._id}`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`,
            },
            body: JSON.stringify({
                name: zone?.name,
                shortCode: zone?.shortCode
            }),
        })

        if (!response.ok) {
            throw new Error("Error al actualizar la sede")
        }
        return true;
    }

    async deleteZone(id) {
        let token = getToken();
        const response = await fetch(`${BASE_URL}/users/zones/delete/${id}`, {
            method: "DELETE",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`,
            },
        })

        if (!response.ok) {
            throw new Error("Error al eliminar la sede")
        }
        return true;
    }

    async bulkDeleteZones(ids) {
        let token = getToken();
        const response = await fetch(`${BASE_URL}/users/zones/bulkDelete`, {
            method: "DELETE",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`,
            },
            body: JSON.stringify({ ids }),
        })

        if (!response.ok) {
            throw new Error("Error al eliminar las sedes seleccionadas")
        }
        return true;
    }

    async getAccountsFromZone(id) {
        let token = getToken();
        fetch(`${BASE_URL}/users/zones/getAccountsFromZone/${id}`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`,
            },
        })
            .then(async (response) => {
                if (!response.ok) {
                    throw new Error("Error al obtener las cuentas");
                }
                let data = await response.json();
                let accounts = data?.data ?? [];
                if (accounts && Array.isArray(accounts) && accounts.length > 0) {
                    return accounts;
                }
                return [];
            })
            .catch(err => {
                console.error("Error:", err);
                return [];
            })
    }

    async addAccountToZone(zoneId, accountId) {
        let token = getToken();
        const response = await fetch(`${BASE_URL}/users/zones/addAccountToZone/${zoneId}`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`,
            },
            body: JSON.stringify({
                accountId: accountId,
            }),
        })

        if (!response.ok) {
            throw new Error("Error al agregar la cuenta a la sede")
        }
        return true;
    }

    async deleteAccountFromZone(zoneId, accountId) {
        let token = getToken();
        const response = await fetch(`${BASE_URL}/users/zones/deleteAccountFromZone/${zoneId}`, {
            method: "DELETE",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`,
            },
            body: JSON.stringify({
                accountId: accountId,
            }),
        })

        if (!response.ok) {
            throw new Error("Error al eliminar la cuenta de la sede")
        }
        return true;
    }

    async bulkDeleteAccountsFromZone(zoneId, accountIds) {
        let token = getToken();
        const response = await fetch(`${BASE_URL}/users/zones/bulkDeleteAccountsFromZone/${zoneId}`, {
            method: "DELETE",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`,
            },
            body: JSON.stringify({
                accountIds: accountIds,
            }),
        })

        if (!response.ok) {
            throw new Error("Error al eliminar las cuentas de la sede")
        }
        return true;
    }

    async getAccountsFromZone(zoneId) {
        let token = getToken();
        const response = await fetch(`${BASE_URL}/users/zones/getAccountsFromZone/${zoneId}`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`,
            },
        })

        if (!response.ok) {
            throw new Error("Error al obtener las cuentas de la sede")
        }
        return response.json();
    }

}