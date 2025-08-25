"use client"

import { useState, useEffect } from "react"
import {
    Container,
    Row,
    Col,
    Card,
    CardHeader,
    CardBody,
    Form,
    FormGroup,
    Label,
    Input,
    Button,
    Table,
    Alert,
    Badge,
    InputGroup,
    InputGroupText,
    Modal,
    ModalHeader,
    ModalBody,
    ModalFooter,
    Spinner,
} from "reactstrap"
import { useNavigate } from "react-router-dom"
import { ArrowLeft, Save, Plus, Search, Trash2, Calculator, CreditCard, Package, FileText, Upload } from "lucide-react"
import { PurchaseHelper } from "../helper/purchase-helper"


const purchaseHelper = new PurchaseHelper()

export default function CreatePurchase() {
    const navigate = useNavigate()

    // Estados principales
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState(null)
    const [success, setSuccess] = useState(null)

    // Estados para datos de selects
    const [providers, setProviders] = useState([])
    const [taxes, setTaxes] = useState([])
    const [retentions, setRetentions] = useState([])
    const [accounts, setAccounts] = useState([])

    // Estados para búsqueda de productos
    const [productSearchTerm, setProductSearchTerm] = useState("")
    const [searchResults, setSearchResults] = useState([])
    const [searchLoading, setSearchLoading] = useState(false)
    const [showProductModal, setShowProductModal] = useState(false)

    // Estados del formulario principal
    const [formData, setFormData] = useState({
        providerId: "",
        supplierInvoiceNumber: "",
        observations: "",
        detail: [],
        methodOfPayment: [],
    })

    // Estados para formas de pago
    const [paymentMethods, setPaymentMethods] = useState([])
    const [uploadingFiles, setUploadingFiles] = useState({})

    // Cargar datos iniciales
    useEffect(() => {
        loadInitialData()
    }, [])

    const loadInitialData = async () => {
        try {
            setLoading(true)
            const [providersData, taxesData, retentionsData, accountsData] = await Promise.all([
                purchaseHelper.getProviders(),
                purchaseHelper.getTaxes(),
                purchaseHelper.getRetentions(),
                purchaseHelper.getAccounts(),
            ])

            setProviders(providersData)
            setTaxes(taxesData)
            setRetentions(retentionsData)
            setAccounts(accountsData)
        } catch (err) {
            setError("Error al cargar los datos iniciales: " + err.message)
        } finally {
            setLoading(false)
        }
    }

    // Búsqueda de productos
    const handleProductSearch = async (searchTerm) => {
        if (searchTerm.length < 2) {
            setSearchResults([])
            return
        }

        try {
            setSearchLoading(true)
            const results = await purchaseHelper.searchProducts(searchTerm)
            setSearchResults(results)
        } catch (err) {
            console.error("Error en búsqueda:", err)
        } finally {
            setSearchLoading(false)
        }
    }

    // Agregar producto a la grilla
    const addProductToOrder = (product) => {
        const existingItem = formData.detail.find((item) => item.productId === product._id)

        if (existingItem) {
            setError("Este producto ya está agregado a la orden")
            return
        }

        const newItem = {
            productId: product._id,
            productName: product.name,
            productSku: product.sku,
            taxId: product.taxId,
            retentionId: product.retentionId,
            itemPrice: product.costPrice,
            itemQuantity: 1,
            itemTotal: product.costPrice,
            discountPercentage: 0,
            description: "",
        }

        setFormData((prev) => ({
            ...prev,
            detail: [...prev.detail, newItem],
        }))

        setProductSearchTerm("")
        setSearchResults([])
        setShowProductModal(false)
    }

    // Actualizar item en la grilla
    const updateOrderItem = (index, field, value) => {
        const updatedDetail = [...formData.detail]
        updatedDetail[index] = { ...updatedDetail[index], [field]: value }

        // Recalcular total del item si cambia precio, cantidad o descuento
        if (field === "itemPrice" || field === "itemQuantity" || field === "discountPercentage") {
            const item = updatedDetail[index]
            updatedDetail[index].itemTotal = purchaseHelper.calculateItemTotal(
                item.itemPrice,
                item.itemQuantity,
                item.discountPercentage,
            )
        }

        setFormData((prev) => ({ ...prev, detail: updatedDetail }))
    }

    // Eliminar item de la grilla
    const removeOrderItem = (index) => {
        const updatedDetail = formData.detail.filter((_, i) => i !== index)
        setFormData((prev) => ({ ...prev, detail: updatedDetail }))
    }

    // Agregar forma de pago
    const addPaymentMethod = () => {
        const newPayment = {
            accountId: "",
            paymentDate: new Date().toISOString().split("T")[0],
            value: 0,
            observations: "",
            paymentSupport: "",
        }
        setPaymentMethods([...paymentMethods, newPayment])
    }

    // Actualizar forma de pago
    const updatePaymentMethod = (index, field, value) => {
        const updatedPayments = [...paymentMethods]
        updatedPayments[index] = { ...updatedPayments[index], [field]: value }
        setPaymentMethods(updatedPayments)
    }

    // Eliminar forma de pago
    const removePaymentMethod = (index) => {
        const updatedPayments = paymentMethods.filter((_, i) => i !== index)
        setPaymentMethods(updatedPayments)
    }

    // Subir archivo para forma de pago
    const handleFileUpload = async (index, file) => {
        if (!file) return

        try {
            setUploadingFiles((prev) => ({ ...prev, [index]: true }))
            const response = await purchaseHelper.uploadFile(file)

            if (response.success) {
                updatePaymentMethod(index, "paymentSupport", response.url)
                setSuccess("Archivo subido exitosamente")
            }
        } catch (err) {
            setError("Error al subir archivo: " + err.message)
        } finally {
            setUploadingFiles((prev) => ({ ...prev, [index]: false }))
        }
    }

    // Calcular resumen de costos
    const calculateSummary = () => {
        return purchaseHelper.calculateOrderSummary(formData.detail, taxes, retentions)
    }

    // Enviar formulario
    const handleSubmit = async (e) => {
        e.preventDefault()

        if (formData.detail.length === 0) {
            setError("Debe agregar al menos un producto")
            return
        }

        if (paymentMethods.length === 0) {
            setError("Debe agregar al menos una forma de pago")
            return
        }

        try {
            setLoading(true)
            setError(null)

            const summary = calculateSummary()

            const purchaseData = {
                ...formData,
                methodOfPayment: paymentMethods,
                itemsQuantity: formData.detail.reduce((sum, item) => sum + item.itemQuantity, 0),
                totalOrder: summary.totalAPagar,
            }

            const response = await purchaseHelper.createPurchaseOrder(purchaseData)

            if (response.success) {
                setSuccess(response.message)
                setTimeout(() => {
                    navigate("/purchases")
                }, 2000)
            }
        } catch (err) {
            setError("Error al crear la orden: " + err.message)
        } finally {
            setLoading(false)
        }
    }

    const summary = calculateSummary()

    if (loading && providers.length === 0) {
        return (
            <Container className="py-4 text-center">
                <Spinner color="primary" />
                <p className="mt-2">Cargando...</p>
            </Container>
        )
    }

    return (
        <div className="page-content">
            <Container fluid className="py-3">
                {/* Header */}
                <Row className="mb-3">
                    <Col>
                        <div className="d-flex justify-content-between align-items-center">
                            <div className="d-flex align-items-center gap-2">
                                <Button color="light" size="sm" onClick={() => navigate("/purchases")}>
                                    <ArrowLeft size={16} />
                                </Button>
                                <h4 className="mb-0">Nueva Orden de Compra</h4>
                            </div>
                            <Button color="success" onClick={handleSubmit} disabled={loading}>
                                {loading ? <Spinner size="sm" /> : <Save size={16} />}
                                {loading ? " Guardando..." : " Guardar Orden"}
                            </Button>
                        </div>
                    </Col>
                </Row>

                {/* Alertas */}
                {error && (
                    <Alert color="danger" toggle={() => setError(null)} className="mb-3">
                        {error}
                    </Alert>
                )}
                {success && (
                    <Alert color="success" toggle={() => setSuccess(null)} className="mb-3">
                        {success}
                    </Alert>
                )}

                <Form onSubmit={handleSubmit}>
                    <Row>
                        <Col lg={8}>
                            {/* 1. Cabecera - Datos básicos */}
                            <Card className="mb-3">
                                <CardHeader className="bg-primary text-white d-flex align-items-center gap-2">
                                    <FileText size={18} />
                                    <span>Información General</span>
                                </CardHeader>
                                <CardBody>
                                    <Row>
                                        <Col md={6}>
                                            <FormGroup>
                                                <Label for="providerId" className="fw-bold">
                                                    Proveedor <span className="text-danger">*</span>
                                                </Label>
                                                <Input
                                                    type="select"
                                                    id="providerId"
                                                    value={formData.providerId}
                                                    onChange={(e) => setFormData((prev) => ({ ...prev, providerId: e.target.value }))}
                                                    required
                                                >
                                                    <option value="">Seleccionar proveedor...</option>
                                                    {providers.map((provider) => (
                                                        <option key={provider._id} value={provider._id}>
                                                            {provider.name} - {provider.nit}
                                                        </option>
                                                    ))}
                                                </Input>
                                            </FormGroup>
                                        </Col>
                                        <Col md={6}>
                                            <FormGroup>
                                                <Label for="supplierInvoiceNumber" className="fw-bold">
                                                    No. Factura Proveedor
                                                </Label>
                                                <Input
                                                    type="text"
                                                    id="supplierInvoiceNumber"
                                                    value={formData.supplierInvoiceNumber}
                                                    onChange={(e) => setFormData((prev) => ({ ...prev, supplierInvoiceNumber: e.target.value }))}
                                                    placeholder="Número de factura del proveedor"
                                                />
                                            </FormGroup>
                                        </Col>
                                        <Col xs={12}>
                                            <FormGroup>
                                                <Label for="observations" className="fw-bold">
                                                    Observaciones
                                                </Label>
                                                <Input
                                                    type="textarea"
                                                    id="observations"
                                                    rows={3}
                                                    value={formData.observations}
                                                    onChange={(e) => setFormData((prev) => ({ ...prev, observations: e.target.value }))}
                                                    placeholder="Observaciones adicionales..."
                                                />
                                            </FormGroup>
                                        </Col>
                                    </Row>
                                </CardBody>
                            </Card>

                            {/* 2. Grilla de productos */}
                            <Card className="mb-3">
                                <CardHeader className="bg-info text-white d-flex justify-content-between align-items-center">
                                    <div className="d-flex align-items-center gap-2">
                                        <Package size={18} />
                                        <span>Productos</span>
                                        <Badge color="light" className="text-dark">
                                            {formData.detail.length}
                                        </Badge>
                                    </div>
                                    <Button color="light" size="sm" onClick={() => setShowProductModal(true)}>
                                        <Plus size={16} /> Agregar Producto
                                    </Button>
                                </CardHeader>
                                <CardBody className="p-0">
                                    {formData.detail.length > 0 ? (
                                        <div className="table-responsive">
                                            <Table className="mb-0">
                                                <thead className="bg-light">
                                                    <tr>
                                                        <th>Producto</th>
                                                        <th width="100">Precio</th>
                                                        <th width="80">Cant.</th>
                                                        <th width="80">Desc.%</th>
                                                        <th width="100">Total</th>
                                                        <th width="80">Acciones</th>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    {formData.detail.map((item, index) => (
                                                        <tr key={index}>
                                                            <td>
                                                                <div>
                                                                    <div className="fw-bold">{item.productName}</div>
                                                                    <small className="text-muted">{item.productSku}</small>
                                                                </div>
                                                            </td>
                                                            <td>
                                                                <Input
                                                                    type="number"
                                                                    size="sm"
                                                                    value={item.itemPrice}
                                                                    onChange={(e) => updateOrderItem(index, "itemPrice", Number(e.target.value))}
                                                                    min="0"
                                                                    step="0.01"
                                                                />
                                                            </td>
                                                            <td>
                                                                <Input
                                                                    type="number"
                                                                    size="sm"
                                                                    value={item.itemQuantity}
                                                                    onChange={(e) => updateOrderItem(index, "itemQuantity", Number(e.target.value))}
                                                                    min="1"
                                                                />
                                                            </td>
                                                            <td>
                                                                <Input
                                                                    type="number"
                                                                    size="sm"
                                                                    value={item.discountPercentage}
                                                                    onChange={(e) => updateOrderItem(index, "discountPercentage", Number(e.target.value))}
                                                                    min="0"
                                                                    max="100"
                                                                    step="0.01"
                                                                />
                                                            </td>
                                                            <td className="fw-bold">${item.itemTotal?.toLocaleString()}</td>
                                                            <td>
                                                                <Button color="danger" size="sm" onClick={() => removeOrderItem(index)} title="Eliminar">
                                                                    <Trash2 size={14} />
                                                                </Button>
                                                            </td>
                                                        </tr>
                                                    ))}
                                                </tbody>
                                            </Table>
                                        </div>
                                    ) : (
                                        <div className="text-center py-4 text-muted">
                                            <Package size={48} className="mb-2 opacity-50" />
                                            <p>No hay productos agregados</p>
                                            <Button color="primary" onClick={() => setShowProductModal(true)}>
                                                <Plus size={16} /> Agregar Primer Producto
                                            </Button>
                                        </div>
                                    )}
                                </CardBody>
                            </Card>

                            {/* 3. Formas de pago */}
                            <Card className="mb-3">
                                <CardHeader className="bg-warning text-dark d-flex justify-content-between align-items-center">
                                    <div className="d-flex align-items-center gap-2">
                                        <CreditCard size={18} />
                                        <span>Formas de Pago</span>
                                        <Badge color="dark">{paymentMethods.length}</Badge>
                                    </div>
                                    <Button color="dark" size="sm" onClick={addPaymentMethod}>
                                        <Plus size={16} /> Agregar Pago
                                    </Button>
                                </CardHeader>
                                <CardBody className="p-0">
                                    {paymentMethods.length > 0 ? (
                                        <div className="table-responsive">
                                            <Table className="mb-0">
                                                <thead className="bg-light">
                                                    <tr>
                                                        <th>Cuenta</th>
                                                        <th width="120">Fecha</th>
                                                        <th width="100">Valor</th>
                                                        <th width="120">Soporte</th>
                                                        <th width="80">Acciones</th>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    {paymentMethods.map((payment, index) => (
                                                        <tr key={index}>
                                                            <td>
                                                                <Input
                                                                    type="select"
                                                                    size="sm"
                                                                    value={payment.accountId}
                                                                    onChange={(e) => updatePaymentMethod(index, "accountId", e.target.value)}
                                                                >
                                                                    <option value="">Seleccionar cuenta...</option>
                                                                    {accounts.map((account) => (
                                                                        <option key={account._id} value={account._id}>
                                                                            {account.name}
                                                                        </option>
                                                                    ))}
                                                                </Input>
                                                            </td>
                                                            <td>
                                                                <Input
                                                                    type="date"
                                                                    size="sm"
                                                                    value={payment.paymentDate}
                                                                    onChange={(e) => updatePaymentMethod(index, "paymentDate", e.target.value)}
                                                                />
                                                            </td>
                                                            <td>
                                                                <Input
                                                                    type="number"
                                                                    size="sm"
                                                                    value={payment.value}
                                                                    onChange={(e) => updatePaymentMethod(index, "value", Number(e.target.value))}
                                                                    min="0"
                                                                    step="0.01"
                                                                />
                                                            </td>
                                                            <td>
                                                                <div className="d-flex align-items-center gap-1">
                                                                    <Input
                                                                        type="file"
                                                                        size="sm"
                                                                        accept="image/*,.pdf"
                                                                        onChange={(e) => handleFileUpload(index, e.target.files[0])}
                                                                        style={{ display: "none" }}
                                                                        id={`file-${index}`}
                                                                    />
                                                                    <Button
                                                                        color="outline-secondary"
                                                                        size="sm"
                                                                        onClick={() => document.getElementById(`file-${index}`).click()}
                                                                        disabled={uploadingFiles[index]}
                                                                    >
                                                                        {uploadingFiles[index] ? <Spinner size="sm" /> : <Upload size={14} />}
                                                                    </Button>
                                                                    {payment.paymentSupport && (
                                                                        <Badge color="success" className="ms-1">
                                                                            ✓
                                                                        </Badge>
                                                                    )}
                                                                </div>
                                                            </td>
                                                            <td>
                                                                <Button
                                                                    color="danger"
                                                                    size="sm"
                                                                    onClick={() => removePaymentMethod(index)}
                                                                    title="Eliminar"
                                                                >
                                                                    <Trash2 size={14} />
                                                                </Button>
                                                            </td>
                                                        </tr>
                                                    ))}
                                                </tbody>
                                            </Table>
                                        </div>
                                    ) : (
                                        <div className="text-center py-4 text-muted">
                                            <CreditCard size={48} className="mb-2 opacity-50" />
                                            <p>No hay formas de pago agregadas</p>
                                            <Button color="warning" onClick={addPaymentMethod}>
                                                <Plus size={16} /> Agregar Primera Forma de Pago
                                            </Button>
                                        </div>
                                    )}
                                </CardBody>
                            </Card>
                        </Col>

                        {/* 4. Resumen de costos */}
                        <Col lg={4}>
                            <Card className="sticky-top" style={{ top: "20px" }}>
                                <CardHeader className="bg-success text-white d-flex align-items-center gap-2">
                                    <Calculator size={18} />
                                    <span>Resumen de Costos</span>
                                </CardHeader>
                                <CardBody>
                                    <div className="d-flex justify-content-between mb-2">
                                        <span>Total Bruto:</span>
                                        <span className="fw-bold">${summary.totalBruto.toLocaleString()}</span>
                                    </div>
                                    <div className="d-flex justify-content-between mb-2 text-danger">
                                        <span>Descuentos:</span>
                                        <span>-${summary.totalDescuentos.toLocaleString()}</span>
                                    </div>
                                    <div className="d-flex justify-content-between mb-2">
                                        <span>Subtotal:</span>
                                        <span className="fw-bold">${summary.subtotal.toLocaleString()}</span>
                                    </div>
                                    <div className="d-flex justify-content-between mb-2 text-info">
                                        <span>Total IVA:</span>
                                        <span>+${summary.totalIVA.toLocaleString()}</span>
                                    </div>
                                    <div className="d-flex justify-content-between mb-3 text-warning">
                                        <span>Total Retenciones:</span>
                                        <span>-${summary.totalRetenciones.toLocaleString()}</span>
                                    </div>
                                    <hr />
                                    <div className="d-flex justify-content-between">
                                        <span className="h5 fw-bold">Total a Pagar:</span>
                                        <span className="h5 fw-bold text-success">${summary.totalAPagar.toLocaleString()}</span>
                                    </div>

                                    <div className="mt-3 pt-3 border-top">
                                        <small className="text-muted">
                                            <div>Productos: {formData.detail.length}</div>
                                            <div>Cantidad total: {formData.detail.reduce((sum, item) => sum + item.itemQuantity, 0)}</div>
                                            <div>Formas de pago: {paymentMethods.length}</div>
                                        </small>
                                    </div>
                                </CardBody>
                            </Card>
                        </Col>
                    </Row>
                </Form>

                {/* Modal de búsqueda de productos */}
                <Modal isOpen={showProductModal} toggle={() => setShowProductModal(false)} size="lg">
                    <ModalHeader toggle={() => setShowProductModal(false)}>Buscar y Agregar Producto</ModalHeader>
                    <ModalBody>
                        <FormGroup>
                            <Label>Buscar producto por nombre o SKU</Label>
                            <InputGroup>
                                <InputGroupText>
                                    <Search size={16} />
                                </InputGroupText>
                                <Input
                                    type="text"
                                    placeholder="Escriba para buscar..."
                                    value={productSearchTerm}
                                    onChange={(e) => {
                                        setProductSearchTerm(e.target.value)
                                        handleProductSearch(e.target.value)
                                    }}
                                />
                            </InputGroup>
                        </FormGroup>

                        {searchLoading && (
                            <div className="text-center py-3">
                                <Spinner color="primary" />
                                <p className="mt-2">Buscando productos...</p>
                            </div>
                        )}

                        {searchResults.length > 0 && (
                            <div className="mt-3">
                                <h6>Resultados de búsqueda:</h6>
                                <div className="table-responsive">
                                    <Table hover>
                                        <thead>
                                            <tr>
                                                <th>Producto</th>
                                                <th>Precio Costo</th>
                                                <th>Stock</th>
                                                <th>Acción</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {searchResults.map((product) => (
                                                <tr key={product._id}>
                                                    <td>
                                                        <div>
                                                            <div className="fw-bold">{product.name}</div>
                                                            <small className="text-muted">{product.sku}</small>
                                                        </div>
                                                    </td>
                                                    <td className="fw-bold">${product.costPrice.toLocaleString()}</td>
                                                    <td>
                                                        <Badge color={product.stock > 10 ? "success" : product.stock > 0 ? "warning" : "danger"}>
                                                            {product.stock}
                                                        </Badge>
                                                    </td>
                                                    <td>
                                                        <Button color="primary" size="sm" onClick={() => addProductToOrder(product)}>
                                                            <Plus size={14} /> Agregar
                                                        </Button>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </Table>
                                </div>
                            </div>
                        )}

                        {productSearchTerm.length >= 2 && searchResults.length === 0 && !searchLoading && (
                            <Alert color="info" className="mt-3">
                                No se encontraron productos que coincidan con "{productSearchTerm}"
                            </Alert>
                        )}
                    </ModalBody>
                    <ModalFooter>
                        <Button color="secondary" onClick={() => setShowProductModal(false)}>
                            Cerrar
                        </Button>
                    </ModalFooter>
                </Modal>
            </Container>
        </div>
    )
}
