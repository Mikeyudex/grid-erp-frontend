import { IndexedDBService } from "../../../../helpers/indexedDb/indexed-db-helper";
import { getToken } from "../../../../helpers/jwt-token-access/get_token"
import { BASE_URL, UPLOAD_FILE } from "../../../../helpers/url_helper";
import { AccountHelper } from "../../Accounts/helpers/account_helper";
import { RetentionHelper } from "../../Retentions/helpers/retention-helper";
import { TaxHelper } from "../../Taxes/helpers/tax-helper";

const taxHelper = new TaxHelper();
const retentionHelper = new RetentionHelper();
const accountHelper = new AccountHelper();
const indexedDB = new IndexedDBService();

export class PurchaseHelper {
  constructor() {
    this.baseUrl = `${BASE_URL}/purchase`;
  }

  async getPurchases(params) {
    try {
      let token = getToken();
      return fetch(`${this.baseUrl}/getAll?page=${params.page}&limit=${params.limit}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          "Authorization": `Bearer ${token}`,
        },
      })
        .then(response => response.json())
        .then(data => data)
        .catch(err => console.log(err));
    } catch (error) {
      throw new Error('Error al obtener compras: ' + error.message);
    }
  }

  async updatePurchase(data) {
    let token = getToken();
    return fetch(`${this.baseUrl}/update/${data._id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        "Authorization": `Bearer ${token}`,
      },
      body: JSON.stringify(data),
    })
      .then(response => response.json())
      .then(data => data)
      .catch(err => console.log(err));
  }

  async deletePurchase(id) {
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

  async bulkDeletePurchases(ids) {
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

  // Obtener proveedores
  async getProviders() {
    try {
      let token = getToken();
      return fetch(`${BASE_URL}/customers/getProviders`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          "Authorization": `Bearer ${token}`,
        },
      })
        .then(response => response.json())
        .then(data => data)
        .catch(err => console.log(err));
    } catch (error) {
      throw new Error('Error al obtener proveedores: ' + error.message);
    }
  }

  // Buscar productos
  async searchProducts(searchTerm, typeProduct = "GENERAL") {
    try {
      let token = getToken();
      return fetch(`${BASE_URL}/products/searchProductByTypeAndSearch/${typeProduct}/${searchTerm}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          "Authorization": `Bearer ${token}`,
        },
      })
        .then(response => response.json())
        .then(data => data)
        .catch(err => console.log(err));
    } catch (error) {
      throw new Error('Error al buscar productos: ' + error.message);
    }
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
    return taxHelper.getAll();
  }

  // Obtener retenciones
  async getRetentions() {
    return retentionHelper.getRetentions();
  }

  // Obtener cuentas
  async getAccounts() {
    return accountHelper.getAccounts();
  }

  // Subir archivo
  async uploadFile(file) {
    return new Promise(async (resolve, reject) => {
      try {
        let formData = new FormData();
        formData.append("file", file);
        let token = getToken();
        let response = await fetch(`${BASE_URL}${UPLOAD_FILE}`, {
          method: "POST",
          headers: {
            "Authorization": `Bearer ${token}`,
          },
          body: formData,
        });
        let data = await response.json();
        let url = data?.url;
        if (url) {
          url = `${BASE_URL}${url}`;
        }
        resolve({
          success: true,
          url: url,
          message: "Archivo subido exitosamente",
        })
      } catch (error) {
        reject(error)
      }
    })
  }

  // Crear orden de compra
  async createPurchaseOrder(purchaseData) {
    //console.log("Payload creación de orden de compra:", purchaseData)
    return new Promise(async (resolve, reject) => {
      try {
        let response = await fetch(`${BASE_URL}/purchase/create`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            "Authorization": `Bearer ${getToken()}`,
          },
          body: JSON.stringify(purchaseData),
        });

        if (response.ok) {
          let data = await response.json();
          resolve({
            success: true,
            message: "Orden de compra creada exitosamente",
            data: data,
          });
        } else {
          let error = await response.json();
          reject(error);
        }
      } catch (error) {
        reject(error)
      }
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
        if (tax.percentage === 0) return
        if (item?.taxIncluded === false) {
          totalIVA += this.calculateTaxAmount(itemTotal, tax?.percentage)
        } else {
          totalIVA += this.calculateTaxAmount(itemTotal, tax?.percentage)
          totalBruto -= this.calculateTaxAmount(itemTotal, tax?.percentage)
        }
      }

      // Calcular retención del item
      const retention = retentions.find((r) => r._id === item.retentionId)
      if (retention) {
        totalRetenciones += this.calculateRetentionAmount(itemTotal, retention.percentage)
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

  // Calcular total de pagos
  calculateTotalPayments(paymentMethods) {
    return paymentMethods.reduce((total, method) => total + (method.value || 0), 0)
  }

  // Calcular total de la compra
  calculateTotalItems = (orderItems) => {
    return orderItems.reduce((total, item) => total + (item.itemPrice || 0), 0)
  };

  getZoneId = async () => {
    try {
      let response = await indexedDB.getItemById(localStorage.getItem("userId"));
      return response?.zoneId;
    } catch (error) {
      console.log(error);
      return null;
    }
  }

  getAdvanceByProvider = async (providerId, typeOperation = 'anticipo', page = 1, limit = 10) => {
    try {
      let token = getToken();
      let response = await fetch(`${BASE_URL}/accounting/income/getAllByProviderAndTypeOperation/${providerId}/${typeOperation}?page=${page}&limit=${limit}`,
        {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          }
        }
      );
      return response.json();
    } catch (error) {
      console.error("Error fetching advance by customer:", error);
      throw error;

    }
  }
}
