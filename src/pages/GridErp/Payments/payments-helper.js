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
      let response = await debtHelper.getDebtsByCustomerAndStatus(1, 10, '', clientId, 'abierto');
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

  async getProviders() {
    try {
      let response = await customerHelper.getProviders();
      return response;
    } catch (error) {
      throw new Error('Error al obtener clientes: ' + error.message);
    }
  }


  // Nueva función para simular la obtención de todos los ingresos
  async getAllIncome(params = {page: 1, limit: 100}) {

    let token = getToken();
    let response = await fetch(`${this.baseUrl}/getAll?page=${params.page}&limit=${params.limit}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        "Authorization": `Bearer ${token}`,
      },
    })
    if (response.status !== 200) {
      throw new Error('Error al obtener pagos: ' + response.statusText);
    }
    let data = await response.json();
    return data;
  }

  async getIncome(id) {
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
