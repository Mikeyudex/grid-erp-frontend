export const OrderItem = {
    productName: "",
    pieces: 0,
    matType: "",
    materialType: "",
    quantity: 0,
    basePrice: 0,
    observations: "",
    finalPrice: 0,
}


export function transformarDatos(arreglo) {
    const resultado = {
        BASIC: {},
        "ESTÁNDAR A": {},
        "ESTÁNDAR B": {},
        PREMIUM: {},
    };

    arreglo.forEach((item) => {
        const tipoTapete = item.tipo_tapete;
        const tipoMaterial = item.tipo_material;
        const precioBase = item.precioBase;

        //agregar el id al objeto
        if (resultado[tipoTapete]) {
            resultado[tipoTapete][tipoMaterial] = precioBase;
        }
    });

    return resultado;
}

export function obtenerAtributosUnicos(arreglo, atributo) {
    const valoresUnicos = new Set();
    arreglo.forEach((objeto) => {
        if (objeto[atributo]) {
            valoresUnicos.add(objeto[atributo]);
        }
    });
    return Array.from(valoresUnicos);
}
