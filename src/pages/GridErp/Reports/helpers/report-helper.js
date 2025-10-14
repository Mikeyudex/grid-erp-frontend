// Helpers para el módulo de reportes

import { getToken } from "../../../../helpers/jwt-token-access/get_token";
import { BASE_URL } from "../../../../helpers/url_helper";
import { AccountHelper } from "../../Accounts/helpers/account_helper";
import { CustomerHelper } from "../../Customers/helper/customer-helper";
import { PurchaseHelper } from "../../PurchaseOrder/helper/purchase_helper";
import { ZonesHelper } from "../../Zones/helper/zones_helper";

const zonesHelper = new ZonesHelper();
const purchaseHelper = new PurchaseHelper();
const customerHelper = new CustomerHelper();
const accountHelper = new AccountHelper();


export class ReportsHelper {
  constructor() {
    this.baseUrl = `${BASE_URL}/reports`;
  }

  // Obtener sedes para el filtro
  async getOffices() {
    try {
      return await zonesHelper.getZones();
    } catch (error) {
      console.error("Error al obtener sedes:", error)
      throw error
    }
  }

  // Obtener asesores para el filtro
  async getAdvisors() {
    try {
      let response = await purchaseHelper.getSalesAdvisors();
      let advisors = response.data;
      if (advisors && Array.isArray(advisors) && advisors.length > 0) {
        return advisors;
      }
      return [];
    } catch (error) {
      console.error("Error al obtener asesores:", error)
      throw error
    }
  }

  // Obtener clientes para el filtro
  async getClients() {
    try {
      let response = await customerHelper.getCustomers(1, 100);
      return response;
    } catch (error) {
      console.error("Error al obtener clientes:", error)
      throw error
    }
  }

  // Obtener clientes con información completa para rótulos
  async getClientsForLabels() {
    try {
      let clients = await customerHelper.getCustomers(1, 100);
      let mappedClients = clients.map((client) => ({
        _id: client._id,
        name: `${client.name} ${client.lastname}`,
        commercialName: client.commercialName,
        documentNumber: client.documento ? client.documento : "",
        address: client?.shippingAddress,
        city: client.shippingCity,
        state: client.shippingCity,
        postalCode: client.shippingPostalCode,
        phone: client.phone,
        email: client.email,
        contactPerson: this.customizeContactPerson(client?.contacts),
      }));
      return mappedClients;
    } catch (error) {
      console.error("Error al obtener clientes:", error)
      throw error
    }
  }

  customizeContactPerson(contacts) {
    if (contacts && Array.isArray(contacts) && contacts.length > 0) {
      return `${contacts[0].contactName} ${contacts[0].contactLastname}`
    }
  }

  // Obtener productos para el filtro
  async getProducts() {
    try {
      // Simulación - reemplazar con llamada real a la API
      return [
        { _id: "1", name: "Tapete Premium 120x180", sku: "TP-001" },
        { _id: "2", name: "Tapete Clásico 100x150", sku: "TC-002" },
        { _id: "3", name: "Tapete Moderno 80x120", sku: "TM-003" },
        { _id: "4", name: "Tapete Ejecutivo 200x300", sku: "TE-004" },
        { _id: "5", name: "Tapete Decorativo 60x90", sku: "TD-005" },
      ]
    } catch (error) {
      console.error("Error al obtener productos:", error)
      throw error
    }
  }

  // Obtener tipos de tapete para el filtro
  async getCarpetTypes() {
    try {
      // Simulación - reemplazar con llamada real a la API
      return [
        { _id: "1", name: "Premium" },
        { _id: "2", name: "Clásico" },
        { _id: "3", name: "Moderno" },
        { _id: "4", name: "Ejecutivo" },
        { _id: "5", name: "Decorativo" },
      ]
    } catch (error) {
      console.error("Error al obtener tipos de tapete:", error)
      throw error
    }
  }

  // Obtener materiales para el filtro
  async getMaterials() {
    try {
      // Simulación - reemplazar con llamada real a la API
      return [
        { _id: "1", name: "Nylon" },
        { _id: "2", name: "Polipropileno" },
        { _id: "3", name: "Lana" },
        { _id: "4", name: "Algodón" },
        { _id: "5", name: "Fibra Sintética" },
      ]
    } catch (error) {
      console.error("Error al obtener materiales:", error)
      throw error
    }
  }

  // Obtener cuentas bancarias para filtros
  async getBankAccounts() {
    try {
      let response = await accountHelper.getAccounts();
      return response.data;
    } catch (error) {
      console.log("Error al obtener cuentas bancarias:", error);
      throw error
    }
  }

  // Obtener datos del reporte de ventas acumuladas
  async getAccumulatedSalesReport(filters) {
    try {
      const { officeId, advisorId, startDate, endDate } = filters
      const token = getToken();
      const response = await fetch(`${this.baseUrl}/cumulative-sales-report?zoneId=${officeId}&advisorId=${advisorId}&startDate=${startDate}&endDate=${endDate}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          "Authorization": `Bearer ${token}`,
        },
      });
      let data = await response.json();
      if (data && Array.isArray(data) && data.length > 0) {
        let dataMapped = data.map((item) => {
          return {
            office: item.sede,
            advisor: item.asesor,
            ordersCount: item.pedidos,
            carpetsCount: item.tapetes,
            baseValue: item.valorBase,
            discount: item.descuento,
            subtotal: item.subtotal,
            iva: item.iva,
            retention: item.retencion,
            totalValue: item.valorTotal,
          }
        })
        return {
          success: true,
          data: dataMapped,
        }
      }
      return {
        success: true,
        data: [],
      }

    } catch (error) {
      console.error("Error al obtener reporte de ventas acumuladas:", error)
      throw error
    }
  }

  // Obtener datos del reporte de ventas detalladas
  async getDetailedSalesReport(filters) {
    try {
      const { officeId, advisorId, clientId, startDate, endDate } = filters
      const token = getToken();
      const response = await fetch(`${this.baseUrl}/detailed-sales-report?zoneId=${officeId}&advisorId=${advisorId}&clientId=${clientId}&startDate=${startDate}&endDate=${endDate}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          "Authorization": `Bearer ${token}`,
        },

      });
      let data = await response.json();

      if (data && Array.isArray(data) && data.length > 0) {
        let dataMapped = data.map((item) => {
          return {
            date: item.fecha,
            office: item.sede,
            advisor: item.asesor,
            client: item.cliente,
            commercialName: item.nombreComercial,
            invoiceNumber: item.numeroFactura,
            carpetsCount: item.tapetes,
            baseValue: item.valorBase,
            discount: item.descuento,
            subtotal: item.subtotal,
            iva: item.iva,
            retention: item.retencion,
            totalValue: item.valorTotal,
          }
        })
        return {
          success: true,
          data: dataMapped,
        }
      }
      return {
        success: true,
        data: [],
      }
    } catch (error) {
      console.error("Error al obtener reporte de ventas detalladas:", error)
      throw error
    }
  }

  // Obtener datos del reporte de ventas por producto
  async getProductSalesReport(filters) {
    try {
      const { officeId, advisorId, clientId, productId, carpetTypeId, materialId, startDate, endDate } = filters;
      const token = getToken();
      const response = await fetch(`${this.baseUrl}/product-sales-report?zoneId=${officeId}&advisorId=${advisorId}&clientId=${clientId}&productId=${productId}&carpetTypeId=${carpetTypeId}&materialId=${materialId}&startDate=${startDate}&endDate=${endDate}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          "Authorization": `Bearer ${token}`
        },
      });
      let data = await response.json();
      if (data && Array.isArray(data) && data.length > 0) {
        let dataMapped = data.map((item) => {
          return {
            office: item.sede,
            advisor: item.asesor,
            client: item.cliente,
            product: item.producto,
            carpetType: item.tipoTapete,
            material: item.material,
            quantity: item.cantidad,
            baseValue: item.valorBase,
            discount: item.descuento,
            subtotal: item.subtotal,
            iva: item.iva,
            retention: item.retencion,
            totalValue: item.valorTotal,
          }
        })
        return {
          success: true,
          data: dataMapped,
        }
      }
      return {
        success: true,
        data: [],
      }
    } catch (error) {
      console.error("Error al obtener reporte de ventas por producto:", error)
      throw error
    }
  }

  // Obtener datos del reporte de cuentas por cobrar
  async getAccountsReceivableReport(filters) {
    try {
      const { clientId, officeId, advisorId } = filters
      const token = getToken();
      const response = await fetch(`${this.baseUrl}/accounts-receivable-report?clientId=${clientId}&zoneId=${officeId}&advisorId=${advisorId}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          "Authorization": `Bearer ${token}`
        }
      });
      let data = await response.json();
      if (data && Array.isArray(data) && data.length > 0) {
        let dataMapped = data.map((item) => {
          return {
            client: item.cliente,
            commercialName: item.nombreComercial,
            city: item.ciudad,
            advisor: item.asesor,
            office: item.sede,
            ordersCount: item.cantidadFacturas,
            overdueDays: item.diasMora,
            totalValue: item.totalDeuda,
            colorMora: item.colorMora,
          }
        })
        return {
          success: true,
          data: dataMapped,
        }
      }
      return {
        success: true,
        data: [],
      }
    } catch (error) {
      console.error("Error al obtener reporte de cuentas por cobrar:", error)
      throw error
    }
  }

  // Obtener información predeterminada del remitente
  async getDefaultSender() {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({
          name: "QUALITY S.A.S.",
          documentNumber: "900123456-7",
          address: "Carrera 10 # 26-51, Zona Industrial",
          city: "Bucaramanga",
          state: "Santander",
          postalCode: "110111",
          phone: "+57 300 000 0000",
          email: "ventas@quality.com.co",
        })
      }, 300)
    })
  }

  // Reporte de cuentas por cobrar detallado por pedidos
  async getDetailedAccountsReceivableReport(filters) {
    try {
      const { clientId, officeId, advisorId } = filters
      const token = getToken();
      const response = await fetch(`${this.baseUrl}/accounts-receivable-report?clientId=${clientId}&zoneId=${officeId}&advisorId=${advisorId}&mode=detallado`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          "Authorization": `Bearer ${token}`
        }
      });
      let data = await response.json();
      if (data && Array.isArray(data) && data.length > 0) {
        let dataMapped = data.map((item) => {
          return {
            client: item.cliente,
            commercialName: item.nombreComercial,
            city: item.ciudad,
            advisor: item.asesor,
            office: item.sede ?? "Sin Sede",
            invoiceNumber: item.nroFactura,
            dueDate: item.vence,
            overdueDays: item.diasMora,
            totalValue: item.valorTotal,
            colorMora: item.colorMora,
          }
        })
        return {
          success: true,
          data: dataMapped,
        }
      }
      return {
        success: true,
        data: [],
      }
    } catch (error) {
      console.log("Error al obtener reporte de cuentas por cobrar detallado:", error);
      throw error
    }
  }

  // Reporte de saldos de cuentas bancarias
  async getBankAccountsBalanceReport() {
    try {
      const token = getToken();
      const response = await fetch(`${this.baseUrl}/bank-accounts-balance-report`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          "Authorization": `Bearer ${token}`
        }
      });
      let data = await response.json();
      let dataMapped = data?.cuentas.map((item) => {
        return {
          accountNumber: item.numberAccount,
          bankName: item.bankAccount,
          accountType: item.typeAccount,
          accountName: item.cuenta,
          balance: item.saldo,
        }
      })
      return {
        success: true,
        data: dataMapped,
      }
    } catch (error) {
      console.log("Error al obtener reporte de saldos bancarios:", error);
      throw error
    }
  }

  // Calcular totales consolidados
  calculateTotals(data) {
    return data.reduce(
      (totals, item) => ({
        ordersCount: totals.ordersCount + item.ordersCount,
        carpetsCount: totals.carpetsCount + item.carpetsCount,
        baseValue: totals.baseValue + item.baseValue,
        discount: totals.discount + item.discount,
        subtotal: totals.subtotal + item.subtotal,
        iva: totals.iva + item.iva,
        retention: totals.retention + item.retention,
        totalValue: totals.totalValue + item.totalValue,
      }),
      {
        ordersCount: 0,
        carpetsCount: 0,
        baseValue: 0,
        discount: 0,
        subtotal: 0,
        iva: 0,
        retention: 0,
        totalValue: 0,
      },
    )
  }

  // Calcular totales para ventas detalladas
  calculateDetailedTotals(data) {
    return data.reduce(
      (totals, item) => ({
        carpetsCount: totals.carpetsCount + item.carpetsCount,
        baseValue: totals.baseValue + item.baseValue,
        discount: totals.discount + item.discount,
        subtotal: totals.subtotal + item.subtotal,
        iva: totals.iva + item.iva,
        retention: totals.retention + item.retention,
        totalValue: totals.totalValue + item.totalValue,
      }),
      {
        carpetsCount: 0,
        baseValue: 0,
        discount: 0,
        subtotal: 0,
        iva: 0,
        retention: 0,
        totalValue: 0,
      },
    )
  }

  // Calcular totales para ventas por producto
  calculateProductTotals(data) {
    return data.reduce(
      (totals, item) => ({
        quantity: totals.quantity + item.quantity,
        baseValue: totals.baseValue + item.baseValue,
        discount: totals.discount + item.discount,
        subtotal: totals.subtotal + item.subtotal,
        iva: totals.iva + item.iva,
        retention: totals.retention + item.retention,
        totalValue: totals.totalValue + item.totalValue,
      }),
      {
        quantity: 0,
        baseValue: 0,
        discount: 0,
        subtotal: 0,
        iva: 0,
        retention: 0,
        totalValue: 0,
      },
    )
  }

  // Calcular totales para cuentas por cobrar
  calculateAccountsReceivableTotals(data) {
    return data.reduce(
      (totals, item) => ({
        ordersCount: totals.ordersCount + item.ordersCount,
        totalValue: totals.totalValue + item.totalValue,
      }),
      {
        ordersCount: 0,
        totalValue: 0,
      },
    )
  }

  // Calcular totales para cuentas por cobrar detallado
  calculateDetailedAccountsReceivableTotals(data) {
    return data.reduce(
      (totals, row) => ({
        invoicesCount: totals.invoicesCount + 1,
        totalValue: totals.totalValue + row.totalValue,
      }),
      {
        invoicesCount: 0,
        totalValue: 0,
      },
    )
  }

  // Calcular totales para saldos bancarios
  calculateBankAccountsTotals(data) {
    return data.reduce(
      (totals, row) => ({
        accountsCount: totals.accountsCount + 1,
        totalBalance: totals.totalBalance + row.balance,
      }),
      {
        accountsCount: 0,
        totalBalance: 0,
      },
    )
  }

  // Reporte de movimientos bancarios detallado
  async getBankMovementsReport(filters) {
    try {
      const { accountId, startDate, endDate } = filters
      const token = getToken();
      const response = await fetch(`${this.baseUrl}/get-account-movements-report?accountId=${accountId}&startDate=${startDate}&endDate=${endDate}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          "Authorization": `Bearer ${token}`
        }
      });
      let data = await response.json();
      if (data && Array.isArray(data) && data.length > 0) {
        let dataMapped = data.map((item) => {
          return {
            accountNumber: item.accountNumber,
            accountName: item.cuenta,
            thirdPartyName: item.nombreTercero,
            voucherNumber: item.comprobante,
            date: item.fecha,
            income: item.ingreso,
            expense: item.egreso,
            balance: item.saldo,
            movementType: item?.movementType,
          }
        })
        return {
          success: true,
          data: dataMapped,
        }
      }
      return {
        success: true,
        data: [],
      }

    } catch (error) {
      console.error("Error al obtener reporte de movimientos bancarios:", error)
      throw error
    }
  }

  // Calcular totales para movimientos bancarios
  calculateBankMovementsTotals(data) {
    return data.reduce(
      (totals, row) => ({
        movementsCount: totals.movementsCount + 1,
        totalIncome: totals.totalIncome + row.income,
        totalExpense: totals.totalExpense + row.expense,
        finalBalance: data.length > 0 ? data[data.length - 1].balance : 0,
      }),
      {
        movementsCount: 0,
        totalIncome: 0,
        totalExpense: 0,
        finalBalance: 0,
      },
    )
  }

  // Obtener clase CSS para semaforización de días de mora
  getOverdueDaysClass(days) {
    if (days < 0) {
      return "bg-green-100 text-green-800" // Verde para pagos adelantados
    } else if (days >= 0 && days <= 30) {
      return "bg-yellow-100 text-yellow-800" // Amarillo para 0-30 días
    } else {
      return "bg-red-100 text-red-800" // Rojo para más de 30 días
    }
  }

  // Obtener texto descriptivo para días de mora
  getOverdueDaysText(days) {
    if (days < 0) {
      return `${Math.abs(days)} días adelantado`
    } else if (days === 0) {
      return "Al día"
    } else {
      return `${days} días de mora`
    }
  }

  // Formatear números como moneda
  formatCurrency(value) {
    return new Intl.NumberFormat("es-CO", {
      style: "currency",
      currency: "COP",
      minimumFractionDigits: 0,
    }).format(value)
  }

  // Formatear números simples
  formatNumber(value) {
    return new Intl.NumberFormat("es-CO").format(value)
  }


  // Formatear fecha
  formatDate(dateString) {
    return new Date(dateString).toLocaleDateString("es-CO", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
    })
  }

  // Obtener clase CSS para tipo de cuenta bancaria
  getAccountTypeClass(accountType) {
    if (accountType === "Cuenta Corriente") {
      return "bg-primary text-white"
    } else if (accountType === "Cuenta de Ahorros") {
      return "bg-info text-white"
    } else {
      return "bg-secondary text-white"
    }
  }

  // Obtener clase CSS para saldo bancario
  getBalanceClass(balance) {
    if (balance >= 30000000) {
      return "text-success fw-bold" // Verde para saldos altos
    } else if (balance >= 15000000) {
      return "text-warning fw-bold" // Amarillo para saldos medios
    } else if (balance >= 5000000) {
      return "text-info fw-bold" // Azul para saldos normales
    } else {
      return "text-danger fw-bold" // Rojo para saldos bajos
    }
  }

  // Obtener clase CSS para tipo de movimiento
  getMovementTypeClass(movementType) {
    if (movementType.includes("Ingreso")) {
      return "bg-success text-white"
    } else if (movementType.includes("Pago")) {
      return "bg-danger text-white"
    } else if (movementType.includes("Transferencia")) {
      return "bg-info text-white"
    } else {
      return "bg-secondary text-white"
    }
  }

  // Obtener clase CSS para montos de ingresos y egresos
  getAmountClass(amount, type) {
    if (type === "income" && amount > 0) {
      return "text-success fw-bold"
    } else if (type === "expense" && amount > 0) {
      return "text-danger fw-bold"
    } else {
      return "text-muted"
    }
  }
}
