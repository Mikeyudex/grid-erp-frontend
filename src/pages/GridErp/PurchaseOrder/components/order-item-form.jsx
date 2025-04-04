"use client"

import { useState, useEffect, Fragment } from "react"
import { X, Plus, Check } from "lucide-react"
import { OrderItem } from "../utils/order"
import {
    Form,
    FormGroup,
    Label,
    Input,
    Button,
    Row,
    Col,
    InputGroup,
    Modal,
    ModalHeader,
    ModalBody,
    ModalFooter,
    FormText,
    ListGroup,
    ListGroupItem,
} from "reactstrap";
import { ProductHelper } from "../../Products/helper/product_helper";

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

const productHelper = new ProductHelper();

export default function OrderItemForm({
    initialValues,
    onSubmit,
    onCancel,
    isOpen,
    toggle,
    products,
    typeOfPieces,
    matMaterialPrices,
    matTypeOptions,
    materialTypeOptions
}) {
    const defaultValues = {
        productName: "",
        productId: "",
        pieces: typeOfPieces.slice(0, 3).length || 0,
        selectedPieces: typeOfPieces.slice(0, 3).map((p) => p._id) || [],
        matType: "Selecciona una opción",
        materialType: "Selecciona una opción",
        quantity: 1,
        basePrice: 0,
        observations: "",
        finalPrice: 0,
        adjustedPrice: 0,
    };
    const [formData, setFormData] = useState(() => {
        if (initialValues) {
            // Si hay valores iniciales pero no tiene selectedPieces, inicializamos un array vacío
            if (!initialValues.selectedPieces) {
                return {
                    ...initialValues,
                    selectedPieces: [],
                }
            }
            return initialValues
        }
        return defaultValues
    });
    const [filteredProducts, setFilteredProducts] = useState(products || []);
    const [productSelected, setProductSelected] = useState(null);
    const [searchTerm, setSearchTerm] = useState("");
    const [errors, setErrors] = useState({});

    const [showProductDropdown, setShowProductDropdown] = useState(false);
    const [piecesModalOpen, setPiecesModalOpen] = useState(false)
    const [selectedPiecesTemp, setSelectedPiecesTemp] = useState(typeOfPieces.slice(0, 3) || []);

    const handleGetAdjustedPrice = async () => {
        try {
            if (!productSelected) return 0;
            if (!formData.matType || !formData.materialType) return 0;
            if (formData.matType === "Selecciona una opción" || formData.materialType === "Selecciona una opción") return 0;
            const response = await productHelper.calcularPrecioFinalProducto(productSelected?.id, formData.matType, formData.materialType, 1);
            if (response?.statusCode === 200) {
                return response.data?.precioFinal || 0;
            }
            return 0;
        } catch (error) {
            console.log(error);
            return 0;
        }
    }

    useEffect(() => {
        // Inicializar selectedPiecesTemp cuando se abre el modal
        if (piecesModalOpen) {
            setSelectedPiecesTemp([...formData.selectedPieces])
        }
    }, [piecesModalOpen, formData.selectedPieces])

    useEffect(() => {
        // Filter products based on search term
        if (searchTerm) {
            setFilteredProducts(products.filter((product) => product?.name.toLowerCase().includes(searchTerm.toLowerCase())));
            setShowProductDropdown(true);
        } else {
            setFilteredProducts(products);
            setShowProductDropdown(false);
        }
    }, [searchTerm]);

    useEffect(() => {

        // Calculate base price based on mat type and material type
        //const adjustedPrice = matMaterialPrices[formData.matType]?.[formData.materialType] || 0;
        if (!productSelected || !formData.productName) return;
        if (!formData.matType || !formData.materialType) return;
        if (formData.matType === "Selecciona una opción" || formData.materialType === "Selecciona una opción") return;

        handleGetAdjustedPrice()
            .then(data => {
                let adjustedPrice = data;
                let finalPrice = adjustedPrice * formData.quantity;
                setFormData((prev) => ({
                    ...prev,
                    adjustedPrice,
                    finalPrice,
                }))
            })
    }, [formData.matType, formData.materialType, formData.quantity, formData.productName])

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

    const handleProductSelect = (productName, productId, product) => {
        setFormData({
            ...formData,
            productName: productName,
            productId: productId,
            basePrice: product?.salePrice,
        })
        setProductSelected(product);
        setSearchTerm("")
        setShowProductDropdown(false);
    }

    const clearProductSelection = () => {
        setSearchTerm("")
        setFormData({
            ...formData,
            productName: "",
            productId: "",
            basePrice: 0,
            adjustedPrice: 0,
        })
        setShowProductDropdown(false)
    }

    const togglePiecesModal = () => {
        setPiecesModalOpen(!piecesModalOpen)
    }

    const handlePieceToggle = (pieceId) => {
        if (selectedPiecesTemp.includes(pieceId)) {
            setSelectedPiecesTemp(selectedPiecesTemp.filter((id) => id !== pieceId))
        } else {
            setSelectedPiecesTemp([...selectedPiecesTemp, pieceId])
        }
    }

    const handleSelectAllPieces = () => {
        if (selectedPiecesTemp.length === typeOfPieces.length) {
            // Si todos están seleccionados, deseleccionar todos
            setSelectedPiecesTemp([])
        } else {
            // Si no todos están seleccionados, seleccionar todos
            setSelectedPiecesTemp(typeOfPieces.map((pieza) => pieza.id))
        }
    }

    const savePiecesSelection = () => {
        setFormData({
            ...formData,
            selectedPieces: selectedPiecesTemp,
            pieces: selectedPiecesTemp.length,
        })
        togglePiecesModal()
    }

    const getSelectedPiecesText = () => {
        if (formData.selectedPieces.length === 0) {
            return "Ninguna pieza seleccionada"
        }

        const selectedNames = formData.selectedPieces
            .map((id) => {
                const pieza = typeOfPieces.find((p) => p._id === id)
                return pieza ? pieza.name : ""
            })
            .filter(Boolean)
        return selectedNames.join(", ")
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
                    {/* Modal para seleccionar piezas */}
                    <Modal isOpen={piecesModalOpen} toggle={togglePiecesModal}>
                        <ModalHeader toggle={togglePiecesModal}>Seleccionar Piezas</ModalHeader>
                        <ModalBody>
                            <div className="mb-3">
                                <Button color="secondary" outline size="sm" onClick={handleSelectAllPieces} className="w-100">
                                    {selectedPiecesTemp.length === typeOfPieces.length ? "Deseleccionar Todos" : "Seleccionar Todos"}
                                </Button>
                            </div>
                            <ListGroup>
                                {typeOfPieces.map((pieza) => (
                                    <ListGroupItem
                                        key={pieza?._id}
                                        action
                                        active={selectedPiecesTemp.includes(pieza?._id)}
                                        onClick={() => handlePieceToggle(pieza?._id)}
                                        className="d-flex justify-content-between align-items-center"
                                    >
                                        {pieza?.name}
                                        {selectedPiecesTemp.includes(pieza?._id) && <Check size={18} />}
                                    </ListGroupItem>
                                ))}
                            </ListGroup>
                            <div className="mt-3 text-center">
                                <FormText>
                                    Piezas seleccionadas: {selectedPiecesTemp.length} de {typeOfPieces.length}
                                </FormText>
                            </div>
                        </ModalBody>
                        <ModalFooter>
                            <Button color="secondary" onClick={togglePiecesModal}>
                                Cancelar
                            </Button>
                            <Button color="primary" onClick={savePiecesSelection}>
                                Guardar Selección
                            </Button>
                        </ModalFooter>
                    </Modal>
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
                                            autoComplete="off"
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
                                                        onClick={() => handleProductSelect(product?.name, product?._id, product)}
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

                                        <InputGroup>
                                            <Input
                                                type="number"
                                                id="pieces"
                                                name="pieces"
                                                value={formData.pieces}
                                                readOnly
                                                required
                                                className="form-control" />
                                            <Button color="primary" onClick={togglePiecesModal}>
                                                <Plus size={16} />
                                            </Button>
                                        </InputGroup>
                                    </div>
                                    <FormText>{getSelectedPiecesText()}</FormText>
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
                                        <option value="0">Selecciona una opción</option>
                                        {
                                            matTypeOptions.map((mat, index) => {
                                                return (
                                                    <option key={index} value={mat}>{mat}</option>
                                                )
                                            }
                                            )
                                        }
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
                                        <option value="0">Selecciona una opción</option>
                                        {
                                            materialTypeOptions.map((matType, index) => {
                                                return (
                                                    <option key={index} value={matType}>{matType}</option>
                                                )
                                            })
                                        }
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

