// Helpers para el módulo de reportes
export class ReportsHelper {
  // Obtener sedes para el filtro
  async getOffices() {
    try {
      // Simulación - reemplazar con llamada real a la API
      return [
        { _id: "1", name: "Sede Principal" },
        { _id: "2", name: "Sede Norte" },
        { _id: "3", name: "Sede Sur" },
        { _id: "4", name: "Sede Centro" },
      ]
    } catch (error) {
      console.error("Error al obtener sedes:", error)
      throw error
    }
  }

  // Obtener asesores para el filtro
  async getAdvisors() {
    try {
      // Simulación - reemplazar con llamada real a la API
      return [
        { _id: "1", name: "Juan Pérez", office: "Sede Principal" },
        { _id: "2", name: "María García", office: "Sede Norte" },
        { _id: "3", name: "Carlos López", office: "Sede Sur" },
        { _id: "4", name: "Ana Rodríguez", office: "Sede Centro" },
        { _id: "5", name: "Luis Martínez", office: "Sede Principal" },
      ]
    } catch (error) {
      console.error("Error al obtener asesores:", error)
      throw error
    }
  }

  // Obtener clientes para el filtro
  async getClients() {
    try {
      // Simulación - reemplazar con llamada real a la API
      return [
        { _id: "1", name: "Empresa ABC", commercialName: "ABC Comercial" },
        { _id: "2", name: "Distribuidora XYZ", commercialName: "XYZ Ltda" },
        { _id: "3", name: "Corporación 123", commercialName: "Corp 123" },
        { _id: "4", name: "Servicios Generales", commercialName: "ServiGen" },
        { _id: "5", name: "Importadora Nacional", commercialName: "ImpNacional" },
      ]
    } catch (error) {
      console.error("Error al obtener clientes:", error)
      throw error
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

  // Obtener datos del reporte de ventas acumuladas
  async getAccumulatedSalesReport(filters) {
    try {
      const { officeId, advisorId, startDate, endDate } = filters

      // Simulación - reemplazar con llamada real a la API
      // const response = await fetch('/api/reports/accumulated-sales', {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify({ officeId, advisorId, startDate, endDate })
      // });
      // return await response.json();

      // Datos simulados para demostración
      return {
        success: true,
        data: [
          {
            office: "Sede Principal",
            advisor: "Juan Pérez",
            ordersCount: 15,
            carpetsCount: 45,
            baseValue: 2500000,
            discount: 125000,
            subtotal: 2375000,
            iva: 451250,
            retention: 47500,
            totalValue: 2778750,
          },
          {
            office: "Sede Norte",
            advisor: "María García",
            ordersCount: 12,
            carpetsCount: 38,
            baseValue: 1800000,
            discount: 90000,
            subtotal: 1710000,
            iva: 324900,
            retention: 34200,
            totalValue: 2000700,
          },
          {
            office: "Sede Sur",
            advisor: "Carlos López",
            ordersCount: 8,
            carpetsCount: 22,
            baseValue: 1200000,
            discount: 60000,
            subtotal: 1140000,
            iva: 216600,
            retention: 22800,
            totalValue: 1333800,
          },
          {
            office: "Sede Centro",
            advisor: "Ana Rodríguez",
            ordersCount: 10,
            carpetsCount: 30,
            baseValue: 1500000,
            discount: 75000,
            subtotal: 1425000,
            iva: 270750,
            retention: 28500,
            totalValue: 1667250,
          },
          {
            office: "Sede Principal",
            advisor: "Luis Martínez",
            ordersCount: 6,
            carpetsCount: 18,
            baseValue: 900000,
            discount: 45000,
            subtotal: 855000,
            iva: 162450,
            retention: 17100,
            totalValue: 1000350,
          },
        ],
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

      // Simulación - reemplazar con llamada real a la API
      // const response = await fetch('/api/reports/detailed-sales', {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify({ officeId, advisorId, clientId, startDate, endDate })
      // });
      // return await response.json();

      // Datos simulados para demostración
      return {
        success: true,
        data: [
          {
            date: "2024-01-15",
            office: "Sede Principal",
            advisor: "Juan Pérez",
            client: "Empresa ABC",
            commercialName: "ABC Comercial",
            invoiceNumber: "FAC-001",
            carpetsCount: 12,
            baseValue: 850000,
            discount: 42500,
            subtotal: 807500,
            iva: 153425,
            retention: 16150,
            totalValue: 944775,
          },
          {
            date: "2024-01-16",
            office: "Sede Norte",
            advisor: "María García",
            client: "Distribuidora XYZ",
            commercialName: "XYZ Ltda",
            invoiceNumber: "FAC-002",
            carpetsCount: 8,
            baseValue: 600000,
            discount: 30000,
            subtotal: 570000,
            iva: 108300,
            retention: 11400,
            totalValue: 666900,
          },
          {
            date: "2024-01-17",
            office: "Sede Sur",
            advisor: "Carlos López",
            client: "Corporación 123",
            commercialName: "Corp 123",
            invoiceNumber: "FAC-003",
            carpetsCount: 15,
            baseValue: 1200000,
            discount: 60000,
            subtotal: 1140000,
            iva: 216600,
            retention: 22800,
            totalValue: 1333800,
          },
          {
            date: "2024-01-18",
            office: "Sede Centro",
            advisor: "Ana Rodríguez",
            client: "Servicios Generales",
            commercialName: "ServiGen",
            invoiceNumber: "FAC-004",
            carpetsCount: 6,
            baseValue: 450000,
            discount: 22500,
            subtotal: 427500,
            iva: 81225,
            retention: 8550,
            totalValue: 500175,
          },
          {
            date: "2024-01-19",
            office: "Sede Principal",
            advisor: "Luis Martínez",
            client: "Importadora Nacional",
            commercialName: "ImpNacional",
            invoiceNumber: "FAC-005",
            carpetsCount: 20,
            baseValue: 1500000,
            discount: 75000,
            subtotal: 1425000,
            iva: 270750,
            retention: 28500,
            totalValue: 1667250,
          },
          {
            date: "2024-01-20",
            office: "Sede Norte",
            advisor: "María García",
            client: "Empresa ABC",
            commercialName: "ABC Comercial",
            invoiceNumber: "FAC-006",
            carpetsCount: 10,
            baseValue: 750000,
            discount: 37500,
            subtotal: 712500,
            iva: 135375,
            retention: 14250,
            totalValue: 833625,
          },
          {
            date: "2024-01-21",
            office: "Sede Sur",
            advisor: "Carlos López",
            client: "Distribuidora XYZ",
            commercialName: "XYZ Ltda",
            invoiceNumber: "FAC-007",
            carpetsCount: 5,
            baseValue: 350000,
            discount: 17500,
            subtotal: 332500,
            iva: 63175,
            retention: 6650,
            totalValue: 389025,
          },
          {
            date: "2024-01-22",
            office: "Sede Centro",
            advisor: "Ana Rodríguez",
            client: "Corporación 123",
            commercialName: "Corp 123",
            invoiceNumber: "FAC-008",
            carpetsCount: 18,
            baseValue: 1350000,
            discount: 67500,
            subtotal: 1282500,
            iva: 243675,
            retention: 25650,
            totalValue: 1500525,
          },
        ],
      }
    } catch (error) {
      console.error("Error al obtener reporte de ventas detalladas:", error)
      throw error
    }
  }

  // Obtener datos del reporte de ventas por producto
  async getProductSalesReport(filters) {
    try {
      const { officeId, advisorId, clientId, productId, carpetTypeId, materialId, startDate, endDate } = filters

      // Simulación - reemplazar con llamada real a la API
      // const response = await fetch('/api/reports/product-sales', {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify({ officeId, advisorId, clientId, productId, carpetTypeId, materialId, startDate, endDate })
      // });
      // return await response.json();

      // Datos simulados para demostración
      return {
        success: true,
        data: [
          {
            office: "Sede Principal",
            advisor: "Juan Pérez",
            client: "Empresa ABC",
            product: "Tapete Premium 120x180",
            carpetType: "Premium",
            material: "Nylon",
            quantity: 5,
            baseValue: 425000,
            discount: 21250,
            subtotal: 403750,
            iva: 76713,
            retention: 8075,
            totalValue: 472388,
          },
          {
            office: "Sede Norte",
            advisor: "María García",
            client: "Distribuidora XYZ",
            product: "Tapete Clásico 100x150",
            carpetType: "Clásico",
            material: "Polipropileno",
            quantity: 8,
            baseValue: 320000,
            discount: 16000,
            subtotal: 304000,
            iva: 57760,
            retention: 6080,
            totalValue: 355680,
          },
          {
            office: "Sede Sur",
            advisor: "Carlos López",
            client: "Corporación 123",
            product: "Tapete Moderno 80x120",
            carpetType: "Moderno",
            material: "Lana",
            quantity: 12,
            baseValue: 720000,
            discount: 36000,
            subtotal: 684000,
            iva: 129960,
            retention: 13680,
            totalValue: 800280,
          },
          {
            office: "Sede Centro",
            advisor: "Ana Rodríguez",
            client: "Servicios Generales",
            product: "Tapete Ejecutivo 200x300",
            carpetType: "Ejecutivo",
            material: "Algodón",
            quantity: 3,
            baseValue: 450000,
            discount: 22500,
            subtotal: 427500,
            iva: 81225,
            retention: 8550,
            totalValue: 500175,
          },
          {
            office: "Sede Principal",
            advisor: "Luis Martínez",
            client: "Importadora Nacional",
            product: "Tapete Decorativo 60x90",
            carpetType: "Decorativo",
            material: "Fibra Sintética",
            quantity: 15,
            baseValue: 375000,
            discount: 18750,
            subtotal: 356250,
            iva: 67688,
            retention: 7125,
            totalValue: 416813,
          },
          {
            office: "Sede Norte",
            advisor: "María García",
            client: "Empresa ABC",
            product: "Tapete Premium 120x180",
            carpetType: "Premium",
            material: "Nylon",
            quantity: 7,
            baseValue: 595000,
            discount: 29750,
            subtotal: 565250,
            iva: 107398,
            retention: 11305,
            totalValue: 661343,
          },
          {
            office: "Sede Sur",
            advisor: "Carlos López",
            client: "Distribuidora XYZ",
            product: "Tapete Clásico 100x150",
            carpetType: "Clásico",
            material: "Polipropileno",
            quantity: 10,
            baseValue: 400000,
            discount: 20000,
            subtotal: 380000,
            iva: 72200,
            retention: 7600,
            totalValue: 444600,
          },
          {
            office: "Sede Centro",
            advisor: "Ana Rodríguez",
            client: "Corporación 123",
            product: "Tapete Moderno 80x120",
            carpetType: "Moderno",
            material: "Lana",
            quantity: 6,
            baseValue: 360000,
            discount: 18000,
            subtotal: 342000,
            iva: 64980,
            retention: 6840,
            totalValue: 400140,
          },
          {
            office: "Sede Principal",
            advisor: "Juan Pérez",
            client: "Servicios Generales",
            product: "Tapete Ejecutivo 200x300",
            carpetType: "Ejecutivo",
            material: "Algodón",
            quantity: 2,
            baseValue: 300000,
            discount: 15000,
            subtotal: 285000,
            iva: 54150,
            retention: 5700,
            totalValue: 333450,
          },
          {
            office: "Sede Norte",
            advisor: "María García",
            client: "Importadora Nacional",
            product: "Tapete Decorativo 60x90",
            carpetType: "Decorativo",
            material: "Fibra Sintética",
            quantity: 20,
            baseValue: 500000,
            discount: 25000,
            subtotal: 475000,
            iva: 90250,
            retention: 9500,
            totalValue: 555750,
          },
        ],
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

      // Simulación - reemplazar con llamada real a la API
      // const response = await fetch('/api/reports/accounts-receivable', {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify({ clientId, officeId, advisorId })
      // });
      // return await response.json();

      // Datos simulados para demostración
      return {
        success: true,
        data: [
          {
            client: "Empresa ABC",
            commercialName: "ABC Comercial",
            city: "Bogotá",
            advisor: "Juan Pérez",
            office: "Sede Principal",
            ordersCount: 8,
            overdueDays: -5, // Pago adelantado
            totalValue: 2450000,
          },
          {
            client: "Distribuidora XYZ",
            commercialName: "XYZ Ltda",
            city: "Medellín",
            advisor: "María García",
            office: "Sede Norte",
            ordersCount: 12,
            overdueDays: 15, // Dentro del rango normal
            totalValue: 3200000,
          },
          {
            client: "Corporación 123",
            commercialName: "Corp 123",
            city: "Cali",
            advisor: "Carlos López",
            office: "Sede Sur",
            ordersCount: 6,
            overdueDays: 45, // Mora alta
            totalValue: 1850000,
          },
          {
            client: "Servicios Generales",
            commercialName: "ServiGen",
            city: "Barranquilla",
            advisor: "Ana Rodríguez",
            office: "Sede Centro",
            ordersCount: 4,
            overdueDays: 0, // Al día
            totalValue: 980000,
          },
          {
            client: "Importadora Nacional",
            commercialName: "ImpNacional",
            city: "Cartagena",
            advisor: "Luis Martínez",
            office: "Sede Principal",
            ordersCount: 15,
            overdueDays: 62, // Mora muy alta
            totalValue: 4750000,
          },
          {
            client: "Comercializadora Sur",
            commercialName: "ComSur",
            city: "Bucaramanga",
            advisor: "María García",
            office: "Sede Norte",
            ordersCount: 9,
            overdueDays: 22, // Dentro del rango normal
            totalValue: 2100000,
          },
          {
            client: "Distribuciones Norte",
            commercialName: "DistNorte",
            city: "Pereira",
            advisor: "Carlos López",
            office: "Sede Sur",
            ordersCount: 7,
            overdueDays: -2, // Pago adelantado
            totalValue: 1650000,
          },
          {
            client: "Empresa Textil",
            commercialName: "TextilCorp",
            city: "Manizales",
            advisor: "Ana Rodríguez",
            office: "Sede Centro",
            ordersCount: 11,
            overdueDays: 38, // Mora alta
            totalValue: 2890000,
          },
          {
            client: "Comercial Andina",
            commercialName: "ComAndina",
            city: "Ibagué",
            advisor: "Juan Pérez",
            office: "Sede Principal",
            ordersCount: 5,
            overdueDays: 8, // Dentro del rango normal
            totalValue: 1320000,
          },
          {
            client: "Distribuidora Central",
            commercialName: "DistCentral",
            city: "Villavicencio",
            advisor: "Luis Martínez",
            office: "Sede Principal",
            ordersCount: 13,
            overdueDays: 75, // Mora muy alta
            totalValue: 3580000,
          },
        ],
      }
    } catch (error) {
      console.error("Error al obtener reporte de cuentas por cobrar:", error)
      throw error
    }
  }

  // Reporte de cuentas por cobrar detallado por pedidos
  async getDetailedAccountsReceivableReport(filters) {
    return new Promise((resolve) => {
      setTimeout(() => {
        const mockData = [
          {
            client: "Empresa ABC S.A.S",
            commercialName: "ABC Corp",
            city: "Bogotá",
            advisor: "Carlos Rodríguez",
            office: "Sede Bogotá",
            invoiceNumber: "F-001234",
            dueDate: "2024-02-15",
            overdueDays: -5, // Pago adelantado
            totalValue: 2731250,
          },
          {
            client: "Empresa ABC S.A.S",
            commercialName: "ABC Corp",
            city: "Bogotá",
            advisor: "Carlos Rodríguez",
            office: "Sede Bogotá",
            invoiceNumber: "F-001245",
            dueDate: "2024-02-20",
            overdueDays: -10, // Pago adelantado
            totalValue: 1850000,
          },
          {
            client: "Comercial XYZ Ltda",
            commercialName: "XYZ Store",
            city: "Medellín",
            advisor: "María González",
            office: "Sede Medellín",
            invoiceNumber: "F-001235",
            dueDate: "2024-02-10",
            overdueDays: 0, // Al día
            totalValue: 1966500,
          },
          {
            client: "Comercial XYZ Ltda",
            commercialName: "XYZ Store",
            city: "Medellín",
            advisor: "María González",
            office: "Sede Medellín",
            invoiceNumber: "F-001250",
            dueDate: "2024-01-25",
            overdueDays: 16, // Mora normal
            totalValue: 980000,
          },
          {
            client: "Distribuidora 123",
            commercialName: "Dist 123",
            city: "Cali",
            advisor: "Juan Pérez",
            office: "Sede Cali",
            invoiceNumber: "F-001236",
            dueDate: "2024-01-26",
            overdueDays: 15, // Mora normal
            totalValue: 4588500,
          },
          {
            client: "Tapetes del Norte",
            commercialName: "Norte Tapetes",
            city: "Barranquilla",
            advisor: "Ana López",
            office: "Sede Barranquilla",
            invoiceNumber: "F-001240",
            dueDate: "2023-12-28",
            overdueDays: 44, // Mora alta
            totalValue: 1250000,
          },
          {
            client: "Tapetes del Norte",
            commercialName: "Norte Tapetes",
            city: "Barranquilla",
            advisor: "Ana López",
            office: "Sede Barranquilla",
            invoiceNumber: "F-001241",
            dueDate: "2023-12-30",
            overdueDays: 42, // Mora alta
            totalValue: 2000000,
          },
          {
            client: "Decoraciones Sur",
            commercialName: "Deco Sur",
            city: "Bucaramanga",
            advisor: "Luis Martínez",
            office: "Sede Bogotá",
            invoiceNumber: "F-001242",
            dueDate: "2023-11-30",
            overdueDays: 72, // Mora crítica
            totalValue: 950000,
          },
          {
            client: "Decoraciones Sur",
            commercialName: "Deco Sur",
            city: "Bucaramanga",
            advisor: "Luis Martínez",
            office: "Sede Bogotá",
            invoiceNumber: "F-001243",
            dueDate: "2023-12-05",
            overdueDays: 67, // Mora crítica
            totalValue: 900000,
          },
          {
            client: "Pisos y Más S.A.S",
            commercialName: "Pisos Plus",
            city: "Pereira",
            advisor: "Carlos Rodríguez",
            office: "Sede Medellín",
            invoiceNumber: "F-001244",
            dueDate: "2024-01-19",
            overdueDays: 22, // Mora normal
            totalValue: 980000,
          },
          {
            client: "Hogar Ideal Ltda",
            commercialName: "Hogar Ideal",
            city: "Manizales",
            advisor: "María González",
            office: "Sede Cali",
            invoiceNumber: "F-001246",
            dueDate: "2024-02-12",
            overdueDays: -2, // Pago adelantado
            totalValue: 750000,
          },
          {
            client: "Hogar Ideal Ltda",
            commercialName: "Hogar Ideal",
            city: "Manizales",
            advisor: "María González",
            office: "Sede Cali",
            invoiceNumber: "F-001247",
            dueDate: "2024-02-18",
            overdueDays: -8, // Pago adelantado
            totalValue: 1400000,
          },
          {
            client: "Construcciones Beta",
            commercialName: "Beta Construcciones",
            city: "Cartagena",
            advisor: "Juan Pérez",
            office: "Sede Barranquilla",
            invoiceNumber: "F-001248",
            dueDate: "2023-12-15",
            overdueDays: 57, // Mora crítica
            totalValue: 2600000,
          },
          {
            client: "Construcciones Beta",
            commercialName: "Beta Construcciones",
            city: "Cartagena",
            advisor: "Juan Pérez",
            office: "Sede Barranquilla",
            invoiceNumber: "F-001249",
            dueDate: "2024-01-08",
            overdueDays: 33, // Mora alta
            totalValue: 2600000,
          },
          {
            client: "Oficinas Modernas",
            commercialName: "Oficinas Plus",
            city: "Ibagué",
            advisor: "Ana López",
            office: "Sede Bogotá",
            invoiceNumber: "F-001251",
            dueDate: "2024-02-02",
            overdueDays: 8, // Mora normal
            totalValue: 875000,
          },
          {
            client: "Oficinas Modernas",
            commercialName: "Oficinas Plus",
            city: "Ibagué",
            advisor: "Ana López",
            office: "Sede Bogotá",
            invoiceNumber: "F-001252",
            dueDate: "2024-02-05",
            overdueDays: 5, // Mora normal
            totalValue: 875000,
          },
          {
            client: "Espacios Creativos",
            commercialName: "Creativos Design",
            city: "Villavicencio",
            advisor: "Luis Martínez",
            office: "Sede Medellín",
            invoiceNumber: "F-001253",
            dueDate: "2024-02-10",
            overdueDays: 0, // Al día
            totalValue: 1320000,
          },
        ]

        resolve({
          success: true,
          data: mockData,
        })
      }, 1000)
    })
  }

  // Reporte de saldos de cuentas bancarias
  async getBankAccountsBalanceReport() {
    return new Promise((resolve) => {
      setTimeout(() => {
        const mockData = [
          {
            accountNumber: "1234567890",
            bankName: "Banco de Bogotá",
            accountType: "Cuenta Corriente",
            accountName: "Tapetes Premium S.A.S - Principal",
            balance: 45750000,
          },
          {
            accountNumber: "0987654321",
            bankName: "Bancolombia",
            accountType: "Cuenta de Ahorros",
            accountName: "Tapetes Premium S.A.S - Nómina",
            balance: 12300000,
          },
          {
            accountNumber: "5555666677",
            bankName: "Banco Popular",
            accountType: "Cuenta Corriente",
            accountName: "Tapetes Premium S.A.S - Proveedores",
            balance: 8950000,
          },
          {
            accountNumber: "1111222233",
            bankName: "BBVA Colombia",
            accountType: "Cuenta de Ahorros",
            accountName: "Tapetes Premium S.A.S - Reserva",
            balance: 25600000,
          },
          {
            accountNumber: "9999888877",
            bankName: "Banco Davivienda",
            accountType: "Cuenta Corriente",
            accountName: "Tapetes Premium S.A.S - Operaciones",
            balance: 18750000,
          },
          {
            accountNumber: "4444333322",
            bankName: "Banco Caja Social",
            accountType: "Cuenta de Ahorros",
            accountName: "Tapetes Premium S.A.S - Inversiones",
            balance: 32100000,
          },
          {
            accountNumber: "7777888899",
            bankName: "Banco Agrario",
            accountType: "Cuenta Corriente",
            accountName: "Tapetes Premium S.A.S - Sede Medellín",
            balance: 6850000,
          },
          {
            accountNumber: "2222111100",
            bankName: "Banco AV Villas",
            accountType: "Cuenta de Ahorros",
            accountName: "Tapetes Premium S.A.S - Sede Cali",
            balance: 9200000,
          },
          {
            accountNumber: "6666555544",
            bankName: "Banco Occidente",
            accountType: "Cuenta Corriente",
            accountName: "Tapetes Premium S.A.S - Exportaciones",
            balance: 15400000,
          },
          {
            accountNumber: "3333444455",
            bankName: "Banco Colpatria",
            accountType: "Cuenta de Ahorros",
            accountName: "Tapetes Premium S.A.S - Emergencias",
            balance: 5250000,
          },
        ]

        resolve({
          success: true,
          data: mockData,
        })
      }, 1000)
    })
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

}
