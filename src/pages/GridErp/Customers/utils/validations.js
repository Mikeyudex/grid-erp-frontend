import { validateEmail } from "../../../../helpers/validations-helpers";


export const validateBasicInputs = (data, setErrors) => {
    const newErrors = {};

    if (!data.name) {
        newErrors.name = "El nombre es obligatorio";
    }

    if (!data.lastname) {
        newErrors.lastname = "El apellido es obligatorio";
    }

    if (!data.email) {
        newErrors.email = "El correo es obligatorio";
    }

    if (!validateEmail(data.email)) {
        newErrors.email = "El correo no es válido";
    }

    if (!data.phone) {
        newErrors.phone = "El teléfono es obligatorio";
    }

    if (!data.documento) {
        newErrors.documento = "El documento es obligatorio";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0; // Devuelve true si no hay errores
};

export const validateBillingData = (data, setErrors) => {
    const newErrors = {};

    if (!data.billingName) {
        newErrors.billingName = "El nombre es obligatorio";
    }

    if (!data.billingLastname) {
        newErrors.billingLastname = "El apellido es obligatorio";
    }

    if (!data.billingEmail) {
        newErrors.billingEmail = "El correo es obligatorio";
    }

    if (!validateEmail(data.billingEmail)) {
        newErrors.billingEmail = "El correo no es válido";
    }

    if (!data.billingPhone) {
        newErrors.billingPhone = "El teléfono es obligatorio";
    }

    if (!data.billingDocumento) {
        newErrors.billingDocumento = "El documento es obligatorio";
    }

    if (!data.billingAddress) {
        newErrors.billingAddress = "La dirección es obligatoria";
    }

    if (!data.billingCity) {
        newErrors.billingCity = "La ciudad es obligatoria";
    }

    /* if (!data.billingPostalCode) {
        newErrors.billingPostalCode = "El código postal es obligatorio";
    } */

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0; // Devuelve true si no hay errores
};


