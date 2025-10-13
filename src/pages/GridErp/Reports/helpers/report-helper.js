// Helpers para el módulo de reportes

import { getToken } from "../../../../helpers/jwt-token-access/get_token";
import { BASE_URL } from "../../../../helpers/url_helper";
import { CustomerHelper } from "../../Customers/helper/customer-helper";
import { PurchaseHelper } from "../../PurchaseOrder/helper/purchase_helper";
import { ZonesHelper } from "../../Zones/helper/zones_helper";

const zonesHelper = new ZonesHelper();
const purchaseHelper = new PurchaseHelper();
const customerHelper = new CustomerHelper();
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
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve([
          {
            _id: "1",
            accountNumber: "1234567890",
            bankName: "Banco de Bogotá",
            accountType: "Cuenta Corriente",
            accountName: "Tapetes Premium S.A.S - Principal",
          },
          {
            _id: "2",
            accountNumber: "0987654321",
            bankName: "Bancolombia",
            accountType: "Cuenta de Ahorros",
            accountName: "Tapetes Premium S.A.S - Nómina",
          },
          {
            _id: "3",
            accountNumber: "5555666677",
            bankName: "Banco Popular",
            accountType: "Cuenta Corriente",
            accountName: "Tapetes Premium S.A.S - Proveedores",
          },
          {
            _id: "4",
            accountNumber: "1111222233",
            bankName: "BBVA Colombia",
            accountType: "Cuenta de Ahorros",
            accountName: "Tapetes Premium S.A.S - Reserva",
          },
          {
            _id: "5",
            accountNumber: "9999888877",
            bankName: "Banco Davivienda",
            accountType: "Cuenta Corriente",
            accountName: "Tapetes Premium S.A.S - Operaciones",
          },
        ])
      }, 500)
    })
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
    return new Promise((resolve) => {
      setTimeout(() => {
        // Generar datos simulados basados en la cuenta seleccionada
        const accountInfo = {
          1: {
            accountNumber: "1234567890",
            bankName: "Banco de Bogotá",
            accountName: "Tapetes Premium S.A.S - Principal",
          },
          2: { accountNumber: "0987654321", bankName: "Bancolombia", accountName: "Tapetes Premium S.A.S - Nómina" },
          3: {
            accountNumber: "5555666677",
            bankName: "Banco Popular",
            accountName: "Tapetes Premium S.A.S - Proveedores",
          },
          4: { accountNumber: "1111222233", bankName: "BBVA Colombia", accountName: "Tapetes Premium S.A.S - Reserva" },
          5: {
            accountNumber: "9999888877",
            bankName: "Banco Davivienda",
            accountName: "Tapetes Premium S.A.S - Operaciones",
          },
        }

        const selectedAccount = accountInfo[filters.accountId] || accountInfo["1"]

        const mockData = [
          {
            accountNumber: selectedAccount.accountNumber,
            accountName: selectedAccount.accountName,
            thirdPartyName: "Empresa ABC S.A.S",
            voucherNumber: "REC-001234",
            date: "2024-01-02",
            income: 2731250,
            expense: 0,
            balance: 45750000,
            movementType: "Ingreso por Venta",
          },
          {
            accountNumber: selectedAccount.accountNumber,
            accountName: selectedAccount.accountName,
            thirdPartyName: "Proveedor Materiales Ltda",
            voucherNumber: "PAG-001235",
            date: "2024-01-03",
            income: 0,
            expense: 1500000,
            balance: 44250000,
            movementType: "Pago a Proveedor",
          },
          {
            accountNumber: selectedAccount.accountNumber,
            accountName: selectedAccount.accountName,
            thirdPartyName: "Comercial XYZ Ltda",
            voucherNumber: "REC-001236",
            date: "2024-01-05",
            income: 1966500,
            expense: 0,
            balance: 46216500,
            movementType: "Ingreso por Venta",
          },
          {
            accountNumber: selectedAccount.accountNumber,
            accountName: selectedAccount.accountName,
            thirdPartyName: "Servicios Públicos EPM",
            voucherNumber: "PAG-001237",
            date: "2024-01-08",
            income: 0,
            expense: 850000,
            balance: 45366500,
            movementType: "Pago Servicios",
          },
          {
            accountNumber: selectedAccount.accountNumber,
            accountName: selectedAccount.accountName,
            thirdPartyName: "Distribuidora 123",
            voucherNumber: "REC-001238",
            date: "2024-01-10",
            income: 4588500,
            expense: 0,
            balance: 49955000,
            movementType: "Ingreso por Venta",
          },
          {
            accountNumber: selectedAccount.accountNumber,
            accountName: selectedAccount.accountName,
            thirdPartyName: "Nómina Empleados",
            voucherNumber: "NOM-001239",
            date: "2024-01-15",
            income: 0,
            expense: 8500000,
            balance: 41455000,
            movementType: "Pago Nómina",
          },
          {
            accountNumber: selectedAccount.accountNumber,
            accountName: selectedAccount.accountName,
            thirdPartyName: "Tapetes del Norte",
            voucherNumber: "REC-001240",
            date: "2024-01-18",
            income: 3250000,
            expense: 0,
            balance: 44705000,
            movementType: "Ingreso por Venta",
          },
          {
            accountNumber: selectedAccount.accountNumber,
            accountName: selectedAccount.accountName,
            thirdPartyName: "Transporte y Logística S.A.S",
            voucherNumber: "PAG-001241",
            date: "2024-01-20",
            income: 0,
            expense: 650000,
            balance: 44055000,
            movementType: "Pago Transporte",
          },
          {
            accountNumber: selectedAccount.accountNumber,
            accountName: selectedAccount.accountName,
            thirdPartyName: "Decoraciones Sur",
            voucherNumber: "REC-001242",
            date: "2024-01-22",
            income: 1850000,
            expense: 0,
            balance: 45905000,
            movementType: "Ingreso por Venta",
          },
          {
            accountNumber: selectedAccount.accountNumber,
            accountName: selectedAccount.accountName,
            thirdPartyName: "Mantenimiento Industrial",
            voucherNumber: "PAG-001243",
            date: "2024-01-25",
            income: 0,
            expense: 1200000,
            balance: 44705000,
            movementType: "Pago Mantenimiento",
          },
          {
            accountNumber: selectedAccount.accountNumber,
            accountName: selectedAccount.accountName,
            thirdPartyName: "Pisos y Más S.A.S",
            voucherNumber: "REC-001244",
            date: "2024-01-28",
            income: 980000,
            expense: 0,
            balance: 45685000,
            movementType: "Ingreso por Venta",
          },
          {
            accountNumber: selectedAccount.accountNumber,
            accountName: selectedAccount.accountName,
            thirdPartyName: "Seguros Bolívar",
            voucherNumber: "PAG-001245",
            date: "2024-01-30",
            income: 0,
            expense: 450000,
            balance: 45235000,
            movementType: "Pago Seguros",
          },
          {
            accountNumber: selectedAccount.accountNumber,
            accountName: selectedAccount.accountName,
            thirdPartyName: "Hogar Ideal Ltda",
            voucherNumber: "REC-001246",
            date: "2024-02-02",
            income: 2150000,
            expense: 0,
            balance: 47385000,
            movementType: "Ingreso por Venta",
          },
          {
            accountNumber: selectedAccount.accountNumber,
            accountName: selectedAccount.accountName,
            thirdPartyName: "Publicidad y Marketing",
            voucherNumber: "PAG-001247",
            date: "2024-02-05",
            income: 0,
            expense: 750000,
            balance: 46635000,
            movementType: "Pago Publicidad",
          },
          {
            accountNumber: selectedAccount.accountNumber,
            accountName: selectedAccount.accountName,
            thirdPartyName: "Construcciones Beta",
            voucherNumber: "REC-001248",
            date: "2024-02-08",
            income: 5200000,
            expense: 0,
            balance: 51835000,
            movementType: "Ingreso por Venta",
          },
        ]

        resolve({
          success: true,
          data: mockData,
        })
      }, 1000)
    })
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
