import React, { Fragment, useEffect, useState } from "react";
import { ToastContainer } from "react-toastify";
import { Container, Row, Form } from "reactstrap";
import { PlusCircleIcon, TrashIcon, ChevronRightIcon, ChevronLeftIcon, CheckCircleIcon } from "@heroicons/react/24/outline";


import BreadCrumb from "../../Products/components/BreadCrumb";
import { styles } from "./styles";
import { validateBasicInputs, validateBillingData } from "../utils/validations";
import { ADD_CUSTOMER, GET_TYPES_CUSTOMERS } from "../helper/url_helper";
import { optionsSnackbarDanger, optionsSnackbarSuccess } from "../../Products/helper/product_helper";
import { useSnackbar } from 'react-simple-snackbar';


export function CreateCustomer() {

    const [activeTab, setActiveTab] = useState("tipo");
    const [isLoading, setIsLoading] = useState(false);
    const [openSnackbarDanger, closeSnackbarDanger] = useSnackbar(optionsSnackbarDanger);
    const [openSnackbarSuccess, closeSnackbarSuccess] = useSnackbar(optionsSnackbarSuccess);
    const [formData, setFormData] = useState({
        typeCustomerId: "",
        basics: {
            name: "",
            lastname: "",
            commercialName: "",
            phone: "",
            email: "",
            documento: "",
        },
        billingData: {
            billingName: "",
            billingLastname: "",
            billingPhone: "",
            billingEmail: "",
            billingDocumento: "",
            billingAddress: "",
            billingCity: "",
            billingPostalCode: "",
            sameAddress: false,
        },
        shippingData: {
            shippingName: "",
            shippingLastname: "",
            shippingPhone: "",
            shippingEmail: "",
            shippingDocumento: "",
            shippingAddress: "",
            shippingCity: "",
            shippingPostalCode: "",
        },
        contacts: [
            {
                contactName: "",
                contactLastname: "",
                contactEmail: "",
                contactPhone: "",
            },
        ],
        customFields: [],
        observations: "",
    });
    const [validationErrors, setValidationErrors] = useState({});
    const [typeCustomers, setTypeCustomers] = useState([]);
    const [isInitialLoading, setIsInitialLoading] = useState(true);

    // Campos personalizados dinámicos
    const [customFields, setCustomFields] = useState([{ id: 1, nombre: "", valor: "" }])

    const handleInputChange = (section, field, value) => {
        setFormData({
            ...formData,
            [section]: {
                ...formData[section],
                [field]: value,
            },
        })
    }

    const handleDirectChange = (field, value) => {
        setFormData({
            ...formData,
            [field]: value,
        })
    }

    const handleContactChange = (index, field, value) => {
        const updatedContactos = [...formData.contacts]
        updatedContactos[index] = {
            ...updatedContactos[index],
            [field]: value,
        }
        setFormData({
            ...formData,
            contacts: updatedContactos,
        })
    }

    const addContact = () => {
        setFormData({
            ...formData,
            contacts: [
                ...formData.contacts,
                {
                    contactName: "",
                    contactLastname: "",
                    contactEmail: "",
                    contactPhone: "",
                },
            ],
        })
    }

    const removeContact = (index) => {
        const updatedContactos = [...formData.contacts]
        updatedContactos.splice(index, 1)
        setFormData({
            ...formData,
            contacts: updatedContactos,
        })
    }

    const handleCustomFieldChange = (index, field, value) => {
        const updatedFields = [...customFields]
        updatedFields[index] = {
            ...updatedFields[index],
            [field]: value,
        }
        setCustomFields(updatedFields)

        // Actualizar también en formData
        const customFieldsObj = {}
        updatedFields.forEach((field) => {
            if (field.nombre) {
                customFieldsObj[field.nombre] = field.valor
            }
        })
        setFormData({
            ...formData,
            camposPersonalizados: customFieldsObj,
        })
    }

    const addCustomField = () => {
        setCustomFields([...customFields, { id: customFields.length + 1, nombre: "", valor: "" }])
    }

    const removeCustomField = (index) => {
        const updatedFields = [...customFields]
        updatedFields.splice(index, 1)
        setCustomFields(updatedFields)
    }

    const handleSameAddressChange = (e) => {
        const isSameAddress = e.target.checked
        setFormData({
            ...formData,
            billingData: {
                ...formData.billingData,
                sameAddress: isSameAddress,
            },
            shippingData: {
                ...formData.shippingData,
                shippingName: isSameAddress
                    ? formData.billingData.billingName
                    : formData.shippingData.shippingName,
                shippingLastname: isSameAddress
                    ? formData.billingData.billingLastname
                    : formData.shippingData.shippingLastname,
                shippingEmail: isSameAddress
                    ? formData.billingData.billingEmail
                    : formData.shippingData.shippingEmail,
                shippingPhone: isSameAddress
                    ? formData.billingData.billingPhone
                    : formData.shippingData.shippingPhone,
                shippingDocumento: isSameAddress
                    ? formData.billingData.billingDocumento
                    : formData.shippingData.shippingDocumento,
                shippingAddress: isSameAddress
                    ? formData.billingData.billingAddress
                    : formData.shippingData.shippingAddress,
                shippingCity: isSameAddress
                    ? formData.billingData.billingCity
                    : formData.shippingData.shippingCity,
                shippingPostalCode: isSameAddress
                    ? formData.billingData.billingPostalCode
                    : formData.shippingData.shippingPostalCode,
            }
        })
    }

    const handleCleanFormData = () => {
        setFormData({
            typeCustomerId: "",
            basics: {
                name: "",
                lastname: "",
                commercialName: "",
                phone: "",
                email: "",
                documento: "",
            },
            billingData: {
                billingName: "",
                billingLastname: "",
                billingPhone: "",
                billingEmail: "",
                billingDocumento: "",
                billingAddress: "",
                billingCity: "",
                billingPostalCode: "",
                sameAddress: false,
            },
            shippingData: {
                shippingName: "",
                shippingLastname: "",
                shippingPhone: "",
                shippingEmail: "",
                shippingDocumento: "",
                shippingAddress: "",
                shippingCity: "",
                shippingPostalCode: "",
            },
            contacts: [
                {
                    contactName: "",
                    contactLastname: "",
                    contactEmail: "",
                    contactPhone: "",
                },
            ],
            customFields: [],
            observations: "",
        });
    }

    const handleGetTypeCustomers = async () => {
        return new Promise(async (resolve, reject) => {
            try {
                let response = await fetch(GET_TYPES_CUSTOMERS, {
                    method: "GET",
                    headers: {
                        "Content-Type": "application/json",
                    },
                });
                if (response && response.status === 200) {
                    let data = await response.json();
                    resolve(data?.data ?? []);
                } else {
                    reject(response?.data);
                }
            } catch (error) {
                console.log(error);
                reject(error);
            }
        })
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        let { name, lastname, email, phone, documento, address, city, postalCode } = formData.basics;
        let { billingName, billingLastname, billingPhone, billingEmail, billingDocumento, billingAddress, billingCity, billingPostalCode } = formData.billingData;
        let { shippingName, shippingLastname, shippingPhone, shippingEmail, shippingDocumento, shippingAddress, shippingCity, shippingPostalCode } = formData.shippingData;
        let { contacts, customFields, observations, typeCustomerId } = formData;
        let payload = {
            name,
            lastname,
            email,
            phone,
            documento,
            address,
            city,
            postalCode,
            billingName,
            billingLastname,
            billingPhone,
            billingEmail,
            billingDocumento,
            billingAddress,
            billingCity,
            billingPostalCode,
            shippingName,
            shippingLastname,
            shippingPhone,
            shippingEmail,
            shippingDocumento,
            shippingAddress,
            shippingCity,
            shippingPostalCode,
            typeCustomerId,
            contacts,
            customFields,
            observations,
        }
        if (!validateBasicInputs(payload, setValidationErrors)) {
            return;
        }

        if (!validateBillingData(payload, setValidationErrors)) {
            return;
        }
        setIsLoading(true);
        try {
            let response = await fetch(ADD_CUSTOMER, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(payload),
            });
            if (response && response.status === 201) {
                openSnackbarSuccess("Cliente creado exitosamente");
                handleCleanFormData();
                setActiveTab("tipo");
            }
        } catch (error) {
            console.log(error);
            openSnackbarDanger('Ocurrió un error :(, intenta más tarde.');
        } finally {
            setIsLoading(false);
        }
    }

    const nextTab = () => {
        const tabs = ["tipo", "datosBasicos", "facturacionEnvio", "contactos", "camposPersonalizados", "observaciones"];
        if (activeTab === "datosBasicos") {
            if (!validateBasicInputs(formData.basics, setValidationErrors)) {
                return;
            }
        }
        const currentIndex = tabs.indexOf(activeTab)
        if (currentIndex < tabs.length - 1) {
            setActiveTab(tabs[currentIndex + 1])
        }
    }

    const prevTab = () => {
        const tabs = ["tipo", "datosBasicos", "facturacionEnvio", "contactos", "camposPersonalizados", "observaciones"]
        const currentIndex = tabs.indexOf(activeTab)
        if (currentIndex > 0) {
            setActiveTab(tabs[currentIndex - 1])
        }
    }

    const handleValidationTab = (tab) => {
        if (activeTab === "datosBasicos") {
            if (!validateBasicInputs(formData.basics, setValidationErrors)) {
                return;
            }
        }
        if (activeTab === "facturacionEnvio") {
            if (!validateBillingData(formData.billingData, setValidationErrors)) {
                return;
            }
        }
        setActiveTab(tab);
    }

    // Función para determinar si un paso está completado
    const isStepCompleted = (step) => {
        switch (step) {
            case "tipo":
                return formData.typeCustomerId !== ""
            case "datosBasicos":
                return formData.basics.name !== "" && formData.basics.lastname !== ""
            case "facturacionEnvio":
                return formData.billingData.billingAddress !== ""
            case "contactos":
                return formData.contacts.length > 0 && formData.contacts[0].contactName !== ""
            default:
                return false
        }
    }
    const tabs = ["tipo", "datosBasicos", "facturacionEnvio", "contactos", "camposPersonalizados", "observaciones"]

    useEffect(() => {
        handleGetTypeCustomers()
            .then(data => {
                setTypeCustomers(data);
            })
            .catch(e => {
                console.log(e);
                openSnackbarDanger('Ocurrió un error al cargar los tipos de clientes, intenta más tarde.');
            })
            .finally(() => {
                setIsInitialLoading(false);
            });
    }, []);

    if (isInitialLoading) {
        return (
            <div className="page-content">
                <ToastContainer closeButton={false} limit={1} />
                <Container fluid>
                    <BreadCrumb title="Crear cliente" pageTitle="Clientes" />
                    <Row>
                        <div className="card-body pt-2 mt-1">
                            <div className="d-flex justify-content-center">
                                <div className="spinner-border text-primary" role="status">
                                    <span className="visually-hidden">Cargando...</span>
                                </div>
                            </div>
                        </div>
                    </Row>
                </Container>
            </div>
        )
    }

    return (
        <Fragment>
            {
                isLoading &&
                <div className="d-flex justify-content-center">
                    <div className="spinner-border text-primary" role="status">
                        <span className="visually-hidden">Cargando...</span>
                    </div>
                </div>
            }
            <div className="page-content">

                <ToastContainer closeButton={false} limit={1} />
                <Container fluid>
                    <BreadCrumb title="Crear cliente" pageTitle="Clientes" />
                    <Row>
                        <div className="card-body pt-2 mt-1">
                            <div style={styles.container}>
                                <div style={styles.mainCard}>
                                    <div style={styles.cardHeader}>
                                        <h2 style={styles.headerTitle}>Crear Nuevo Cliente</h2>
                                    </div>
                                    <div style={{ padding: "1.5rem" }}>
                                        <div style={{ position: "relative", marginBottom: "3rem" }}>
                                            <div style={styles.progressBar}>
                                                <div
                                                    style={{
                                                        ...styles.progressFill,
                                                        width: `${(tabs.indexOf(activeTab) + 1) * 16.66}%`,
                                                    }}
                                                ></div>
                                            </div>

                                            <div style={{ display: "flex", justifyContent: "space-between", position: "relative", marginTop: "-20px" }}>
                                                {tabs.map((tab, index) => (
                                                    <div key={tab} style={{ textAlign: "center" }}>
                                                        <button
                                                            type="button"
                                                            onClick={() => handleValidationTab(tab)}
                                                            style={{
                                                                ...styles.stepButton,
                                                                ...(activeTab === tab
                                                                    ? styles.stepButtonActive
                                                                    : isStepCompleted(tab)
                                                                        ? styles.stepButtonCompleted
                                                                        : styles.stepButtonInactive),
                                                            }}
                                                        >
                                                            {isStepCompleted(tab) ? <CheckCircleIcon size={18} /> : index + 1}
                                                        </button>
                                                        <span
                                                            style={{
                                                                ...styles.stepLabel,
                                                                ...(activeTab === tab ? styles.stepLabelActive : styles.stepLabelInactive),
                                                            }}
                                                        >
                                                            {tab === "tipo" && "Tipo"}
                                                            {tab === "datosBasicos" && "Datos"}
                                                            {tab === "facturacionEnvio" && "Dirección"}
                                                            {tab === "contactos" && "Contactos"}
                                                            {tab === "camposPersonalizados" && "Campos"}
                                                            {tab === "observaciones" && "Notas"}
                                                        </span>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>

                                        <Form onSubmit={handleSubmit}>
                                            <div style={styles.tabsContainer}>
                                                {/* Tipo de Cliente */}
                                                <div
                                                    style={{
                                                        ...styles.tabContent,
                                                        ...(activeTab === "tipo" ? styles.tabContentActive : {}),
                                                    }}
                                                >
                                                    <h4 style={styles.sectionTitle}>Tipo de Cliente</h4>
                                                    <div style={{ display: "flex", flexWrap: "wrap", gap: "1.5rem" }}>
                                                        {
                                                            typeCustomers.length > 0 && (
                                                                typeCustomers
                                                                    .map((typeCustomer, index) => {
                                                                        return (
                                                                            <div key={index} style={{ flex: "1 1 30%", minWidth: "250px" }}>
                                                                                <div
                                                                                    style={{
                                                                                        ...styles.typeCard,
                                                                                        ...(formData.typeCustomerId === typeCustomer?.id ? styles.typeCardActive : {}),
                                                                                    }}
                                                                                    onClick={() => handleDirectChange("typeCustomerId", typeCustomer?._id)}
                                                                                >
                                                                                    <div style={{ textAlign: "center" }}>
                                                                                        <input
                                                                                            type="radio"
                                                                                            id="tipo-premium"
                                                                                            name="tipo"
                                                                                            value={typeCustomer?._id}
                                                                                            checked={formData.typeCustomerId === typeCustomer?._id}
                                                                                            onChange={() => handleDirectChange("typeCustomerId", typeCustomer?._id)}
                                                                                            style={styles.radioInput}
                                                                                        />
                                                                                        <h5
                                                                                            style={{
                                                                                                ...styles.typeCardTitle,
                                                                                                ...(formData.typeCustomerId === typeCustomer?.id ? styles.typeCardTitleActive : {}),
                                                                                            }}
                                                                                        >
                                                                                            {typeCustomer?.name}
                                                                                        </h5>
                                                                                        <p style={styles.typeCardText}>{typeCustomer?.description}</p>
                                                                                    </div>
                                                                                </div>
                                                                            </div>
                                                                        );
                                                                    })
                                                            )

                                                        }
                                                    </div>
                                                </div>

                                                {/* Datos Básicos */}
                                                <div
                                                    style={{
                                                        ...styles.tabContent,
                                                        ...(activeTab === "datosBasicos" ? styles.tabContentActive : {}),
                                                    }}
                                                >
                                                    <h4 style={styles.sectionTitle}>Datos Básicos</h4>
                                                    <div style={styles.sectionCard}>
                                                        <div style={{ padding: "1.5rem" }}>
                                                            <div style={{ display: "flex", flexWrap: "wrap", gap: "1.5rem" }}>
                                                                <div style={{ flex: "1 1 45%", minWidth: "250px" }}>
                                                                    <div style={styles.formGroup}>
                                                                        <label htmlFor="name" style={styles.formLabel}>
                                                                            Nombre
                                                                        </label>
                                                                        <input
                                                                            name="name"
                                                                            type="text"
                                                                            id="name"
                                                                            value={formData.basics.name}
                                                                            onChange={(e) => handleInputChange("basics", "name", e.target.value)}
                                                                            style={styles.formInput}
                                                                        />
                                                                        {validationErrors.name && <span style={{ color: "red" }}>{validationErrors.name}</span>}
                                                                    </div>
                                                                </div>
                                                                <div style={{ flex: "1 1 45%", minWidth: "250px" }}>
                                                                    <div style={styles.formGroup}>
                                                                        <label htmlFor="apellidos" style={styles.formLabel}>
                                                                            Apellidos
                                                                        </label>
                                                                        <input
                                                                            type="text"
                                                                            id="apellidos"
                                                                            value={formData.basics.lastname}
                                                                            onChange={(e) => handleInputChange("basics", "lastname", e.target.value)}
                                                                            style={styles.formInput}
                                                                        />
                                                                        {validationErrors.lastname && <span style={{ color: "red" }}>{validationErrors.lastname}</span>}
                                                                    </div>
                                                                </div>
                                                            </div>

                                                            <div style={{ display: "flex", flexWrap: "wrap", gap: "1.5rem" }}>
                                                                <div style={{ flex: "1 1 45%", minWidth: "250px" }}>
                                                                    <div style={styles.formGroup}>
                                                                        <label htmlFor="email" style={styles.formLabel}>
                                                                            Correo
                                                                        </label>
                                                                        <input
                                                                            type="email"
                                                                            id="email"
                                                                            value={formData.basics.email}
                                                                            onChange={(e) => handleInputChange("basics", "email", e.target.value)}
                                                                            style={styles.formInput}
                                                                        />
                                                                        {validationErrors.email && <span style={{ color: "red" }}>{validationErrors.email}</span>}
                                                                    </div>
                                                                </div>


                                                                <div style={{ flex: "1 1 45%", minWidth: "250px" }}>
                                                                    <div style={styles.formGroup}>
                                                                        <label htmlFor="phone" style={styles.formLabel}>
                                                                            Teléfono
                                                                        </label>
                                                                        <input
                                                                            type="number"
                                                                            id="phone"
                                                                            value={formData.basics.phone}
                                                                            onChange={(e) => handleInputChange("basics", "phone", e.target.value)}
                                                                            style={styles.formInput}
                                                                        />
                                                                        {validationErrors.phone && <span style={{ color: "red" }}>{validationErrors.phone}</span>}
                                                                    </div>
                                                                </div>
                                                            </div>

                                                            <div style={{ display: "flex", flexWrap: "wrap", gap: "1.5rem" }}>
                                                                <div style={{ flex: "1 1 45%", minWidth: "250px" }}>
                                                                    <div style={styles.formGroup}>
                                                                        <label htmlFor="commercialName" style={styles.formLabel}>
                                                                            Empresa
                                                                        </label>
                                                                        <input
                                                                            type="text"
                                                                            id="commercialName"
                                                                            value={formData.basics.commercialName}
                                                                            onChange={(e) => handleInputChange("basics", "commercialName", e.target.value)}
                                                                            style={styles.formInput}
                                                                        />
                                                                    </div>
                                                                </div>
                                                                <div style={{ flex: "1 1 45%", minWidth: "250px" }}>
                                                                    <div style={styles.formGroup}>
                                                                        <label htmlFor="documento" style={styles.formLabel}>
                                                                            No. de Identificación
                                                                        </label>
                                                                        <input
                                                                            type="number"
                                                                            id="documento"
                                                                            value={formData.basics.documento}
                                                                            onChange={(e) => handleInputChange("basics", "documento", e.target.value)}
                                                                            style={styles.formInput}
                                                                        />
                                                                        {validationErrors.documento && <span style={{ color: "red" }}>{validationErrors.documento}</span>}
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>

                                                {/* Facturación y Envío */}
                                                <div
                                                    style={{
                                                        ...styles.tabContent,
                                                        ...(activeTab === "facturacionEnvio" ? styles.tabContentActive : {}),
                                                    }}
                                                >
                                                    <h4 style={styles.sectionTitle}>Datos para Facturación y Envío</h4>
                                                    <div style={styles.sectionCard}>
                                                        <div style={{ padding: "1.5rem" }}>
                                                            <h5 style={{ ...styles.sectionTitle, fontSize: "1.1rem", marginBottom: "1rem" }}>
                                                                Datos de Facturación
                                                            </h5>

                                                            <div style={{ display: "flex", flexWrap: "wrap", gap: "1.5rem" }}>
                                                                <div style={{ flex: "1 1 30%", minWidth: "200px" }}>
                                                                    <div style={styles.formGroup}>
                                                                        <label htmlFor="billingName" style={styles.formLabel}>
                                                                            Nombre
                                                                        </label>
                                                                        <input
                                                                            type="text"
                                                                            id="ciudadFactubillingNameracion"
                                                                            value={formData.billingData.billingName}
                                                                            onChange={(e) => handleInputChange("billingData", "billingName", e.target.value)}
                                                                            style={styles.formInput}
                                                                        />
                                                                        {validationErrors.billingName && <span style={{ color: "red" }}>{validationErrors.billingName}</span>}
                                                                    </div>
                                                                </div>
                                                                <div style={{ flex: "1 1 30%", minWidth: "200px" }}>
                                                                    <div style={styles.formGroup}>
                                                                        <label htmlFor="billingLastname" style={styles.formLabel}>
                                                                            Apellidos
                                                                        </label>
                                                                        <input
                                                                            type="text"
                                                                            id="billingLastname"
                                                                            value={formData.billingData.billingLastname}
                                                                            onChange={(e) => handleInputChange("billingData", "billingLastname", e.target.value)}
                                                                            style={styles.formInput}
                                                                        />
                                                                        {validationErrors.billingLastname && <span style={{ color: "red" }}>{validationErrors.billingLastname}</span>}
                                                                    </div>
                                                                </div>
                                                            </div>

                                                            <div style={{ display: "flex", flexWrap: "wrap", gap: "1.5rem" }}>
                                                                <div style={{ flex: "1 1 30%", minWidth: "200px" }}>
                                                                    <div style={styles.formGroup}>
                                                                        <label htmlFor="billingPhone" style={styles.formLabel}>
                                                                            Teléfono
                                                                        </label>
                                                                        <input
                                                                            type="number"
                                                                            id="billingPhone"
                                                                            value={formData.billingData.billingPhone}
                                                                            onChange={(e) => handleInputChange("billingData", "billingPhone", e.target.value)}
                                                                            style={styles.formInput}
                                                                        />
                                                                        {validationErrors.billingPhone && <span style={{ color: "red" }}>{validationErrors.billingPhone}</span>}
                                                                    </div>
                                                                </div>
                                                                <div style={{ flex: "1 1 30%", minWidth: "200px" }}>
                                                                    <div style={styles.formGroup}>
                                                                        <label htmlFor="billingEmail" style={styles.formLabel}>
                                                                            Correo
                                                                        </label>
                                                                        <input
                                                                            type="email"
                                                                            id="billingEmail"
                                                                            value={formData.billingData.billingEmail}
                                                                            onChange={(e) => handleInputChange("billingData", "billingEmail", e.target.value)}
                                                                            style={styles.formInput}
                                                                        />
                                                                        {validationErrors.billingEmail && <span style={{ color: "red" }}>{validationErrors.billingEmail}</span>}
                                                                    </div>
                                                                </div>
                                                            </div>

                                                            <div style={{ display: "flex", flexWrap: "wrap", gap: "1.5rem" }}>
                                                                <div style={{ flex: "1 1 30%", minWidth: "200px" }}>
                                                                    <div style={styles.formGroup}>
                                                                        <label htmlFor="billingDocumento" style={styles.formLabel}>
                                                                            Documento
                                                                        </label>
                                                                        <input
                                                                            type="number"
                                                                            id="billingDocumento"
                                                                            value={formData.billingData.billingDocumento}
                                                                            onChange={(e) => handleInputChange("billingData", "billingDocumento", e.target.value)}
                                                                            style={styles.formInput}
                                                                        />
                                                                        {validationErrors.billingDocumento && <span style={{ color: "red" }}>{validationErrors.billingDocumento}</span>}
                                                                    </div>
                                                                </div>
                                                                <div style={{ flex: "1 1 30%", minWidth: "200px" }}>
                                                                    <div style={styles.formGroup}>
                                                                        <label htmlFor="billingAddress" style={styles.formLabel}>
                                                                            Dirección
                                                                        </label>
                                                                        <input
                                                                            type="text"
                                                                            id="billingAddress"
                                                                            value={formData.billingData.billingAddress}
                                                                            onChange={(e) => handleInputChange("billingData", "billingAddress", e.target.value)}
                                                                            style={styles.formInput}
                                                                        />
                                                                        {validationErrors.billingAddress && <span style={{ color: "red" }}>{validationErrors.billingAddress}</span>}
                                                                    </div>
                                                                </div>
                                                            </div>

                                                            <div style={{ display: "flex", flexWrap: "wrap", gap: "1.5rem" }}>
                                                                <div style={{ flex: "1 1 30%", minWidth: "200px" }}>
                                                                    <div style={styles.formGroup}>
                                                                        <label htmlFor="billingCity" style={styles.formLabel}>
                                                                            Ciudad
                                                                        </label>
                                                                        <input
                                                                            type="text"
                                                                            id="billingCity"
                                                                            value={formData.billingData.billingCity}
                                                                            onChange={(e) => handleInputChange("billingData", "billingCity", e.target.value)}
                                                                            style={styles.formInput}
                                                                        />
                                                                        {validationErrors.billingCity && <span style={{ color: "red" }}>{validationErrors.billingCity}</span>}
                                                                    </div>
                                                                </div>
                                                                <div style={{ flex: "1 1 30%", minWidth: "200px" }}>
                                                                    <div style={styles.formGroup}>
                                                                        <label htmlFor="billingPostalCode" style={styles.formLabel}>
                                                                            Código Postal
                                                                        </label>
                                                                        <input
                                                                            type="text"
                                                                            id="billingPostalCode"
                                                                            value={formData.billingData.billingPostalCode}
                                                                            onChange={(e) =>
                                                                                handleInputChange("billingData", "billingPostalCode", e.target.value)
                                                                            }
                                                                            style={styles.formInput}
                                                                        />
                                                                        {validationErrors.billingPostalCode && <span style={{ color: "red" }}>{validationErrors.billingPostalCode}</span>}
                                                                    </div>
                                                                </div>
                                                            </div>

                                                            <div style={{ display: "flex", alignItems: "center", marginBottom: "1.5rem", marginTop: "1rem" }}>
                                                                <input
                                                                    className="form-check-input cursor-pointer"
                                                                    type="checkbox"
                                                                    id="sameAddress"
                                                                    checked={formData.billingData.sameAddress}
                                                                    onChange={handleSameAddressChange}
                                                                    style={styles.formCheckbox}
                                                                />
                                                                <label htmlFor="sameAddress" style={{ ...styles.formLabel, margin: 0, cursor: "pointer" }}>
                                                                    La dirección de envío es la misma que la de facturación
                                                                </label>
                                                            </div>

                                                            {!formData.billingData.sameAddress && (
                                                                <>
                                                                    <h5 style={{ ...styles.sectionTitle, fontSize: "1.1rem", marginBottom: "1rem" }}>
                                                                        Datos de Envío
                                                                    </h5>

                                                                    <div style={{ display: "flex", flexWrap: "wrap", gap: "1.5rem" }}>
                                                                        <div style={{ flex: "1 1 30%", minWidth: "200px" }}>
                                                                            <div style={styles.formGroup}>
                                                                                <label htmlFor="shippingName" style={styles.formLabel}>
                                                                                    Nombre
                                                                                </label>
                                                                                <input
                                                                                    type="text"
                                                                                    id="shippingName"
                                                                                    value={formData.shippingData.shippingName}
                                                                                    onChange={(e) => handleInputChange("shippingData", "shippingName", e.target.value)}
                                                                                    style={styles.formInput}
                                                                                />
                                                                            </div>
                                                                        </div>
                                                                        <div style={{ flex: "1 1 30%", minWidth: "200px" }}>
                                                                            <div style={styles.formGroup}>
                                                                                <label htmlFor="shippingLastname" style={styles.formLabel}>
                                                                                    Apellidos
                                                                                </label>
                                                                                <input
                                                                                    type="text"
                                                                                    id="shippingLastname"
                                                                                    value={formData.shippingData.shippingLastname}
                                                                                    onChange={(e) =>
                                                                                        handleInputChange("shippingData", "shippingLastname", e.target.value)
                                                                                    }
                                                                                    style={styles.formInput}
                                                                                />
                                                                            </div>
                                                                        </div>

                                                                    </div>

                                                                    <div style={{ display: "flex", flexWrap: "wrap", gap: "1.5rem" }}>
                                                                        <div style={{ flex: "1 1 30%", minWidth: "200px" }}>
                                                                            <div style={styles.formGroup}>
                                                                                <label htmlFor="shippingPhone" style={styles.formLabel}>
                                                                                    Teléfono
                                                                                </label>
                                                                                <input
                                                                                    type="number"
                                                                                    id="shippingPhone"
                                                                                    value={formData.shippingData.shippingPhone}
                                                                                    onChange={(e) => handleInputChange("shippingData", "shippingPhone", e.target.value)}
                                                                                    style={styles.formInput}
                                                                                />
                                                                            </div>
                                                                        </div>
                                                                        <div style={{ flex: "1 1 30%", minWidth: "200px" }}>
                                                                            <div style={styles.formGroup}>
                                                                                <label htmlFor="shippingEmail" style={styles.formLabel}>
                                                                                    Correo
                                                                                </label>
                                                                                <input
                                                                                    type="email"
                                                                                    id="shippingEmail"
                                                                                    value={formData.shippingData.shippingEmail}
                                                                                    onChange={(e) =>
                                                                                        handleInputChange("shippingData", "shippingEmail", e.target.value)
                                                                                    }
                                                                                    style={styles.formInput}
                                                                                />
                                                                            </div>
                                                                        </div>

                                                                    </div>

                                                                    <div style={{ display: "flex", flexWrap: "wrap", gap: "1.5rem" }}>
                                                                        <div style={{ flex: "1 1 30%", minWidth: "200px" }}>
                                                                            <div style={styles.formGroup}>
                                                                                <label htmlFor="shippingDocumento" style={styles.formLabel}>
                                                                                    Documento
                                                                                </label>
                                                                                <input
                                                                                    type="text"
                                                                                    id="shippingDocumento"
                                                                                    value={formData.shippingData.shippingDocumento}
                                                                                    onChange={(e) => handleInputChange("shippingData", "shippingDocumento", e.target.value)}
                                                                                    style={styles.formInput}
                                                                                />
                                                                            </div>
                                                                        </div>
                                                                        <div style={{ flex: "1 1 30%", minWidth: "200px" }}>
                                                                            <div style={styles.formGroup}>
                                                                                <label htmlFor="shippingAddress" style={styles.formLabel}>
                                                                                    Dirección
                                                                                </label>
                                                                                <input
                                                                                    type="text"
                                                                                    id="shippingAddress"
                                                                                    value={formData.shippingData.shippingAddress}
                                                                                    onChange={(e) =>
                                                                                        handleInputChange("shippingData", "shippingAddress", e.target.value)
                                                                                    }
                                                                                    style={styles.formInput}
                                                                                />
                                                                            </div>
                                                                        </div>

                                                                    </div>

                                                                    <div style={{ display: "flex", flexWrap: "wrap", gap: "1.5rem" }}>
                                                                        <div style={{ flex: "1 1 30%", minWidth: "200px" }}>
                                                                            <div style={styles.formGroup}>
                                                                                <label htmlFor="shippingCity" style={styles.formLabel}>
                                                                                    Ciudad
                                                                                </label>
                                                                                <input
                                                                                    type="text"
                                                                                    id="shippingCity"
                                                                                    value={formData.shippingData.shippingCity}
                                                                                    onChange={(e) => handleInputChange("shippingData", "shippingCity", e.target.value)}
                                                                                    style={styles.formInput}
                                                                                />
                                                                            </div>
                                                                        </div>
                                                                        <div style={{ flex: "1 1 30%", minWidth: "200px" }}>
                                                                            <div style={styles.formGroup}>
                                                                                <label htmlFor="shippingPostalCode" style={styles.formLabel}>
                                                                                    Código Postal
                                                                                </label>
                                                                                <input
                                                                                    type="text"
                                                                                    id="shippingPostalCode"
                                                                                    value={formData.shippingData.shippingPostalCode}
                                                                                    onChange={(e) =>
                                                                                        handleInputChange("shippingData", "shippingPostalCode", e.target.value)
                                                                                    }
                                                                                    style={styles.formInput}
                                                                                />
                                                                            </div>
                                                                        </div>

                                                                    </div>

                                                                </>
                                                            )}
                                                        </div>
                                                    </div>
                                                </div>

                                                {/* Contactos */}
                                                <div
                                                    style={{
                                                        ...styles.tabContent,
                                                        ...(activeTab === "contactos" ? styles.tabContentActive : {}),
                                                    }}
                                                >
                                                    <div
                                                        style={{
                                                            display: "flex",
                                                            justifyContent: "space-between",
                                                            alignItems: "center",
                                                            marginBottom: "1.5rem",
                                                        }}
                                                    >
                                                        <h4 style={styles.sectionTitle}>Contactos</h4>
                                                        <button type="button" onClick={addContact} style={{ ...styles.button, ...styles.primaryButton }}>
                                                            <PlusCircleIcon size={18} style={{ marginRight: "0.5rem" }} /> Añadir contacto
                                                        </button>
                                                    </div>

                                                    {formData.contacts.map((contacto, index) => (
                                                        <div key={index} style={styles.contactCard}>
                                                            <div style={{ padding: "1.5rem" }}>
                                                                <div style={styles.contactHeader}>
                                                                    <h5 style={styles.contactTitle}>Contacto {index + 1}</h5>
                                                                    {formData.contacts.length > 1 && (
                                                                        <button
                                                                            type="button"
                                                                            onClick={() => removeContact(index)}
                                                                            style={{ ...styles.button, ...styles.dangerButton }}
                                                                        >
                                                                            <TrashIcon size={16} style={{ marginRight: "0.5rem" }} /> Eliminar
                                                                        </button>
                                                                    )}
                                                                </div>

                                                                <div style={{ display: "flex", flexWrap: "wrap", gap: "1.5rem" }}>
                                                                    <div style={{ flex: "1 1 45%", minWidth: "250px" }}>
                                                                        <div style={styles.formGroup}>
                                                                            <label htmlFor={`nombre-${index}`} style={styles.formLabel}>
                                                                                Nombre
                                                                            </label>
                                                                            <input
                                                                                type="text"
                                                                                id={`nombre-${index}`}
                                                                                value={contacto.contactName}
                                                                                onChange={(e) => handleContactChange(index, "contactName", e.target.value)}
                                                                                style={styles.formInput}
                                                                            />
                                                                        </div>
                                                                    </div>
                                                                    <div style={{ flex: "1 1 45%", minWidth: "250px" }}>
                                                                        <div style={styles.formGroup}>
                                                                            <label htmlFor={`apellidos-${index}`} style={styles.formLabel}>
                                                                                Apellidos
                                                                            </label>
                                                                            <input
                                                                                type="text"
                                                                                id={`apellidos-${index}`}
                                                                                value={contacto.contactLastname}
                                                                                onChange={(e) => handleContactChange(index, "contactLastname", e.target.value)}
                                                                                style={styles.formInput}
                                                                            />
                                                                        </div>
                                                                    </div>
                                                                </div>

                                                                <div style={{ display: "flex", flexWrap: "wrap", gap: "1.5rem" }}>
                                                                    <div style={{ flex: "1 1 45%", minWidth: "250px" }}>
                                                                        <div style={styles.formGroup}>
                                                                            <label htmlFor={`email-${index}`} style={styles.formLabel}>
                                                                                Email
                                                                            </label>
                                                                            <input
                                                                                type="email"
                                                                                id={`email-${index}`}
                                                                                value={contacto.contactEmail}
                                                                                onChange={(e) => handleContactChange(index, "contactEmail", e.target.value)}
                                                                                style={styles.formInput}
                                                                            />
                                                                        </div>
                                                                    </div>
                                                                    <div style={{ flex: "1 1 45%", minWidth: "250px" }}>
                                                                        <div style={styles.formGroup}>
                                                                            <label htmlFor={`telefono-${index}`} style={styles.formLabel}>
                                                                                Teléfono
                                                                            </label>
                                                                            <input
                                                                                type="tel"
                                                                                id={`telefono-${index}`}
                                                                                value={contacto.contactPhone}
                                                                                onChange={(e) => handleContactChange(index, "contactPhone", e.target.value)}
                                                                                style={styles.formInput}
                                                                            />
                                                                        </div>
                                                                    </div>
                                                                </div>


                                                            </div>
                                                        </div>
                                                    ))}
                                                </div>

                                                {/* Campos Personalizados */}
                                                <div
                                                    style={{
                                                        ...styles.tabContent,
                                                        ...(activeTab === "camposPersonalizados" ? styles.tabContentActive : {}),
                                                    }}
                                                >
                                                    <div
                                                        style={{
                                                            display: "flex",
                                                            justifyContent: "space-between",
                                                            alignItems: "center",
                                                            marginBottom: "1.5rem",
                                                        }}
                                                    >
                                                        <h4 style={styles.sectionTitle}>Campos Personalizados</h4>
                                                        <button type="button" onClick={addCustomField} style={{ ...styles.button, ...styles.primaryButton }}>
                                                            <PlusCircleIcon size={18} style={{ marginRight: "0.5rem" }} /> Añadir campo
                                                        </button>
                                                    </div>

                                                    <div style={styles.sectionCard}>
                                                        <div style={{ padding: "1.5rem" }}>
                                                            {customFields.map((field, index) => (
                                                                <div key={field.id}>
                                                                    <div style={styles.customFieldRow}>
                                                                        <div style={{ flex: "5", marginRight: "1rem" }}>
                                                                            <div style={styles.formGroup}>
                                                                                <label htmlFor={`fieldName-${field.id}`} style={styles.formLabel}>
                                                                                    Nombre del campo
                                                                                </label>
                                                                                <input
                                                                                    type="text"
                                                                                    id={`fieldName-${field.id}`}
                                                                                    value={field.nombre}
                                                                                    onChange={(e) => handleCustomFieldChange(index, "nombre", e.target.value)}
                                                                                    placeholder="Ej: Sitio web, Redes sociales, etc."
                                                                                    style={styles.formInput}
                                                                                />
                                                                            </div>
                                                                        </div>
                                                                        <div style={{ flex: "5", marginRight: "1rem" }}>
                                                                            <div style={styles.formGroup}>
                                                                                <label htmlFor={`fieldValue-${field.id}`} style={styles.formLabel}>
                                                                                    Valor
                                                                                </label>
                                                                                <input
                                                                                    type="text"
                                                                                    id={`fieldValue-${field.id}`}
                                                                                    value={field.valor}
                                                                                    onChange={(e) => handleCustomFieldChange(index, "valor", e.target.value)}
                                                                                    style={styles.formInput}
                                                                                />
                                                                            </div>
                                                                        </div>
                                                                        <div style={{ flex: "1", alignSelf: "flex-end" }}>
                                                                            <button
                                                                                type="button"
                                                                                onClick={() => removeCustomField(index)}
                                                                                style={{ ...styles.button, ...styles.dangerButton, padding: "0.75rem" }}
                                                                            >
                                                                                <TrashIcon size={18} />
                                                                            </button>
                                                                        </div>
                                                                    </div>
                                                                    {index < customFields.length - 1 && <hr style={styles.divider} />}
                                                                </div>
                                                            ))}
                                                        </div>
                                                    </div>
                                                </div>

                                                {/* Observaciones */}
                                                <div
                                                    style={{
                                                        ...styles.tabContent,
                                                        ...(activeTab === "observaciones" ? styles.tabContentActive : {}),
                                                    }}
                                                >
                                                    <h4 style={styles.sectionTitle}>Observaciones</h4>
                                                    <div style={styles.sectionCard}>
                                                        <div style={{ padding: "1.5rem" }}>
                                                            <div style={styles.formGroup}>
                                                                <label htmlFor="observations" style={styles.formLabel}>
                                                                    Notas adicionales sobre el cliente
                                                                </label>
                                                                <textarea
                                                                    id="observations"
                                                                    rows="6"
                                                                    value={formData.observations}
                                                                    onChange={(e) => handleDirectChange("observations", e.target.value)}
                                                                    placeholder="Añade cualquier información relevante sobre el cliente..."
                                                                    style={styles.formTextarea}
                                                                />
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>

                                            <div style={styles.footerButtons}>
                                                <button
                                                    type="button"
                                                    onClick={prevTab}
                                                    disabled={activeTab === "tipo"}
                                                    style={{
                                                        ...styles.button,
                                                        ...styles.secondaryButton,
                                                        opacity: activeTab === "tipo" ? 0.6 : 1,
                                                        cursor: activeTab === "tipo" ? "not-allowed" : "pointer",
                                                    }}
                                                >
                                                    <ChevronLeftIcon size={18} style={{ marginRight: "0.5rem" }} /> Anterior
                                                </button>

                                                {activeTab === "observaciones" ? (
                                                    <button type="submit" style={{ ...styles.button, ...styles.successButton }}>
                                                        <i className="ri-save-line mx-2"></i> Guardar Cliente
                                                    </button>
                                                ) : (
                                                    <button type="button" onClick={nextTab} style={{ ...styles.button, ...styles.primaryButton }}>
                                                        Siguiente <ChevronRightIcon size={18} style={{ marginLeft: "0.5rem" }} />
                                                    </button>
                                                )}
                                            </div>
                                        </Form>
                                    </div>
                                </div>
                            </div>

                        </div>
                    </Row>
                </Container>
            </div >
        </Fragment>
    )
};