export const validatePayload = (payload) => {
    if (!payload.clientId) return { valid: false, message: "⚠️ Cliente no seleccionado." };
    if (!Array.isArray(payload.details) || payload.details.length === 0)
        return { valid: false, message: "⚠️ No hay productos en la orden." };

    for (let i = 0; i < payload.details.length; i++) {
        const item = payload.details[i];
        const row = i + 1;

        if (!item.matType)
            return { valid: false, message: `⚠️ Fila ${row}: Falta seleccionar el *tipo de tapete*.`, rowIndex: i };
        if (!item.materialType)
            return { valid: false, message: `⚠️ Fila ${row}: Falta seleccionar el *tipo de material*.`, rowIndex: i };
        if (!item.productId)
            return { valid: false, message: `⚠️ Fila ${row}: Falta seleccionar el *producto*.`, rowIndex: i };
        if (!item.pieces || item.pieces <= 0)
            return { valid: false, message: `⚠️ Fila ${row}: La *cantidad de piezas* es inválida.`, rowIndex: i };
        if (!item.piecesNames || item.piecesNames.length === 0)
            return { valid: false, message: `⚠️ Fila ${row}: Faltan los *nombres de piezas*.`, rowIndex: i };
        if (!item.priceItem || item.priceItem <= 0)
            return { valid: false, message: `⚠️ Fila ${row}: El *precio por unidad* es inválido.`, rowIndex: i };
        if (!item.quantityItem || item.quantityItem <= 0)
            return { valid: false, message: `⚠️ Fila ${row}: La *cantidad solicitada* es inválida.`, rowIndex: i };
        if (!item.totalItem || item.totalItem <= 0)
            return { valid: false, message: `⚠️ Fila ${row}: El *total* calculado es inválido.`, rowIndex: i };
    }

    return { valid: true };
};
