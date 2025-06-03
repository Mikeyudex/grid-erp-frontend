import { validateEmail } from "../../../../helpers/validations-helpers";


export const validateBasicInputs = (data, setErrors) => {
    const newErrors = {};

    if (!data.typeOfCustomer) {
        newErrors.typeOfCustomer = "El tipo de cliente es obligatorio";
    }

    if (!data.typeOfDocument) {
        newErrors.typeOfDocument = "El tipo de documento es obligatorio";
    }

    if (!data.name) {
        newErrors.name = "El nombre es obligatorio";
    }

    if (!data.lastname) {
        newErrors.lastname = "El apellido es obligatorio";
    }

    if (!data.commercialName) {
        newErrors.commercialName = "El nombre comercial es obligatorio";
    }

    if (!data.city) {
        newErrors.city = "La ciudad es obligatoria";
    }

    if (!data.address) {
        newErrors.address = "La dirección es obligatoria";
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

export const validateIsSameAddress = (data) => {
    if (
        data?.name === data?.shippingName &&
        data?.lastname === data?.shippingLastname &&
        data?.email === data?.shippingEmail &&
        data?.phone === data?.shippingPhone &&
        data?.documento === data?.shippingDocumento &&
        data?.address === data?.shippingAddress &&
        data?.city === data?.shippingCity &&
        data?.postalCode === data?.shippingPostalCode
    ) {
        return true;
    }
    return false;
};


