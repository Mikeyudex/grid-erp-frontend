'use server'

import { PaymentHelper } from '../payments-helper'

const paymentHelper = new PaymentHelper()

export async function registerPayment(payload) {
  try {
    const result = await paymentHelper.registerIncome(payload)
    return result
  } catch (error) {
    console.error('Error al registrar pago en el Server Action:', error)
    return { success: false, message: 'Error interno al registrar el pago.' }
  }
}

export async function updatePayment(payload) {
  try {
    const result = await paymentHelper.updateIncome(payload)
    return result
  } catch (error) {
    console.error('Error al actualizar pago en el Server Action:', error)
    return { success: false, message: 'Error interno al actualizar el pago.' }
  }
}
