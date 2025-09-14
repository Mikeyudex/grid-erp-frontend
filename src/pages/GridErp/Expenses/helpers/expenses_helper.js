import { getToken } from "../../../../helpers/jwt-token-access/get_token";
import { BASE_URL } from "../../../../helpers/url_helper";



export class ExpensesHelper {
    constructor() {
        this.baseUrl = `${BASE_URL}/accounting/type-of-expense`;
        this.baseUrlExpenses = `${BASE_URL}/accounting/expense`;
        // Simulación de datos para proveedores
        this.providers = [
            { _id: "prov1", name: "Proveedor ABC", commercialName: "ABC Ltda", email: "abc@provider.com" },
            { _id: "prov2", name: "Distribuidora XYZ", commercialName: "XYZ S.A.S", email: "xyz@distributor.com" },
            { _id: "prov3", name: "Importadora 123", commercialName: "123 Import", email: "123@importer.com" },
            { _id: "prov4", name: "Servicios Generales", commercialName: "ServiGen", email: "info@servigen.com" },
        ]

        // Simulación de cuentas bancarias
        this.accounts = [
            {
                _id: "acc1",
                name: "Cuenta Corriente - Banco A",
                typeAccount: "Corriente",
                bankAccount: "Banco A",
                numberAccount: "123456789",
                isActive: true,
            },
            {
                _id: "acc2",
                name: "Cuenta de Ahorros - Banco B",
                typeAccount: "Ahorros",
                bankAccount: "Banco B",
                numberAccount: "987654321",
                isActive: true,
            },
            {
                _id: "acc3",
                name: "Cuenta Empresarial - Banco C",
                typeAccount: "Empresarial",
                bankAccount: "Banco C",
                numberAccount: "112233445",
                isActive: true,
            },
            {
                _id: "acc4",
                name: "Efectivo",
                typeAccount: "Efectivo",
                bankAccount: "N/A",
                numberAccount: "N/A",
                isActive: true,
            },
        ]

        // Simulación de zonas
        this.zones = [
            { _id: "zone1", name: "Zona Norte", description: "Zona norte de la ciudad" },
            { _id: "zone2", name: "Zona Sur", description: "Zona sur de la ciudad" },
            { _id: "zone3", name: "Zona Centro", description: "Zona centro de la ciudad" },
            { _id: "zone4", name: "Zona Oriente", description: "Zona oriente de la ciudad" },
            { _id: "zone5", name: "Nacional", description: "Cobertura nacional" },
        ]

        // Simulación de tipos de gastos
        this.typesOfExpense = [
            { _id: "type1", name: "Servicios Públicos", description: "Agua, luz, gas, internet" },
            { _id: "type2", name: "Materia Prima", description: "Compra de materiales y suministros" },
            { _id: "type3", name: "Transporte", description: "Gastos de transporte y logística" },
            { _id: "type4", name: "Mantenimiento", description: "Mantenimiento de equipos e instalaciones" },
            { _id: "type5", name: "Publicidad", description: "Gastos de marketing y publicidad" },
            { _id: "type6", name: "Administrativos", description: "Gastos administrativos generales" },
            { _id: "type7", name: "Nómina", description: "Pagos de nómina y prestaciones" },
            { _id: "type8", name: "Impuestos", description: "Pago de impuestos y tasas" },
        ]

        // Simulación de deudas pendientes por proveedor
        this.providerDebts = {
            prov1: [
                {
                    _id: "debt1_1",
                    description: "Factura #001 - Suministros de oficina",
                    amountPayable: 150000,
                    dueDate: new Date("2024-12-15"),
                },
                {
                    _id: "debt1_2",
                    description: "Factura #005 - Material de limpieza",
                    amountPayable: 85000,
                    dueDate: new Date("2024-12-20"),
                },
            ],
            prov2: [
                {
                    _id: "debt2_1",
                    description: "Factura #XYZ-100 - Materia prima",
                    amountPayable: 500000,
                    dueDate: new Date("2024-12-10"),
                },
            ],
            prov3: [
                {
                    _id: "debt3_1",
                    description: "Factura #IMP-200 - Equipos importados",
                    amountPayable: 1200000,
                    dueDate: new Date("2024-12-25"),
                },
            ],
            prov4: [], // Proveedor sin deudas
        }
    }

    async getTypeOfExpenses() {
        let token = getToken();
        return fetch(`${this.baseUrl}/getAll`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                "Authorization": `Bearer ${token}`,
            },
        })
            .then(response => response.json())
            .then(data => data)
            .catch(err => console.log(err));
    }

    async getTAllExpenses() {
        let token = getToken();
        return fetch(`${this.baseUrlExpenses}/getAll`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                "Authorization": `Bearer ${token}`,
            },
        })
            .then(response => response.json())
            .then(data => data)
            .catch(err => console.log(err));
    }

    async getTypeOfExpense(id) {
        let token = getToken();
        return fetch(`${this.baseUrl}/getById/${id}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                "Authorization": `Bearer ${token}`,
            },
        })
            .then(response => response.json())
            .then(data => data)
            .catch(err => console.log(err));
    }

    async createTypeOfExpense(typeOfExpense) {
        let token = getToken();
        return fetch(`${this.baseUrl}/create`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                "Authorization": `Bearer ${token}`,
            },
            body: JSON.stringify(typeOfExpense),
        })
            .then(response => response.json())
            .then(data => data)
            .catch(err => console.log(err));
    }

    async updateTypeExpense(typeOfExpense) {
        let token = getToken();
        return fetch(`${this.baseUrl}/update/${typeOfExpense._id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                "Authorization": `Bearer ${token}`,
            },
            body: JSON.stringify(typeOfExpense),
        })
            .then(response => response.json())
            .then(data => data)
            .catch(err => console.log(err));
    }

    async updateExpense(expense) {
        let token = getToken();
        return fetch(`${this.baseUrlExpenses}/update/${expense._id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                "Authorization": `Bearer ${token}`,
            },
            body: JSON.stringify(expense),
        })
            .then(response => response.json())
            .then(data => data)
            .catch(err => console.log(err));
    }

    async deleteTypeExpense(id) {
        let token = getToken();
        return fetch(`${this.baseUrl}/delete/${id}`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
                "Authorization": `Bearer ${token}`,
            },
        })
            .then(response => response.json())
            .then(data => data)
            .catch(err => console.log(err));
    }

    async deleteExpense(id) {
        let token = getToken();
        return fetch(`${this.baseUrlExpenses}/delete/${id}`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
                "Authorization": `Bearer ${token}`,
            },
        })
            .then(response => response.json())
            .then(data => data)
            .catch(err => console.log(err));
    }

    async bulkDeleteTypeExpenses(ids) {
        let token = getToken();
        return fetch(`${this.baseUrl}/bulkDelete`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
                "Authorization": `Bearer ${token}`,
            },
            body: JSON.stringify({ ids }),
        })
            .then(response => response.json())
            .then(data => data)
            .catch(err => console.log(err));
    }

    async bulkDeleteExpenses(ids) {
        let token = getToken();
        return fetch(`${this.baseUrlExpenses}/bulkDelete`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
                "Authorization": `Bearer ${token}`,
            },
            body: JSON.stringify({ ids }),
        })
            .then(response => response.json())
            .then(data => data)
            .catch(err => console.log(err));
    }

    // Obtener cuentas bancarias
    async getAccounts() {
        return new Promise((resolve) => {
            setTimeout(() => {
                resolve(this.accounts)
            }, 500)
        })
    }

    // Obtener zonas
    async getZones() {
        return new Promise((resolve) => {
            setTimeout(() => {
                resolve(this.zones)
            }, 500)
        })
    }

    // Obtener deudas pendientes de un proveedor
    async getProviderDebts(providerId) {
        return new Promise((resolve) => {
            setTimeout(() => {
                const debts = this.providerDebts[providerId] || []
                resolve({
                    success: true,
                    data: debts,
                })
            }, 500)
        })
    }

    // Registrar egreso
    async registerExpense(expenseData) {
        console.log("Simulando registro de egreso:", expenseData)
        return new Promise((resolve) => {
            setTimeout(() => {
                // Validaciones básicas
                if (!expenseData.providerId) {
                    resolve({ success: false, message: "El proveedor es obligatorio." })
                    return
                }
                if (!expenseData.accountId) {
                    resolve({ success: false, message: "La cuenta es obligatoria." })
                    return
                }
                if (!expenseData.zoneId) {
                    resolve({ success: false, message: "La zona es obligatoria." })
                    return
                }
                if (!expenseData.typeOfExpenseId) {
                    resolve({ success: false, message: "El tipo de gasto es obligatorio." })
                    return
                }
                if (!expenseData.value || expenseData.value <= 0) {
                    resolve({ success: false, message: "El valor debe ser mayor a cero." })
                    return
                }

                // Simular éxito
                resolve({
                    success: true,
                    message: "Egreso registrado exitosamente.",
                    data: {
                        _id: "expense_" + Date.now(),
                        sequence: Math.floor(Math.random() * 1000) + 1,
                        ...expenseData,
                        createdAt: new Date(),
                    },
                })
            }, 1000)
        })
    }

    // Subir archivo de soporte
    async uploadFile(file) {
        console.log("Simulando subida de archivo:", file.name)
        return new Promise((resolve, reject) => {
            setTimeout(() => {
                if (file.size > 5 * 1024 * 1024) {
                    reject(new Error("El archivo no debe superar los 5MB"))
                    return
                }

                const mockUrl = `https://example.com/uploads/expenses/${Date.now()}_${file.name}`
                resolve({
                    success: true,
                    url: mockUrl,
                    message: "Archivo subido exitosamente",
                })
            }, 1500)
        })
    }
}