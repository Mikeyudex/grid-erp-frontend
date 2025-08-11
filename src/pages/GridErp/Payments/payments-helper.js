import { getToken } from "../../../helpers/jwt-token-access/get_token";
import { BASE_URL } from "../../../helpers/url_helper";
import { AccountHelper } from "../Accounts/helpers/account_helper";
import { CustomerHelper } from "../Customers/helper/customer-helper";
import { DebtHelper } from "../Debts/helper/debt_helper";

const customerHelper = new CustomerHelper();
const accountHelper = new AccountHelper();
const debtHelper = new DebtHelper();

export class PaymentHelper {
  constructor() {
    this.baseUrl = `${BASE_URL}/accounting/income`;
    // Simulación de datos de cuentas bancarias
    this.accounts = [
      { _id: 'acc1', name: 'Cuenta Corriente - Banco A', typeAccount: 'Corriente', bankAccount: 'Banco A', numberAccount: '123456789', isActive: true },
      { _id: 'acc2', name: 'Cuenta de Ahorros - Banco B', typeAccount: 'Ahorros', bankAccount: 'Banco B', numberAccount: '987654321', isActive: true },
      { _id: 'acc3', name: 'Cuenta Empresarial - Banco C', typeAccount: 'Empresarial', bankAccount: 'Banco C', numberAccount: '112233445', isActive: true },
    ];

    // Simulación de deudas pendientes por cliente
    this.outstandingDebts = {
      'client1': [
        { _id: 'debt1_1', description: 'Pedido #2023001 - Saldo pendiente', amountDue: 500.00, purchaseOrderId: 'order1' },
        { _id: 'debt1_2', description: 'Pedido #2023005 - Saldo pendiente', amountDue: 250.50, purchaseOrderId: 'order5' },
      ],
      'client2': [
        { _id: 'debt2_1', description: 'Pedido #2023010 - Saldo pendiente', amountDue: 1200.75, purchaseOrderId: 'order10' },
      ],
      'client3': [], // Cliente sin deudas
    };
  }

  async getAccounts() {
    try {
      let response = await accountHelper.getAccounts();
      return response?.data ?? null;
    } catch (error) {
      throw new Error('Error al obtener cuentas: ' + error.message);
    }
  }

  async getOutstandingDebts(clientId) {
    try {
      let response = await debtHelper.getDebts(1, 10, clientId);
      return response;
    } catch (error) {
      throw new Error('Error al obtener deudas: ' + error.message);
    }
  }

  async registerIncome(incomeData) {
    try {
      let response = await fetch(`${this.baseUrl}/create`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          "Authorization": `Bearer ${getToken()}`,
        },
        body: JSON.stringify(incomeData),
      });
      if (response.status !== 201) {
        throw new Error('Error al registrar pago: ' + response.statusText);
      }
      let data = await response.json();
      return {
        success: true,
        message: data?.message ?? 'Pago registrado exitosamente.',
        data: data?.data,
      }
    } catch (error) {
      throw new Error('Error al registrar pago: ' + error.message);
    }
  }

  async getClients(page = 1, limit = 10) {
    try {
      let response = await customerHelper.getCustomers(page, limit);
      return response;
    } catch (error) {
      throw new Error('Error al obtener clientes: ' + error.message);
    }
  }


  // Nueva función para simular la obtención de todos los ingresos
  async getAllIncome(params = {}) {
    const { page = 1, limit = 10, search = "", sortBy = "createdAt", sortOrder = "desc" } = params

    const allIncomes = [
      {
        _id: "inc1",
        purchaseOrderId: "order1",
        displayPurchaseOrderId: "Pedido #2023001",
        sequence: 1,
        typeOperation: "recibos",
        paymentDate: new Date("2024-07-15T10:00:00Z"),
        accountId: "acc1",
        displayAccountId: "Cuenta Corriente - Banco A",
        value: 150.0,
        observations: "Abono a pedido #2023001",
        paymentSupport: "/uploads/receipt1.jpg",
        createdAt: new Date("2024-07-15T09:00:00Z"),
      },
      {
        _id: "inc2",
        purchaseOrderId: null,
        displayPurchaseOrderId: "N/A",
        sequence: 2,
        typeOperation: "anticipo",
        paymentDate: new Date("2024-07-14T15:30:00Z"),
        accountId: "acc4",
        displayAccountId: "Efectivo",
        value: 50.0,
        observations: "Anticipo para futuro pedido",
        paymentSupport: "",
        createdAt: new Date("2024-07-14T14:00:00Z"),
      },
      {
        _id: "inc3",
        purchaseOrderId: "order5",
        displayPurchaseOrderId: "Pedido #2023005",
        sequence: 3,
        typeOperation: "recibos",
        paymentDate: new Date("2024-07-13T11:00:00Z"),
        accountId: "acc2",
        displayAccountId: "Cuenta de Ahorros - Banco B",
        value: 250.5,
        observations: "Pago final pedido #2023005",
        paymentSupport: "/uploads/receipt2.png",
        createdAt: new Date("2024-07-13T10:00:00Z"),
      },
      {
        _id: "inc4",
        purchaseOrderId: null,
        displayPurchaseOrderId: "N/A",
        sequence: 4,
        typeOperation: "anticipo",
        paymentDate: new Date("2024-07-12T09:00:00Z"),
        accountId: "acc3",
        displayAccountId: "Cuenta Empresarial - Banco C",
        value: 100.0,
        observations: "Anticipo cliente nuevo",
        paymentSupport: "",
        createdAt: new Date("2024-07-12T08:00:00Z"),
      },
      {
        _id: "inc5",
        purchaseOrderId: "order10",
        displayPurchaseOrderId: "Pedido #2023010",
        sequence: 5,
        typeOperation: "recibos",
        paymentDate: new Date("2024-07-11T16:00:00Z"),
        accountId: "acc1",
        displayAccountId: "Cuenta Corriente - Banco A",
        value: 1200.75,
        observations: "Pago total pedido #2023010",
        paymentSupport: "/uploads/receipt3.jpeg",
        createdAt: new Date("2024-07-11T15:00:00Z"),
      },
      {
        _id: "inc6",
        purchaseOrderId: "order1",
        displayPurchaseOrderId: "Pedido #2023001",
        sequence: 6,
        typeOperation: "recibos",
        paymentDate: new Date("2024-07-10T10:00:00Z"),
        accountId: "acc1",
        displayAccountId: "Cuenta Corriente - Banco A",
        value: 350.0,
        observations: "Primer abono pedido #2023001",
        paymentSupport: "/uploads/receipt4.pdf", // Example of non-image support
        createdAt: new Date("2024-07-10T09:00:00Z"),
      },
    ]

    // Simular filtrado por búsqueda (DataTable lo hace client-side, pero aquí para consistencia con el backend)
    const filteredData = allIncomes.filter((income) =>
      Object.values(income).some((value) => String(value).toLowerCase().includes(search.toLowerCase())),
    )

    // Simular ordenamiento (DataTable lo hace client-side, pero aquí para consistencia con el backend)
    filteredData.sort((a, b) => {
      const aValue = a[sortBy]
      const bValue = b[sortBy]

      if (aValue === null || aValue === undefined) return sortOrder === "asc" ? 1 : -1
      if (bValue === null || bValue === undefined) return sortOrder === "asc" ? -1 : 1

      let comparison = 0
      if (typeof aValue === "string" && typeof bValue === "string") {
        comparison = aValue.localeCompare(bValue)
      } else if (aValue instanceof Date && bValue instanceof Date) {
        comparison = aValue.getTime() - bValue.getTime()
      } else {
        comparison = aValue - bValue
      }

      return sortOrder === "asc" ? comparison : -comparison
    })

    // Simular paginación (DataTable lo hace client-side, pero aquí para consistencia con el backend)
    const startIndex = (page - 1) * limit
    const endIndex = startIndex + limit
    const paginatedData = filteredData.slice(startIndex, endIndex)

    return {
      data: allIncomes, // DataTable espera todos los datos para paginar y filtrar client-side
      total: allIncomes.length,
      page,
      limit,
    }
  }



  async updateIncome(income) {
    let token = getToken();
    return fetch(`${this.baseUrl}/${income._id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        "Authorization": `Bearer ${token}`,
      },
      body: JSON.stringify(income),
    })
      .then(response => response.json())
      .then(data => data)
      .catch(err => console.log(err));
  }

  async deleteIncome(id) {
    let token = getToken();
    return fetch(`${this.baseUrl}/${id}`, {
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

  async bulkDeleteIncomes(ids) {
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
}
