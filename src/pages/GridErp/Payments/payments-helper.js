export class PaymentHelper {
  constructor() {
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
    // Simula una llamada a la API para obtener cuentas bancarias
    return new Promise(resolve => {
      setTimeout(() => {
        resolve(this.accounts);
      }, 500);
    });
  }

  async getOutstandingDebts(clientId) {
    // Simula una llamada a la API para obtener deudas pendientes de un cliente
    return new Promise(resolve => {
      setTimeout(() => {
        resolve(this.outstandingDebts[clientId] || []);
      }, 500);
    });
  }

  async registerIncome(incomeData) {
    // Simula el registro de un ingreso en el backend
    console.log('Simulando registro de ingreso:', incomeData);
    return new Promise(resolve => {
      setTimeout(() => {
        if (incomeData.value > 0) {
          resolve({ success: true, message: 'Pago registrado exitosamente.' });
        } else {
          resolve({ success: false, message: 'El valor del pago debe ser mayor a cero.' });
        }
      }, 1000);
    });
  }
}
