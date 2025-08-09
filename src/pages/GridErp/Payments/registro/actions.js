'use server'

import { PaymentHelper } from '../payments-helper'

const paymentHelper = new PaymentHelper()

export async function registerPayment(formData) {
  const clientId = formData.get('clientId')
  const selectedDebtId = formData.get('selectedDebtId')
  const paymentDate = formData.get('paymentDate')
  const accountId = formData.get('accountId')
  const value = parseFloat(formData.get('value'))
  const observations = formData.get('observations')
  const paymentSupport = formData.get('paymentSupport') // Esto será un objeto File

  if (!clientId || !paymentDate || !accountId || isNaN(value) || value <= 0) {
    return { success: false, message: 'Por favor, complete todos los campos obligatorios (Cliente, Fecha, Cuenta, Valor).' }
  }

  // Determinar el tipo de operación
  const typeOperation = selectedDebtId === 'none' ? 'Anticipo' : 'Abono a Crédito'

  // Simular la carga del archivo (en un entorno real, aquí se subiría a un servicio como Vercel Blob)
  let paymentSupportUrl = null
  if (paymentSupport && paymentSupport.size > 0) {
    // En un entorno real, aquí se subiría el archivo y se obtendría una URL
    // Por ahora, solo simulamos que se procesó.
    console.log(`Simulando carga de archivo: ${paymentSupport.name}, Tipo: ${paymentSupport.type}, Tamaño: ${paymentSupport.size} bytes`)
    paymentSupportUrl = `simulated_url_for_${paymentSupport.name}`
  }

  const incomeData = {
    clientId,
    purchaseOrderId: selectedDebtId !== 'none' ? selectedDebtId : null, // Asociar a deuda si no es anticipo
    typeOperation,
    paymentDate: new Date(paymentDate),
    accountId,
    value,
    observations,
    paymentSupport: paymentSupportUrl,
  }

  try {
    const result = await paymentHelper.registerIncome(incomeData)
    return result
  } catch (error) {
    console.error('Error al registrar pago en el Server Action:', error)
    return { success: false, message: 'Error interno al registrar el pago.' }
  }
}
