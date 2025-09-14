"use server"

import { ExpensesHelper} from "../../helpers/expenses_helper"

const expenseHelper = new ExpensesHelper()

export async function registerExpense(expenseData) {
  try {
    // Validaciones del servidor
    if (!expenseData.providerId) {
      return { success: false, message: "El proveedor es obligatorio." }
    }

    if (!expenseData.accountId) {
      return { success: false, message: "La cuenta es obligatoria." }
    }

    if (!expenseData.zoneId) {
      return { success: false, message: "La zona es obligatoria." }
    }

    if (!expenseData.typeOfExpenseId) {
      return { success: false, message: "El tipo de gasto es obligatorio." }
    }

    if (!expenseData.value || expenseData.value <= 0) {
      return { success: false, message: "El valor debe ser mayor a cero." }
    }

    if (!expenseData.paymentDate) {
      return { success: false, message: "La fecha de pago es obligatoria." }
    }

    // Llamar al helper para registrar el egreso
    const result = await expenseHelper.registerExpense(expenseData)
    return result
  } catch (error) {
    console.error("Error al registrar egreso en el Server Action:", error)
    return { success: false, message: "Error interno al registrar el egreso." }
  }
}
