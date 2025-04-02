"use client"

import { useState, useEffect, Fragment } from "react"
import { X } from "lucide-react"
import { OrderItem } from "../utils/order"
import { Button, Col, Dropdown, DropdownItem, DropdownMenu, FormGroup, Input, Label, Row, Form, Modal, ModalHeader, ModalBody, InputGroup } from "reactstrap"

// Pricing data based on the provided grid
const pricingData = {
    BASIC: {
        "ST-CRONCH": 80000, //80000
        "ST-DIAMANTE": 90000,
        "ST-KUBIK": 90000,
        "ST-KANT LISO": 90000,
        "PR-KANT ADH": 105000,
        "PR-BEIGE LISO": 120000,
        "PR-BEIGE ADH": 130000,
        "PR-ALFOMBRA": 105000,
    },
    "ESTÁNDAR A": {
        "ST-CRONCH": 95000,
        "ST-DIAMANTE": 95000,
        "ST-KUBIK": 95000,
        "ST-KANT LISO": 95000,
        "PR-KANT ADH": 105000,
        "PR-BEIGE LISO": 120000,
        "PR-BEIGE ADH": 130000,
        "PR-ALFOMBRA": 105000,
    },
    "ESTÁNDAR B": {
        "ST-CRONCH": 99000,
        "ST-DIAMANTE": 99000,
        "ST-KUBIK": 99000,
        "ST-KANT LISO": 99000,
        "PR-KANT ADH": 105000,
        "PR-BEIGE LISO": 120000,
        "PR-BEIGE ADH": 130000,
        "PR-ALFOMBRA": 105000,
    },
    PREMIUM: {
        "ST-CRONCH": 105000,
        "ST-DIAMANTE": 105000,
        "ST-KUBIK": 105000,
        "ST-KANT LISO": 105000,
        "PR-KANT ADH": 105000,
        "PR-BEIGE LISO": 120000,
        "PR-BEIGE ADH": 130000,
        "PR-ALFOMBRA": 105000,
    },
}

// Sample product list
/* const products = [
    "Tapete Audi Q3",
    "Tapete Audi Q5",
    "Tapete Baic 205",
    "Tapete Baic KENBO",
    "Tapete BMW X5",
    "Tapete BMW X6"
] */

export default function OrderItemForm({ initialValues, onSubmit, onCancel, isOpen, toggle, products }) {
    const defaultValues = {
        productName: "",
        productId: "",
        pieces: 2,
        matType: "BASIC",
        materialType: "ST-CRONCH",
        quantity: 1,
        basePrice: 95000,
        observations: "",
        finalPrice: 80000,
        adjustedPrice: 80000,
    };
    const [formData, setFormData] = useState(initialValues || defaultValues);
    const [filteredProducts, setFilteredProducts] = useState(products || []);
    const [searchTerm, setSearchTerm] = useState("");
    const [errors, setErrors] = useState({});

    const [showProductDropdown, setShowProductDropdown] = useState(false);



    useEffect(() => {
        // Filter products based on search term
        if (searchTerm) {
            setFilteredProducts(products.filter((product) => product?.name.toLowerCase().includes(searchTerm.toLowerCase())));
            setShowProductDropdown(true);
        } else {
            setFilteredProducts(products);
            setShowProductDropdown(false);
        }
    }, [searchTerm])

    useEffect(() => {
        // Calculate base price based on mat type and material type
        const basePrice = pricingData[formData.matType]?.[formData.materialType] || 0

        // Calculate final price (simplified version of the formula)
        // The original formula: =SI.ERROR(REDOND.MULT(BUSCARV(E3;Info!$B$3:$J$10;COINCIDIR(F3;Info!$B$3:$J$3;0);FALSE)*(I3/Info!$C$5);1000);0)
        // We're implementing a simplified version that multiplies the base price by the quantity
        const finalPrice = basePrice * formData.quantity

        setFormData((prev) => ({
            ...prev,
            basePrice,
            finalPrice,
        }))
    }, [formData.matType, formData.materialType, formData.quantity])

    const handleChange = (e) => {
        const { name, value } = e.target
        setFormData({
            ...formData,
            [name]: value,
        })
    }

    const handleProductSearch = (e) => {
        setSearchTerm(e.target.value)
    }

    const handleProductSelect = (productName, productId) => {
        setFormData({
            ...formData,
            productName: productName,
            productId: productId,
        })
        setSearchTerm("")
        setShowProductDropdown(false);
    }

    const clearProductSelection = () => {
        setSearchTerm("")
        setFormData({
            ...formData,
            productName: "",
            productId: "",
        })
        setShowProductDropdown(false)
    }

    const handleValidateInputs = () => {
        const newErrors = {};

        if (!formData.productName) {
            newErrors.productName = "El nombre del producto es requerido";
        }

        if (!formData.pieces) {
            newErrors.pieces = "La cantidad de piezas es requerida";
        }

        if (!formData.matType) {
            newErrors.matType = "El tipo de material es requerido";
        }

        if (!formData.materialType) {
            newErrors.materialType = "El tipo de material es requerido";
        }

        if (!formData.quantity) {
            newErrors.quantity = "La cantidad es requerida";
        }

        if (!formData.basePrice) {
            newErrors.basePrice = "El precio base es requerido";
        }

        if (!formData.observations) {
            newErrors.observations = "Las observaciones son requeridas";
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0; // Devuelve true si no hay errores
    }

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!handleValidateInputs()) return;
        onSubmit(formData);
    }

    return (
        <Fragment>
            <Modal isOpen={isOpen} toggle={toggle} size="lg">
                <ModalHeader toggle={toggle}>Agregar Producto</ModalHeader>
                <ModalBody>
                    <Form>
                        <Row>
                            {/* Product Name with Search */}
                            <Col md={8} className="mb-3">
                                <FormGroup>
                                    <Label for="productName" className="fw-medium">
                                        Nombre del Producto
                                    </Label>
                                    <InputGroup>
                                        <Input
                                            type="text"
                                            id="productName"
                                            name="productName"
                                            value={searchTerm || formData.productName}
                                            onChange={handleProductSearch}
                                            onFocus={() => {
                                                if (formData.productName) {
                                                    setShowProductDropdown(false)
                                                } else {
                                                    setSearchTerm("")
                                                    setShowProductDropdown(true)
                                                }
                                            }}
                                            placeholder="Buscar producto..."
                                            required
                                        />
                                        {(searchTerm || formData.productName) && (
                                            <Button color="secondary" onClick={clearProductSelection}>
                                                <X size={16} />
                                            </Button>
                                        )}
                                    </InputGroup>
                                    {showProductDropdown && (
                                        <div
                                            className="position-absolute w-100 mt-1 bg-white border rounded shadow-sm"
                                            style={{ maxHeight: "200px", overflowY: "auto", zIndex: 1000 }}
                                        >
                                            {filteredProducts.length > 0 ? (
                                                filteredProducts.map((product, index) => (
                                                    <div
                                                        key={index}
                                                        className="p-2 border-bottom"
                                                        onClick={() => handleProductSelect(product?.name, product?.id)}
                                                        style={{ cursor: "pointer" }}
                                                        onMouseOver={(e) => (e.target.style.backgroundColor = "#f8f9fa")}
                                                        onMouseOut={(e) => (e.target.style.backgroundColor = "")}
                                                    >
                                                        {product?.name}
                                                    </div>
                                                ))
                                            ) : (
                                                <div className="p-2 text-muted">No se encontraron productos</div>
                                            )}
                                        </div>
                                    )}
                                </FormGroup>
                            </Col>

                            {/* Number of Pieces */}
                            <Col md={4} className="mb-3">
                                <FormGroup>
                                    <Label for="pieces" className="fw-medium">
                                        Cantidad de Piezas
                                    </Label>
                                    <div
                                        className="input-step full-width"
                                        style={{
                                            border: 'none',
                                            borderBottom: '2px solid #ccc',
                                            backgroundColor: 'transparent',
                                            padding: '10px 0',
                                            fontSize: '1em',
                                            height: '3.1em'
                                        }}
                                    >
                                        <button
                                            type="button"
                                            className="minus"
                                            onClick={() => setFormData({ ...formData, pieces: formData.pieces - 1 })}
                                        >
                                            –
                                        </button>
                                        <Input
                                            type="number"
                                            className={`form-control`}
                                            id="pieces"
                                            name="pieces"
                                            value={formData.pieces}
                                            min={"0"}
                                            max={"5000"}
                                            readOnly
                                            required
                                        />
                                        <button
                                            type="button"
                                            className="plus"
                                            onClick={() => setFormData({ ...formData, pieces: formData.pieces + 1 })}
                                        >
                                            +
                                        </button>
                                    </div>
                                    {errors.pieces && (<span className="form-product-input-error">{errors.pieces}</span>)}
                                </FormGroup>
                            </Col>

                            {/* Mat Type */}
                            <Col md={6} className="mb-3">
                                <FormGroup>
                                    <Label for="matType" className="fw-medium">
                                        Tipo de Tapete
                                    </Label>
                                    <Input type="select" id="matType" name="matType" value={formData.matType} onChange={handleChange} required>
                                        <option value="BASIC">BASIC</option>
                                        <option value="ESTÁNDAR A">ESTÁNDAR A</option>
                                        <option value="ESTÁNDAR B">ESTÁNDAR B</option>
                                        <option value="PREMIUM">PREMIUM</option>
                                    </Input>
                                    {errors.matType && (<span className="form-product-input-error">{errors.matType}</span>)}
                                </FormGroup>
                            </Col>

                            {/* Material Type */}
                            <Col md={6} className="mb-3">
                                <FormGroup>
                                    <Label for="materialType" className="fw-medium">
                                        Tipo de Material
                                    </Label>
                                    <Input
                                        type="select"
                                        id="materialType"
                                        name="materialType"
                                        value={formData.materialType}
                                        onChange={handleChange}
                                        required
                                    >
                                        <option value="ST-CRONCH">ST-CRONCH</option>
                                        <option value="ST-DIAMANTE">ST-DIAMANTE</option>
                                        <option value="ST-KUBIK">ST-KUBIK</option>
                                        <option value="ST-KANT LISO">ST-KANT LISO</option>
                                        <option value="PR-KANT ADH">PR-KANT ADH</option>
                                        <option value="PR-BEIGE LISO">PR-BEIGE LISO</option>
                                        <option value="PR-BEIGE ADH">PR-BEIGE ADH</option>
                                        <option value="PR-ALFOMBRA">PR-ALFOMBRA</option>
                                    </Input>
                                    {errors.materialType && (<span className="form-product-input-error">{errors.materialType}</span>)}
                                </FormGroup>
                            </Col>

                            {/* Quantity */}
                            <Col md={4} className="mb-3">
                                <FormGroup>
                                    <Label for="quantity" className="fw-medium">
                                        Cantidad
                                    </Label>
                                    <div
                                        className="input-step full-width"
                                        style={{
                                            border: 'none',
                                            borderBottom: '2px solid #ccc',
                                            backgroundColor: 'transparent',
                                            padding: '10px 0',
                                            fontSize: '1em',
                                            height: '3.1em'
                                        }}
                                    >
                                        <button
                                            type="button"
                                            className="minus"
                                            onClick={() => setFormData({ ...formData, quantity: formData.quantity - 1 })}
                                        >
                                            –
                                        </button>
                                        <Input
                                            type="number"
                                            className={`form-control`}
                                            id="quantity"
                                            name="quantity"
                                            value={formData.quantity}
                                            min={"0"}
                                            max={"5000"}
                                            readOnly
                                            required
                                        />
                                        <button
                                            type="button"
                                            className="plus"
                                            onClick={() => setFormData({ ...formData, quantity: formData.quantity + 1 })}
                                        >
                                            +
                                        </button>
                                    </div>
                                    {errors.quantity && (<span className="form-product-input-error">{errors.quantity}</span>)}
                                </FormGroup>
                            </Col>

                            {/* Base Price (Read-only) */}
                            <Col md={4} className="mb-3">
                                <FormGroup>
                                    <Label for="basePrice" className="fw-medium">
                                        Precio Base
                                    </Label>
                                    <Input
                                        type="text"
                                        id="basePrice"
                                        value={`$${formData.basePrice?.toLocaleString()}`}
                                        className="bg-light"
                                        readOnly
                                    />
                                    {errors.basePrice && (<span className="form-product-input-error">{errors.basePrice}</span>)}
                                </FormGroup>
                            </Col>


                            {/* Adjusted Price*/}
                            <Col md={4} className="mb-3">
                                <FormGroup>
                                    <Label for="adjustedPrice" className="fw-medium">
                                        Precio Ajustado
                                    </Label>
                                    <Input
                                        type="text"
                                        id="adjustedPrice"
                                        value={`$${formData.adjustedPrice?.toLocaleString()}`}
                                        className="bg-light"
                                    />
                                    {errors.adjustedPrice && (<span className="form-product-input-error">{errors.adjustedPrice}</span>)}
                                </FormGroup>
                            </Col>
                        </Row>

                        {/* Observations */}
                        <FormGroup className="mb-3">
                            <Label for="observations" className="fw-medium">
                                Observaciones del Cliente
                            </Label>
                            <Input
                                type="textarea"
                                id="observations"
                                name="observations"
                                value={formData.observations}
                                onChange={handleChange}
                                rows={3}
                                placeholder="Añadir observaciones o especificaciones..."
                            />
                            {errors.observations && (<span className="form-product-input-error">{errors.observations}</span>)}
                        </FormGroup>

                        {/* Final Price */}
                        <div className="bg-light p-3 rounded mb-3">
                            <div className="d-flex justify-content-between align-items-center">
                                <span className="fw-medium">Precio Final:</span>
                                <span className="h4 fw-bold mb-0">${formData.finalPrice?.toLocaleString()}</span>
                            </div>
                        </div>

                        {/* Form Actions */}
                        <div className="d-flex justify-content-end gap-2">
                            <Button type="button" color="light" onClick={onCancel} className="d-flex align-items-center gap-1">
                                <X size={16} />
                                Cancelar
                            </Button>
                            <Button type="button" color="primary" onClick={handleSubmit}>
                                {initialValues ? "Actualizar" : "Añadir"} Producto
                            </Button>
                        </div>
                    </Form>
                </ModalBody>
            </Modal>
        </Fragment >
    )
}

