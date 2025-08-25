export class PurchaseHelper {
  constructor() {
    // Simulación de datos para proveedores
    this.providers = [
      { _id: "prov1", name: "Proveedor ABC S.A.S", nit: "900123456-1", email: "contacto@proveedorabc.com" },
      { _id: "prov2", name: "Distribuidora XYZ Ltda", nit: "800987654-2", email: "ventas@distribuidoraxyz.com" },
      { _id: "prov3", name: "Importadora 123 S.A.", nit: "900555444-3", email: "compras@importadora123.com" },
    ]

    // Simulación de productos
    this.products = [
      {
        _id: "prod1",
        name: "Tapete Premium BMW X3",
        sku: "TAP-BMW-X3-001",
        costPrice: 85000,
        salePrice: 120000,
        category: "Tapetes Automotrices",
        stock: 15,
        taxId: "tax1",
        retentionId: "ret1",
      },
      {
        _id: "prod2",
        name: "Tapete Estándar Toyota Corolla",
        sku: "TAP-TOY-COR-002",
        costPrice: 65000,
        salePrice: 95000,
        category: "Tapetes Automotrices",
        stock: 25,
        taxId: "tax1",
        retentionId: "ret1",
      },
      {
        _id: "prod3",
        name: "Kit Limpieza Tapetes",
        sku: "KIT-LIM-001",
        costPrice: 25000,
        salePrice: 40000,
        category: "Accesorios",
        stock: 50,
        taxId: "tax1",
        retentionId: "ret2",
      },
      {
        _id: "prod4",
        name: "Tapete Universal Sedan",
        sku: "TAP-UNI-SED-003",
        costPrice: 45000,
        salePrice: 70000,
        category: "Tapetes Automotrices",
        stock: 30,
        taxId: "tax2",
        retentionId: "ret1",
      },
    ]

    // Simulación de impuestos
    this.taxes = [
      { _id: "tax1", name: "IVA 19%", rate: 19, type: "IVA" },
      { _id: "tax2", name: "IVA 5%", rate: 5, type: "IVA" },
      { _id: "tax3", name: "Exento", rate: 0, type: "EXENTO" },
    ]

    // Simulación de retenciones
    this.retentions = [
      { _id: "ret1", name: "Retención en la Fuente 3.5%", rate: 3.5, type: "RETEFUENTE" },
      { _id: "ret2", name: "Retención en la Fuente 2.5%", rate: 2.5, type: "RETEFUENTE" },
      { _id: "ret3", name: "Sin Retención", rate: 0, type: "SIN_RETENCION" },
    ]

    // Simulación de cuentas para formas de pago
    this.accounts = [
      { _id: "acc1", name: "Cuenta Corriente - Banco A", typeAccount: "Corriente" },
      { _id: "acc2", name: "Cuenta de Ahorros - Banco B", typeAccount: "Ahorros" },
      { _id: "acc3", name: "Efectivo", typeAccount: "Efectivo" },
    ]
  }

  // Obtener proveedores
  async getProviders() {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(this.providers)
      }, 300)
    })
  }

  // Buscar productos
  async searchProducts(searchTerm) {
    return new Promise((resolve) => {
      setTimeout(() => {
        const filtered = this.products.filter(
          (product) =>
            product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            product.sku.toLowerCase().includes(searchTerm.toLowerCase()),
        )
        resolve(filtered)
      }, 500)
    })
  }

  // Obtener producto por ID
  async getProductById(productId) {
    return new Promise((resolve) => {
      setTimeout(() => {
        const product = this.products.find((p) => p._id === productId)
        resolve(product)
      }, 200)
    })
  }

  // Obtener impuestos
  async getTaxes() {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(this.taxes)
      }, 300)
    })
  }

  // Obtener retenciones
  async getRetentions() {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(this.retentions)
      }, 300)
    })
  }

  // Obtener cuentas
  async getAccounts() {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(this.accounts)
      }, 300)
    })
  }

  // Subir archivo
  async uploadFile(file) {
    console.log("Simulando subida de archivo:", file.name)
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        if (file.size > 10 * 1024 * 1024) {
          // 10MB máximo
          reject(new Error("El archivo no debe superar los 10MB"))
          return
        }

        // Simular respuesta exitosa con URL
        const mockUrl = `https://example.com/uploads/payments/${Date.now()}_${file.name}`
        resolve({
          success: true,
          url: mockUrl,
          message: "Archivo subido exitosamente",
        })
      }, 1500)
    })
  }

  // Crear orden de compra
  async createPurchaseOrder(purchaseData) {
    console.log("Simulando creación de orden de compra:", purchaseData)
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        // Validaciones básicas
        if (!purchaseData.providerId) {
          reject(new Error("El proveedor es obligatorio"))
          return
        }
        if (!purchaseData.detail || purchaseData.detail.length === 0) {
          reject(new Error("Debe agregar al menos un producto"))
          return
        }
        if (!purchaseData.methodOfPayment || purchaseData.methodOfPayment.length === 0) {
          reject(new Error("Debe agregar al menos una forma de pago"))
          return
        }

        // Simular éxito
        resolve({
          success: true,
          message: "Orden de compra creada exitosamente",
          data: {
            _id: "purchase_" + Date.now(),
            orderNumber: Math.floor(Math.random() * 10000) + 1000,
            ...purchaseData,
            createdAt: new Date(),
          },
        })
      }, 2000)
    })
  }

  // Utilidades para cálculos
  calculateItemTotal(itemPrice, itemQuantity, discountPercentage = 0) {
    const subtotal = itemPrice * itemQuantity
    const discount = (subtotal * discountPercentage) / 100
    return subtotal - discount
  }

  calculateTaxAmount(baseAmount, taxRate) {
    return (baseAmount * taxRate) / 100
  }

  calculateRetentionAmount(baseAmount, retentionRate) {
    return (baseAmount * retentionRate) / 100
  }

  calculateOrderSummary(items, taxes, retentions) {
    let totalBruto = 0
    let totalDescuentos = 0
    let totalIVA = 0
    let totalRetenciones = 0

    items.forEach((item) => {
      const itemSubtotal = item.itemPrice * item.itemQuantity
      const itemDiscount = (itemSubtotal * (item.discountPercentage || 0)) / 100
      const itemTotal = itemSubtotal - itemDiscount

      totalBruto += itemSubtotal
      totalDescuentos += itemDiscount

      // Calcular IVA del item
      const tax = taxes.find((t) => t._id === item.taxId)
      if (tax) {
        totalIVA += this.calculateTaxAmount(itemTotal, tax.rate)
      }

      // Calcular retención del item
      const retention = retentions.find((r) => r._id === item.retentionId)
      if (retention) {
        totalRetenciones += this.calculateRetentionAmount(itemTotal, retention.rate)
      }
    })

    const subtotal = totalBruto - totalDescuentos
    const totalAPagar = subtotal + totalIVA - totalRetenciones

    return {
      totalBruto,
      totalDescuentos,
      subtotal,
      totalIVA,
      totalRetenciones,
      totalAPagar,
    }
  }
}
