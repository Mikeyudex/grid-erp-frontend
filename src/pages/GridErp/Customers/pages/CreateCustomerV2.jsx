"use client"

import { Fragment, useEffect, useState } from "react"
import { Form, Button, Row, Col, Input, Alert } from "reactstrap"
import { useNavigate } from "react-router-dom";
import { Save, User, MapPin, Phone, Settings, FileText, PlusCircle, Trash2 } from "lucide-react";
import { useSnackbar } from 'react-simple-snackbar';
import Select from 'react-select';

import TopLayoutPage from "../../../../Layouts/TopLayoutPage";
import { CustomerHelper } from "../helper/customer-helper";
import { FloatingInput } from "../../../../Components/Common/FloatingInput";
import { CollapsibleSection } from "../../../../Components/Common/CollapsibleSection";
import { validateBasicInputs, validateIsSameAddress } from "../utils/validations";
import { ADD_CUSTOMER } from "../helper/url_helper";
import { optionsSnackbarDanger, optionsSnackbarSuccess } from "../../Products/helper/product_helper";
import { citys } from "../../../../helpers/citys";


const customerHelper = new CustomerHelper();

export default function CreateClientV2({
    mode = "create",
    clientId = null,
    initialData = null,
    onSubmit,
    onCancel,
}) {
    document.title = "Crear cliente | Quality Erp";

    const [error, setError] = useState("")
    const [success, setSuccess] = useState("")
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        typeCustomerId: "",
        basics: {
            typeOfCustomer: "",
            typeOfDocument: "",
            name: "",
            lastname: "",
            commercialName: "",
            phone: "",
            email: "",
            documento: "",
            city: "",
            address: "",
            postalCode: "",
            sameAddress: true,
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
                contactCharge: "",
            },
        ],
        customFields: [],
        observations: "",
    });
    const [typeCustomers, setTypeCustomers] = useState([]);
    const [typeClientsOptions, setTypeClientsOptions] = useState([]);
    const [typeDocumentsOptions, setTypeDocumentsOptions] = useState([]);
    const [typeCustomerName, setTypeCustomerName] = useState("");
    const [customFields, setCustomFields] = useState([{ id: 1, nombre: "", valor: "" }]);
    const [cities, setCities] = useState([]);
    const [isInitialLoading, setIsInitialLoading] = useState(true);
    const [validationErrors, setValidationErrors] = useState({});
    const [openSnackbarDanger, closeSnackbarDanger] = useSnackbar(optionsSnackbarDanger);
    const [openSnackbarSuccess, closeSnackbarSuccess] = useSnackbar(optionsSnackbarSuccess);
    const [isLoading, setIsLoading] = useState(false);

    // Estados para controlar las secciones colapsables
    const [openSections, setOpenSections] = useState({
        tipo: true,
        datosBasicos: true,
        facturacionEnvio: false,
        contactos: false,
        camposPersonalizados: false,
        observaciones: false,
    });

    // Cargar datos del cliente si estamos en modo edición
    useEffect(() => {
        if (mode === "edit" && (clientId || initialData)) {
            loadClientData();
        }
    }, [mode, clientId, initialData]);

    const handleGetCities = () => {
        let citiesOptions = citys.map((c) => ({ value: c.name, label: c.toponymName }));
        setCities(citiesOptions);
    };

    const loadClientData = async () => {
        setError("");
        setSuccess("");
        try {
            const citiesOptions = citys.map((c) => ({ value: c.name, label: c.toponymName }));
            let customerData = await customerHelper.getCustomerById(clientId);
            if (!customerData) {
                setError("No se ha seleccionado ningun cliente");
                return;
            }
            let basicCity = citiesOptions.find((c) => c.value === customerData?.city);
            let shippingCity = citiesOptions.find((c) => c.value === customerData?.shippingCity);

            setFormData({
                typeCustomerId: customerData?.typeCustomerId?._id,
                basics: {
                    typeOfCustomer: customerData?.typeOfCustomer?._id,
                    typeOfDocument: customerData?.typeOfDocument?._id,
                    name: customerData?.name,
                    lastname: customerData?.lastname,
                    commercialName: customerData?.commercialName,
                    phone: customerData?.phone,
                    email: customerData?.email,
                    documento: customerData?.documento,
                    city: basicCity,
                    address: customerData?.address,
                    postalCode: customerData?.postalCode,
                    sameAddress: validateIsSameAddress(customerData),
                },
                shippingData: {
                    shippingName: customerData?.shippingName,
                    shippingLastname: customerData?.shippingLastname,
                    shippingPhone: customerData?.shippingPhone,
                    shippingEmail: customerData?.shippingEmail,
                    shippingDocumento: customerData?.shippingDocumento,
                    shippingAddress: customerData?.shippingAddress,
                    shippingCity: shippingCity,
                    shippingPostalCode: customerData?.shippingPostalCode,
                },
                contacts: customerData?.contacts,
                customFields: customerData?.customFields,
                observations: customerData?.observations
            });
            // Convertir campos personalizados a formato del formulario
            if (customerData?.customFields) {
                const customFieldsArray = Object.entries(customerData.customFields).map(([nombre, valor], index) => ({
                    id: index + 1,
                    nombre,
                    valor,
                }))
                setCustomFields(customFieldsArray.length > 0 ? customFieldsArray : [{ id: 1, nombre: "", valor: "" }])
            }
        } catch (error) {
            setError("Error al cargar los datos del cliente")
            console.error("Error loading client data:", error)
        } finally {
            setIsInitialLoading(false);
        }
    };

    const toggleSection = (section) => {
        setOpenSections((prev) => ({
            ...prev,
            [section]: !prev[section],
        }))
    }

    const handleInputChange = (section, field, value) => {
        setFormData({
            ...formData,
            [section]: {
                ...formData[section],
                [field]: value,
            },
        });
    };

    const handleGetPostalCodeFromCity = async (city) => {
        try {
            let postalCode = await customerHelper.getPostalCodeFromCity(city);
            return postalCode;
        } catch (error) {
            console.log(error);
            return null;
        }
    };

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
                    contactCharge: "",
                }
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
            basics: {
                ...formData.basics,
                sameAddress: isSameAddress,
            },
            shippingData: {
                ...formData.shippingData,
                shippingName: isSameAddress
                    ? formData.basics.name
                    : formData.shippingData.shippingName,
                shippingLastname: isSameAddress
                    ? formData.basics.lastname
                    : formData.shippingData.shippingLastname,
                shippingEmail: isSameAddress
                    ? formData.basics.email
                    : formData.shippingData.shippingEmail,
                shippingPhone: isSameAddress
                    ? formData.basics.phone
                    : formData.shippingData.shippingPhone,
                shippingDocumento: isSameAddress
                    ? formData.basics.documento
                    : formData.shippingData.shippingDocumento,
                shippingAddress: isSameAddress
                    ? formData.basics.address
                    : formData.shippingData.shippingAddress,
                shippingCity: isSameAddress
                    ? formData.basics.city
                    : formData.shippingData.shippingCity,
                shippingPostalCode: isSameAddress
                    ? formData.basics.postalCode
                    : formData.shippingData.shippingPostalCode
            }
        })
    }

    const handleClearForm = () => {
        setFormData({
            typeCustomerId: "",
            basics: {
                typeOfCustomer: "",
                typeOfDocument: "",
                name: "",
                lastname: "",
                commercialName: "",
                phone: "",
                email: "",
                documento: "",
                city: "",
                address: "",
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
                    contactCharge: "",
                },
            ],
            customFields: [],
            observations: "",
        })
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            setValidationErrors({});
            let { name, lastname, email, phone, documento, address, city, postalCode, commercialName, typeOfCustomer, typeOfDocument } = formData.basics;
            let { shippingName, shippingLastname, shippingPhone, shippingEmail, shippingDocumento, shippingAddress, shippingCity, shippingPostalCode } = formData.shippingData;
            let { contacts, customFields, observations, typeCustomerId } = formData;
            name = name.toUpperCase();
            lastname = lastname.toUpperCase();
            commercialName = commercialName.toUpperCase();
            city = city['value'];
            shippingCity = shippingCity['value'];

            postalCode = await handleGetPostalCodeFromCity(city);
            shippingPostalCode = await handleGetPostalCodeFromCity(shippingCity);

            let payload = {
                typeOfCustomer,
                typeOfDocument,
                typeCustomerId,
                name,
                lastname,
                email,
                phone,
                documento,
                address,
                city,
                postalCode,
                commercialName,
                shippingName,
                shippingLastname,
                shippingPhone,
                shippingEmail,
                shippingDocumento,
                shippingAddress,
                shippingCity,
                shippingPostalCode,
                contacts,
                customFields,
                observations,
            }

            if (!typeCustomerId) {
                setValidationErrors({ typeCustomerId: "La categoría de cliente es obligatorio" });
                return;
            }

            if (!validateBasicInputs(payload, setValidationErrors)) {
                return;
            }
            setIsLoading(true);
            setError("");
            setSuccess("");

            if (onSubmit) {
                await onSubmit(payload);
                setSuccess(`Cliente ${mode === "edit" ? "actualizado" : "creado"} exitosamente`)
                openSnackbarSuccess("Cliente actualizado exitosamente");
                handleClearForm();
                return;
            } else {
                let response = await fetch(ADD_CUSTOMER, {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify(payload),
                });
                if (response && response.status === 201) {
                    setSuccess(`Cliente ${mode === "edit" ? "actualizado" : "creado"} exitosamente`)
                    openSnackbarSuccess("Cliente creado exitosamente");
                    handleClearForm();
                }
            }
        } catch (error) {
            openSnackbarDanger('Ocurrió un error :(, intenta más tarde.');
            setError(`Error al ${mode === "edit" ? "actualizar" : "crear"} el cliente`)
            console.error("Error submitting form:", error)
        } finally {
            setIsLoading(false);
        }
    };

    const handleCancel = () => {
        if (onCancel) {
            onCancel()
        } else {
            return navigate('/customers/list-v2');
        }
    }

    useEffect(() => {
        let getTypeOfClients = async () => {
            let response = await customerHelper.getTypeOfClients();
            return response;
        };

        let getTypeOfDocuments = async () => {
            let response = await customerHelper.getTypeOfDocuments();
            return response;
        };

        let getTypeCustomers = async () => {
            let response = await customerHelper.getTypesCustomer();
            return response;
        };

        handleGetCities();

        Promise.all([getTypeOfClients(), getTypeOfDocuments(), getTypeCustomers()])
            .then(data => {
                setTypeClientsOptions(data[0].map(item => ({ ...item, label: item.name, value: item._id })));
                setTypeDocumentsOptions(data[1].map(item => ({ ...item, label: item.name, value: item._id })));
                setTypeCustomers(data[2]);

            })
            .catch(e => {
                console.log(e);
                openSnackbarDanger('Ocurrió un error al cargar los datos, intenta más tarde.');
            })
            .finally(() => {
                setIsInitialLoading(false);
            });
    }, []);

    if (isInitialLoading) {
        return (
            <TopLayoutPage
                title={mode === "edit" ? "Actualizar cliente" : "Crear cliente"}
                pageTitle="Clientes"
                children={
                    <Row>
                        <div className="card-body pt-2 mt-1">
                            <div className="d-flex justify-content-center">
                                <div className="spinner-border text-primary" role="status">
                                    <span className="visually-hidden">Cargando...</span>
                                </div>
                            </div>
                        </div>
                    </Row>
                }
            />
        )
    }

    return (
        <>
            <style jsx>{`
        .floating-input-container {
          position: relative;
          margin-bottom: 1.5rem;
        }

        .floating-input {
          width: 100%;
          padding: 1rem 0.75rem 0.5rem 0.75rem;
          border: 1px solid #ced4da;
          border-radius: 0.375rem;
          font-size: 1rem;
          background-color: #fff;
          transition: all 0.2s ease-in-out;
        }

        .floating-input:focus {
          outline: none;
          border-color: #0d6efd;
          box-shadow: 0 0 0 0.2rem rgba(13, 110, 253, 0.25);
        }

        .floating-label {
          position: absolute;
          left: 0.75rem;
          top: 50%;
          transform: translateY(-50%);
          background-color: #fff;
          padding: 0 0.25rem;
          color: #6c757d;
          font-size: 1rem;
          transition: all 0.2s ease-in-out;
          pointer-events: none;
        }

        .floating-input:focus + .floating-label,
        .floating-input.has-value + .floating-label {
          top: 0;
          transform: translateY(-50%);
          font-size: 0.75rem;
          color: #0d6efd;
          font-weight: 500;
        }

        .section-card {
          border: 1px solid #e9ecef;
          box-shadow: 0 2px 4px rgba(0,0,0,0.04);
        }

        .section-header {
          border-bottom: 1px solid #e9ecef;
          transition: background-color 0.2s ease;
        }

        .section-header:hover {
          background-color: #f8f9fa;
        }

        .section-title {
          color: #333;
          font-weight: 600;
        }

        .type-option {
          border: 2px solid #e9ecef;
          border-radius: 0.5rem;
          padding: 1.5rem;
          cursor: pointer;
          transition: all 0.2s ease;
          height: 100%;
        }

        .type-option:hover {
          border-color: #0d6efd;
          transform: translateY(-2px);
          box-shadow: 0 4px 8px rgba(0,0,0,0.1);
        }

        .type-option.selected {
          border-color: #0d6efd;
          background-color: #f8f9ff;
        }

        .type-option input[type="radio"] {
          transform: scale(1.2);
        }

        .contact-card {
          border: 1px solid #e9ecef;
          border-radius: 0.5rem;
          padding: 1.5rem;
          margin-bottom: 1rem;
          background-color: #f8f9fa;
        }

        .custom-field-row {
          background-color: #f8f9fa;
          border-radius: 0.375rem;
          padding: 1rem;
          margin-bottom: 1rem;
        }

        .btn-floating {
          position: fixed;
          bottom: 2rem;
          right: 2rem;
          width: 60px;
          height: 60px;
          border-radius: 50%;
          box-shadow: 0 4px 12px rgba(0,0,0,0.15);
          z-index: 1000;
        }

        @media (max-width: 768px) {
          .floating-input {
            padding: 0.875rem 0.75rem 0.375rem 0.75rem;
          }
          
          .btn-floating {
            bottom: 1rem;
            right: 1rem;
            width: 50px;
            height: 50px;
          }
        }
      `}</style>
            <TopLayoutPage
                title={mode === "edit" ? "Actualizar cliente" : "Crear cliente"}
                pageTitle="Clientes"
                children={
                    <Fragment>
                        <div className="d-flex justify-content-between align-items-center mb-4">
                            <h1 className="h3 mb-0 fw-bold">{mode === "edit" ? "Actualizar cliente" : "Crear cliente"}</h1>
                            <Button
                                color="outline-secondary"
                                size="sm"
                                onClick={handleCancel}
                            >
                                Volver al listado
                            </Button>
                        </div>

                        {error && (
                            <Alert color="danger" className="mb-4">
                                {error}
                            </Alert>
                        )}

                        {success && (
                            <Alert color="success" className="mb-4">
                                {success}
                            </Alert>
                        )}

                        <Form onSubmit={handleSubmit}>
                            {/* Tipo de Cliente */}
                            <CollapsibleSection
                                id="tipo"
                                title="Categría de cliente"
                                icon={User}
                                isOpen={openSections.tipo}
                                onToggle={toggleSection}
                                badge={typeCustomerName ? typeCustomerName.toUpperCase() : null}
                            >
                                <Row className="mt-3">
                                    {
                                        typeCustomers.length > 0 && (
                                            typeCustomers
                                                .map((typeCustomer, index) => {
                                                    return (
                                                        <Col md={4} className="mb-3" key={index}>
                                                            <div
                                                                className={`type-option ${formData.typeCustomerId === typeCustomer?._id ? "selected" : ""}`}
                                                                onClick={() => {
                                                                    setTypeCustomerName(typeCustomer?.name);
                                                                    handleDirectChange("typeCustomerId", typeCustomer?._id)
                                                                }}
                                                            >
                                                                <div className="text-center">
                                                                    <input
                                                                        key={`type-customer-${typeCustomer?._id}`}
                                                                        type="radio"
                                                                        name="typeCustomerId"
                                                                        value={typeCustomer?._id}
                                                                        checked={formData.typeCustomerId === typeCustomer?._id}
                                                                        onChange={() => {
                                                                            setTypeCustomerName(typeCustomer?.name);
                                                                            handleDirectChange("typeCustomerId", typeCustomer?._id)
                                                                        }}
                                                                        className="mb-3"
                                                                    />
                                                                    <h6 className="fw-bold">{typeCustomer?.name}</h6>
                                                                    <p className="text-muted small mb-0">{typeCustomer?.description}</p>
                                                                </div>
                                                            </div>
                                                            {validationErrors.typeCustomerId && <span style={{ color: "red" }}>{validationErrors.typeCustomerId}</span>}
                                                        </Col>
                                                    );
                                                })
                                        )
                                    }
                                </Row>
                            </CollapsibleSection>

                            {/* Datos Básicos */}
                            <CollapsibleSection
                                id="datosBasicos"
                                title="Datos Básicos"
                                icon={User}
                                isOpen={openSections.datosBasicos}
                                onToggle={toggleSection}
                            >

                                <Row className="mt-3">
                                    <Col md={6}>
                                        <Input
                                            style={{
                                                border: 'none !important',
                                                borderBottom: '2px solid #ccc !important',
                                                backgroundColor: 'transparent',
                                                color: '#132649',
                                                '&:focus': { border: 'none', boxShadow: 'none' },
                                                fontSize: '1em',
                                            }}
                                            bsSize="md"
                                            type="select"
                                            id="typeOfCustomer"
                                            name="typeOfCustomer"
                                            value={formData.basics.typeOfCustomer}
                                            onChange={(e) => handleInputChange("basics", "typeOfCustomer", e.target.value)}
                                            required
                                            className="form-control mb-3 floating-input"
                                        >
                                            <option value="0">Seleccione el tipo de cliente <span className="text-danger">*</span></option>
                                            {
                                                typeClientsOptions.map((typeOfCustomer, idx) => {
                                                    return (<option key={idx} label={typeOfCustomer.label} value={typeOfCustomer.value}></option>)
                                                })
                                            }
                                        </Input>
                                        {validationErrors.typeOfCustomer && <span style={{ color: "red" }}>{validationErrors.typeOfCustomer}</span>}
                                    </Col>

                                    <Col md={6}>
                                        <Input
                                            style={{
                                                border: 'none !important',
                                                borderBottom: '2px solid #ccc !important',
                                                backgroundColor: 'transparent',
                                                color: '#132649',
                                                '&:focus': { border: 'none', boxShadow: 'none' },
                                                fontSize: '1em',
                                            }}
                                            bsSize="md"
                                            type="select"
                                            id="typeOfDocument"
                                            name="typeOfDocument"
                                            value={formData.basics.typeOfDocument}
                                            onChange={(e) => handleInputChange("basics", "typeOfDocument", e.target.value)}
                                            required
                                            className="form-control mb-3 floating-input"
                                        >
                                            <option value="0">Seleccione el tipo de documento <span className="text-danger">*</span></option>
                                            {
                                                typeDocumentsOptions.map((typeOfDocument, idx) => {
                                                    return (<option key={idx} label={typeOfDocument.label} value={typeOfDocument.value}></option>)
                                                })
                                            }
                                        </Input>
                                        {validationErrors.typeOfDocument && <span style={{ color: "red" }}>{validationErrors.typeOfDocument}</span>}
                                    </Col>
                                </Row>

                                <Row >
                                    <Col md={6}>
                                        <FloatingInput
                                            id="documento"
                                            value={formData.basics.documento}
                                            onChange={(e) => handleInputChange("basics", "documento", e.target.value)}
                                            label="N° Documento"
                                            required
                                        />
                                        {validationErrors.documento && <span style={{ color: "red" }}>{validationErrors.documento}</span>}
                                    </Col>

                                    <Col md={6}>
                                        <FloatingInput
                                            id="name"
                                            value={formData.basics.name}
                                            onChange={(e) => handleInputChange("basics", "name", e.target.value)}
                                            label="Nombre"
                                            required
                                        />
                                        {validationErrors.name && <span style={{ color: "red" }}>{validationErrors.name}</span>}
                                    </Col>
                                </Row>

                                <Row>
                                    <Col md={6}>
                                        <FloatingInput
                                            id="lastname"
                                            value={formData.basics.lastname}
                                            onChange={(e) => handleInputChange("basics", "lastname", e.target.value)}
                                            label="Apellidos"
                                            required
                                        />
                                        {validationErrors.lastname && <span style={{ color: "red" }}>{validationErrors.lastname}</span>}
                                    </Col>
                                    <Col md={6}>
                                        <FloatingInput
                                            id="commercialName"
                                            value={formData.basics.commercialName}
                                            onChange={(e) => handleInputChange("basics", "commercialName", e.target.value)}
                                            label="Nombre Comercial"
                                            required
                                        />
                                        {validationErrors.commercialName && <span style={{ color: "red" }}>{validationErrors.commercialName}</span>}
                                    </Col>
                                </Row>

                                <Row>
                                    <Col md={6}>
                                        <Select
                                            id="city"
                                            name="city"
                                            options={cities}
                                            value={formData.basics.city}
                                            onChange={(option) => {
                                                handleInputChange("basics", "city", option);
                                            }}
                                            classNamePrefix="react-select"
                                            placeholder="Selecciona una ciudad"
                                            className="form-control"
                                        />
                                        {validationErrors.city && <span style={{ color: "red" }}>{validationErrors.city}</span>}
                                    </Col>

                                    <Col md={6}>
                                        <FloatingInput
                                            id="address"
                                            value={formData.basics.address}
                                            onChange={(e) => handleInputChange("basics", "address", e.target.value)}
                                            label="Dirección"
                                            required
                                        />
                                        {validationErrors.address && <span style={{ color: "red" }}>{validationErrors.address}</span>}
                                    </Col>
                                </Row>

                                <Row>
                                    <Col md={6}>
                                        <FloatingInput
                                            id="phone"
                                            value={formData.basics.phone}
                                            onChange={(e) => handleInputChange("basics", "phone", e.target.value)}
                                            label="Teléfono"
                                            required
                                        />
                                        {validationErrors.phone && <span style={{ color: "red" }}>{validationErrors.phone}</span>}
                                    </Col>

                                    <Col md={6}>
                                        <FloatingInput
                                            id="email"
                                            value={formData.basics.email}
                                            onChange={(e) => handleInputChange("basics", "email", e.target.value)}
                                            label="Correo"
                                            required
                                        />
                                        {validationErrors.email && <span style={{ color: "red" }}>{validationErrors.email}</span>}
                                    </Col>

                                </Row>

                            </CollapsibleSection>

                            {/* Facturación y Envío */}
                            <CollapsibleSection
                                id="facturacionEnvio"
                                title="Datos para Envío"
                                icon={MapPin}
                                isOpen={openSections.facturacionEnvio}
                                onToggle={toggleSection}
                            >

                                <div className="form-check mt-3 mb-3">
                                    <input
                                        className="form-check-input"
                                        type="checkbox"
                                        id="mismadireccion"
                                        checked={formData.basics.sameAddress}
                                        onChange={handleSameAddressChange}
                                    />
                                    <label className="form-check-label" htmlFor="mismadireccion">
                                        La dirección de envío es la misma que los datos básicos
                                    </label>
                                </div>
                                {
                                    !formData.basics.sameAddress && (
                                        <>
                                            <Row>
                                                <Col md={6}>
                                                    <Input
                                                        style={{
                                                            border: 'none !important',
                                                            borderBottom: '2px solid #ccc !important',
                                                            backgroundColor: 'transparent',
                                                            color: '#132649',
                                                            '&:focus': { border: 'none', boxShadow: 'none' },
                                                            fontSize: '1em',
                                                        }}
                                                        bsSize="md"
                                                        type="select"
                                                        id="typeOfDocument"
                                                        name="typeOfDocument"
                                                        value={formData.basics.typeOfDocument}
                                                        onChange={(e) => handleInputChange("basics", "typeOfDocument", e.target.value)}
                                                        className="form-control mb-3 floating-input"
                                                    >
                                                        <option value="0">Seleccione el tipo de documento <span className="text-danger">*</span></option>
                                                        {
                                                            typeDocumentsOptions.map((typeOfDocument, idx) => {
                                                                return (<option key={idx} label={typeOfDocument.label} value={typeOfDocument.value}></option>)
                                                            })
                                                        }
                                                    </Input>
                                                </Col>

                                                <Col md={6}>
                                                    <FloatingInput
                                                        id="shippingDocumento"
                                                        value={formData.shippingData.shippingDocumento}
                                                        onChange={(e) => handleInputChange("facturacionEnvio", "shippingDocumento", e.target.value)}
                                                        label="N° Documento"
                                                    />
                                                </Col>
                                            </Row>

                                            <Row>
                                                <Col md={6}>
                                                    <FloatingInput
                                                        id="shippingName"
                                                        value={formData.shippingData.shippingName}
                                                        onChange={(e) => handleInputChange("facturacionEnvio", "shippingName", e.target.value)}
                                                        label="Nombre"
                                                    />
                                                </Col>

                                                <Col md={6}>
                                                    <FloatingInput
                                                        id="shippingLastname"
                                                        value={formData.shippingData.shippingLastname}
                                                        onChange={(e) => handleInputChange("facturacionEnvio", "shippingLastname", e.target.value)}
                                                        label="Apellidos"
                                                    />
                                                </Col>
                                            </Row>

                                            <Row>
                                                <Col md={6}>
                                                    <Select
                                                        id="shippingCity"
                                                        name="shippingCity"
                                                        options={cities}
                                                        value={formData.shippingData.shippingCity}
                                                        onChange={(option) => {
                                                            handleInputChange("facturacionEnvio", "shippingCity", option);
                                                        }}
                                                        classNamePrefix="react-select"
                                                        placeholder="Selecciona una ciudad"
                                                        className="form-control"
                                                    />
                                                    {validationErrors.shippingCity && <span style={{ color: "red" }}>{validationErrors.shippingCity}</span>}
                                                </Col>

                                                <Col md={6}>
                                                    <FloatingInput
                                                        id="direccionFacturacion"
                                                        value={formData.shippingData.shippingAddress}
                                                        onChange={(e) => handleInputChange("facturacionEnvio", "shippingAddress", e.target.value)}
                                                        label="Dirección"
                                                    />
                                                </Col>

                                                <Col md={6}>
                                                    <FloatingInput
                                                        id="shippingPhone"
                                                        value={formData.shippingData.shippingPhone}
                                                        onChange={(e) => handleInputChange("facturacionEnvio", "shippingPhone", e.target.value)}
                                                        label="Teléfono"
                                                    />
                                                </Col>
                                            </Row>
                                        </>
                                    )}
                            </CollapsibleSection>

                            {/* Contactos */}
                            <CollapsibleSection
                                id="contactos"
                                title="Contactos"
                                icon={Phone}
                                isOpen={openSections.contactos}
                                onToggle={toggleSection}
                                badge={formData.contacts.length}
                            >
                                {formData.contacts.map((contacto, index) => (
                                    <div key={index} className="contact-card mt-3">
                                        <div className="d-flex justify-content-between align-items-center mb-3">
                                            <h6 className="fw-bold mb-0">Contacto {index + 1}</h6>
                                            {formData.contacts.length > 1 && (
                                                <Button color="outline-danger" size="sm" onClick={() => removeContact(index)}>
                                                    <Trash2 size={16} />
                                                </Button>
                                            )}
                                        </div>
                                        <Row className="mt-3">
                                            <Col md={3} sm={12}>
                                                <FloatingInput
                                                    id={`contacto-nombre-${index}`}
                                                    value={contacto.contactName}
                                                    onChange={(e) => handleContactChange(index, "contactName", e.target.value)}
                                                    label="Nombre"
                                                />
                                            </Col>
                                            <Col md={3} sm={12}>
                                                <FloatingInput
                                                    id={`contacto-apellidos-${index}`}
                                                    value={contacto.contactLastname}
                                                    onChange={(e) => handleContactChange(index, "contactLastname", e.target.value)}
                                                    label="Apellidos"
                                                />
                                            </Col>
                                            <Col md={2} sm={12}>
                                                <FloatingInput
                                                    id={`contacto-email-${index}`}
                                                    type="email"
                                                    value={contacto.contactEmail}
                                                    onChange={(e) => handleContactChange(index, "contactEmail", e.target.value)}
                                                    label="Email"
                                                />
                                            </Col>
                                            <Col md={2} sm={12}>
                                                <FloatingInput
                                                    id={`contacto-telefono-${index}`}
                                                    type="tel"
                                                    value={contacto.contactPhone}
                                                    onChange={(e) => handleContactChange(index, "contactPhone", e.target.value)}
                                                    label="Teléfono"
                                                />
                                            </Col>
                                            <Col md={2} sm={12}>
                                                <FloatingInput
                                                    id={`contacto-charge-${index}`}
                                                    type="tel"
                                                    value={contacto.contactCharge}
                                                    onChange={(e) => handleContactChange(index, "contactCharge", e.target.value)}
                                                    label="Cargo"
                                                />
                                            </Col>
                                        </Row>

                                    </div>
                                ))}
                                <Button color="outline-primary" onClick={addContact} className="w-100">
                                    <PlusCircle size={18} className="me-2" />
                                    Añadir Contacto
                                </Button>
                            </CollapsibleSection>

                            {/* Campos Personalizados */}
                            <CollapsibleSection
                                id="camposPersonalizados"
                                title="Campos Personalizados"
                                icon={Settings}
                                isOpen={openSections.camposPersonalizados}
                                onToggle={toggleSection}
                                badge={customFields.filter((f) => f.nombre).length}
                            >
                                {customFields.map((field, index) => (
                                    <div key={field.id} className="custom-field-row mt-3">
                                        <Row>
                                            <Col md={5}>
                                                <FloatingInput
                                                    id={`custom-name-${field.id}`}
                                                    value={field.nombre}
                                                    onChange={(e) => handleCustomFieldChange(index, "nombre", e.target.value)}
                                                    label="Nombre del Campo"
                                                />
                                            </Col>
                                            <Col md={5}>
                                                <FloatingInput
                                                    id={`custom-value-${field.id}`}
                                                    value={field.valor}
                                                    onChange={(e) => handleCustomFieldChange(index, "valor", e.target.value)}
                                                    label="Valor"
                                                />
                                            </Col>
                                            <Col md={2} className="d-flex align-items-end">
                                                <Button
                                                    color="outline-danger"
                                                    onClick={() => removeCustomField(index)}
                                                    className="w-100"
                                                    style={{ marginBottom: "1.5rem" }}
                                                >
                                                    <Trash2 size={16} />
                                                </Button>
                                            </Col>
                                        </Row>
                                    </div>
                                ))}
                                <Button color="outline-primary" onClick={addCustomField} className="w-100">
                                    <PlusCircle size={18} className="me-2" />
                                    Añadir Campo
                                </Button>
                            </CollapsibleSection>

                            {/* Observaciones */}
                            <CollapsibleSection
                                id="observaciones"
                                title="Observaciones"
                                icon={FileText}
                                isOpen={openSections.observaciones}
                                onToggle={toggleSection}
                            >
                                <FloatingInput
                                    id="observaciones"
                                    as="textarea"
                                    rows={4}
                                    value={formData.observations}
                                    onChange={(e) => handleDirectChange("observations", e.target.value)}
                                    label="Notas adicionales sobre el cliente"
                                />
                            </CollapsibleSection>
                        </Form>

                        {/* Botón flotante para guardar */}
                        <Button
                            color="primary"
                            className="btn-floating"
                            onClick={handleSubmit}
                            title="Guardar Cliente"
                            disabled={isLoading}
                            isLoading={isLoading}
                        >
                            <Save size={24} />
                        </Button>
                    </Fragment>
                }
            />
        </>
    )
}
