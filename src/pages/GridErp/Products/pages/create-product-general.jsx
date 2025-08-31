"use client"
import { useState, useEffect, useRef } from "react"
import {
    Container,
    Card,
    CardBody,
    Form,
    FormGroup,
    Label,
    Input,
    Button,
    Alert,
    Spinner,
    InputGroup,
    InputGroupText,
    Badge,
    Progress,
    Row,
    Col,
} from "reactstrap"
import { ArrowLeft, Save, Package, DollarSign, Tag, Building, Camera, Upload, ImageIcon, CheckCheck, Trash2, Check } from "lucide-react"
import { ProductHelper } from "../helper/product_helper"
import { useNavigate } from "react-router-dom"

const productHelper = new ProductHelper();

export default function CrearProductoGeneral() {
    const navigate = useNavigate();
    const fileInputRef = useRef(null);

    // Estados para los datos del formulario
    const [formData, setFormData] = useState({
        externalId: "",
        companyId: "",
        warehouseId: "",
        providerId: "",
        historyActivityUserId: localStorage.getItem("userId"),
        name: "",
        description: "",
        id_type_product: "",
        sku: "",
        unitOfMeasureId: "",
        taxId: "",
        id_category: "",
        id_sub_category: "",
        salePrice: "",
        costPrice: "",
        quantity: 1,
        barCode: "",
        taxIncluded: false,
        additionalConfigs: {
            images: [],
        },
    })

    // Estados para los datos de los selects
    const [selectData, setSelectData] = useState({
        companies: [],
        warehouses: [],
        productTypes: [],
        unitsOfMeasure: [],
        taxes: [],
        categories: [],
        subCategories: [],
        typeProducts: [],
    })

    // Estados de control
    const [loading, setLoading] = useState({
        form: false,
        companies: false,
        warehouses: false,
        productTypes: false,
        unitsOfMeasure: false,
        taxes: false,
        categories: false,
        subCategories: false,
        typeProducts: false,
    })

    // Estados para manejo de imágenes
    const [imageUploading, setImageUploading] = useState(false)
    const [uploadProgress, setUploadProgress] = useState({})

    const [error, setError] = useState("")
    const [success, setSuccess] = useState("")
    const [errors, setErrors] = useState({})

    // Cargar datos iniciales
    useEffect(() => {
        loadInitialData()
    }, [])

    // Cargar bodegas cuando cambie la empresa
    useEffect(() => {
        if (formData.companyId) {
            loadWarehouses(formData.companyId)
        } else {
            setSelectData((prev) => ({ ...prev, warehouses: [] }))
            setFormData((prev) => ({ ...prev, warehouseId: "" }))
        }
    }, [formData.companyId])

    // Cargar subcategorías cuando cambie la categoría
    useEffect(() => {
        if (formData.id_category) {
            loadSubCategories(formData.id_category)
        } else {
            setSelectData((prev) => ({ ...prev, subCategories: [] }))
            setFormData((prev) => ({ ...prev, id_sub_category: "" }))
        }
    }, [formData.id_category])

    const loadInitialData = async () => {
        try {
            setLoading((prev) => ({
                ...prev,
                unitsOfMeasure: true,
                taxes: true,
                categories: true,
                typeProducts: true,
            }))

            const [unitsOfMeasure, taxes, categories, warehouses, typeProducts] = await Promise.all([
                productHelper.getAllUnitsMeasure(),
                productHelper.getAllTaxes(productHelper.companyId),
                productHelper.getCategoriesFullByProduct(productHelper.companyId),
                productHelper.getWarehouseByCompany(productHelper.companyId),
                productHelper.getTypesProduct(),
            ]);

            let categoriesGeneral = categories?.data
                .filter((category) => category.shortCode.toLowerCase() === "general")

            setSelectData((prev) => ({
                ...prev,
                unitsOfMeasure,
                taxes,
                categories: categoriesGeneral,
                warehouses: warehouses?.data,
                typeProducts: typeProducts?.data,
            }));

            let typeProductGeneral = typeProducts?.data.find((typeProduct) => typeProduct.name.toLowerCase() === "general");
            setFormData((prev) => ({
                ...prev,
                id_type_product: typeProductGeneral?._id,
            }));

        } catch (err) {
            setError("Error al cargar los datos iniciales: " + err.message)
        } finally {
            setLoading((prev) => ({
                ...prev,
                companies: false,
                productTypes: false,
                unitsOfMeasure: false,
                taxes: false,
                categories: false,
                typeProducts: false,
            }))
        }
    }

    const loadWarehouses = async (companyId) => {
        try {
            setLoading((prev) => ({ ...prev, warehouses: true }))
            const warehouses = await productHelper.getWarehouses(companyId)
            setSelectData((prev) => ({ ...prev, warehouses }))
        } catch (err) {
            setError("Error al cargar las bodegas: " + err.message)
        } finally {
            setLoading((prev) => ({ ...prev, warehouses: false }))
        }
    }

    const loadSubCategories = async (categoryId) => {
        try {
            setLoading((prev) => ({ ...prev, subCategories: true }))
            const subCategories = await productHelper.getSubCategories(categoryId)
            setSelectData((prev) => ({ ...prev, subCategories }))
        } catch (err) {
            setError("Error al cargar las subcategorías: " + err.message)
        } finally {
            setLoading((prev) => ({ ...prev, subCategories: false }))
        }
    }

    const handleSetLastSku = async () => {
        let { lastSku } = await productHelper.getLastSku(companyId);
        return lastSku;
    }

    const handleInputChange = (e) => {
        const { name, value, type, checked } = e.target
        setFormData((prev) => ({
            ...prev,
            [name]: type === "checkbox" ? checked : value,
        }))
    }

    // Función para manejar la selección de archivos
    const handleFileSelect = (e) => {
        const files = Array.from(e.target.files)
        if (files.length === 0) return

        // Filtrar solo imágenes
        const imageFiles = files.filter((file) => file.type.startsWith("image/"))

        if (imageFiles.length !== files.length) {
            setError("Solo se permiten archivos de imagen")
            return
        }

        // Subir cada imagen
        imageFiles.forEach((file) => uploadSingleImage(file))

        // Limpiar el input
        if (fileInputRef.current) {
            fileInputRef.current.value = ""
        }
    }

    // Función para subir una imagen individual
    const uploadSingleImage = async (file) => {
        const fileId = Date.now() + "_" + Math.random().toString(36).substr(2, 9)

        try {
            setImageUploading(true)
            setUploadProgress((prev) => ({ ...prev, [fileId]: 0 }))

            // Simular progreso de subida
            const progressInterval = setInterval(() => {
                setUploadProgress((prev) => {
                    const currentProgress = prev[fileId] || 0
                    if (currentProgress >= 90) {
                        clearInterval(progressInterval)
                        return prev
                    }
                    return { ...prev, [fileId]: currentProgress + 10 }
                })
            }, 200)

            const response = await productHelper.uploadImage(file)

            clearInterval(progressInterval)
            setUploadProgress((prev) => ({ ...prev, [fileId]: 100 }))

            if (response.success) {
                // Agregar la URL a las imágenes del formulario
                setFormData((prev) => ({
                    ...prev,
                    additionalConfigs: {
                        ...prev.additionalConfigs,
                        images: [...prev.additionalConfigs.images, { url: response.url, hasPublic: false }],
                    },
                }))

                // Limpiar el progreso después de un momento
                setTimeout(() => {
                    setUploadProgress((prev) => {
                        const newProgress = { ...prev }
                        delete newProgress[fileId]
                        return newProgress
                    })
                }, 1000)
            }
        } catch (err) {
            setError("Error al subir la imagen: " + err.message)
            setUploadProgress((prev) => {
                const newProgress = { ...prev }
                delete newProgress[fileId]
                return newProgress
            })
        } finally {
            setImageUploading(false)
        }
    }

    // Función para eliminar una imagen
    const removeImage = (indexToRemove) => {
        setFormData((prev) => ({
            ...prev,
            additionalConfigs: {
                ...prev.additionalConfigs,
                images: prev.additionalConfigs.images.filter((_, index) => index !== indexToRemove),
            },
        }))
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        setError("")
        setErrors({})
        setSuccess("")
        setLoading((prev) => ({ ...prev, form: true }));

        if (!productHelper.validateFormGeneral(setErrors, formData)) {
            setLoading((prev) => ({ ...prev, form: false }))
            return
        }

        try {
            // Preparar datos para envío
            let lastSku = await handleSetLastSku();
            const productData = {
                ...formData,
                name: formData.name.toUpperCase(),
                salePrice: Number.parseFloat(formData.salePrice) || 0,
                costPrice: Number.parseFloat(formData.costPrice) || 0,
                sku: lastSku,
            }
            const response = await productHelper.addProduct(productData)
            if (response?._id) {
                setSuccess('Producto creado!')
                // Redireccionar después de 2 segundos
                setTimeout(() => {
                    navigate("/products-list-v2")
                }, 2000)
            }
        } catch (err) {
            setError(err.message)
        } finally {
            setLoading((prev) => ({ ...prev, form: false }))
        }
    }

    const handleBack = () => {
        navigate("/products-list-v2")
    }

    const triggerFileInput = () => {
        if (fileInputRef.current) {
            fileInputRef.current.click()
        }
    }

    const handleMarkAsPublicImage = async (urlImage, hasPublic) => {
        let images = formData.additionalConfigs.images;
        let newImages = images.map((image) => {
            if (image.url === urlImage) {
                return {
                    ...image,
                    hasPublic: hasPublic,
                }
            }
            return image;
        });
        setFormData((prev) => ({
            ...prev,
            additionalConfigs: {
                ...prev.additionalConfigs,
                images: newImages,
            },
        }));
    }

    return (
        <div className="page-content">
            <Container fluid className="px-3 py-3" style={{ maxWidth: "100%", minHeight: "100vh", backgroundColor: "#f8f9fa" }}>
                {/* Header móvil */}
                <div
                    className="d-flex align-items-center mb-3 sticky-top bg-white py-2 px-2 rounded shadow-sm"
                    style={{ top: "10px", zIndex: 1 }}
                >
                    <Button color="light" size="sm" onClick={handleBack} className="me-2 p-2">
                        <ArrowLeft size={18} />
                    </Button>
                    <div className="flex-grow-1">
                        <h5 className="mb-0 fw-bold">Nuevo Producto</h5>
                        <small className="text-muted">Crear producto general</small>
                    </div>
                    <Button
                        color="primary"
                        size="sm"
                        onClick={handleSubmit}
                        disabled={loading.form}
                        className="d-flex align-items-center"
                    >
                        {loading.form ? <Spinner size="sm" className="me-1" /> : <Save size={16} className="me-1" />}
                        Guardar
                    </Button>
                </div>

                {/* Alertas */}
                {error && (
                    <Alert color="danger" className="mb-3" toggle={() => setError("")}>
                        {error}
                    </Alert>
                )}

                {success && (
                    <Alert color="success" className="mb-3">
                        {success}
                    </Alert>
                )}

                <Form onSubmit={handleSubmit}>
                    {/* Información Básica */}
                    <Card className="mb-3 shadow-sm">
                        <CardBody className="p-3">
                            <div className="d-flex align-items-center mb-3">
                                <Package size={20} className="text-primary me-2" />
                                <h6 className="mb-0 fw-bold">Información Básica</h6>
                            </div>

                            <Row>
                                <Col md={6} sm={12} lg={6}>
                                    <FormGroup className="mb-3">
                                        <Label for="name" className="form-label fw-medium small">
                                            Nombre del Producto *
                                        </Label>
                                        <Input
                                            type="text"
                                            id="name"
                                            name="name"
                                            value={formData.name}
                                            onChange={handleInputChange}
                                            placeholder="Ej: Limpiador Premium"
                                            required
                                            size="sm"
                                        />
                                        {errors.name && <span className="text-danger">{errors.name}</span>}
                                    </FormGroup>
                                </Col>

                                <Col md={6} sm={12}>
                                    <FormGroup className="mb-0">
                                        <Label for="barCode" className="form-label fw-medium small">
                                            Código de Barras
                                        </Label>
                                        <Input
                                            type="text"
                                            id="barCode"
                                            name="barCode"
                                            value={formData.barCode}
                                            onChange={handleInputChange}
                                            placeholder="Código de barras"
                                            size="sm"
                                        />
                                    </FormGroup>
                                </Col>
                            </Row>
                            <Row>
                                <Col md={6} sm={12}>
                                    <FormGroup className="mb-3">
                                        <Label for="externalId" className="form-label fw-medium small">
                                            Referencia
                                        </Label>
                                        <Input
                                            type="text"
                                            id="externalId"
                                            name="externalId"
                                            value={formData.externalId}
                                            onChange={handleInputChange}
                                            placeholder="Referencia del producto"
                                            size="sm"
                                        />
                                    </FormGroup>
                                </Col>
                                <Col md={6} sm={12} lg={6}>
                                    <FormGroup className="mb-0">
                                        <Label for="quantity" className="form-label fw-medium small">
                                            Cantidad
                                        </Label>
                                        <Input
                                            type="number"
                                            id="quantity"
                                            name="quantity"
                                            value={formData.quantity}
                                            onChange={handleInputChange}
                                            placeholder="Cantidad"
                                            size="sm"
                                        />
                                        {errors.quantity && <span className="text-danger">{errors.quantity}</span>}
                                    </FormGroup>
                                </Col>
                            </Row>
                            <Row>
                                <Col md={12} sm={12} lg={12}>
                                    <FormGroup className="mb-3">
                                        <Label for="description" className="form-label fw-medium small">
                                            Descripción
                                        </Label>
                                        <Input
                                            type="textarea"
                                            id="description"
                                            name="description"
                                            value={formData.description}
                                            onChange={handleInputChange}
                                            placeholder="Descripción del producto"
                                            rows={2}
                                            size="sm"
                                        />
                                    </FormGroup>
                                </Col>
                            </Row>
                        </CardBody>
                    </Card>

                    {/* Empresa y Ubicación */}
                    <Card className="mb-3 shadow-sm">
                        <CardBody className="p-3">
                            <div className="d-flex align-items-center mb-3">
                                <Building size={20} className="text-primary me-2" />
                                <h6 className="mb-0 fw-bold">Ubicación</h6>
                            </div>


                            <FormGroup className="mb-0">
                                <Label for="warehouseId" className="form-label fw-medium small">
                                    Bodega
                                </Label>
                                <Input
                                    type="select"
                                    id="warehouseId"
                                    name="warehouseId"
                                    value={formData.warehouseId}
                                    onChange={handleInputChange}
                                    size="sm"
                                    disabled={loading.warehouses}
                                >
                                    <option value="">{loading.warehouses ? "Cargando..." : "Seleccionar bodega"}</option>
                                    {selectData.warehouses.map((warehouse) => (
                                        <option key={warehouse._id} value={warehouse._id}>
                                            {warehouse.name} ({warehouse.shortCode})
                                        </option>
                                    ))}
                                </Input>
                                {errors.warehouseId && <span className="text-danger">{errors.warehouseId}</span>}
                            </FormGroup>
                        </CardBody>
                    </Card>

                    {/* Clasificación */}
                    <Card className="mb-3 shadow-sm">
                        <CardBody className="p-3">
                            <div className="d-flex align-items-center mb-3">
                                <Tag size={20} className="text-primary me-2" />
                                <h6 className="mb-0 fw-bold">Clasificación</h6>
                            </div>

                            <Row>
                                <Col md={4} sm={12} lg={4}>
                                    <FormGroup className="mb-3">
                                        <Label for="id_type_product" className="form-label fw-medium small">
                                            Tipo de producto *
                                        </Label>
                                        <Input
                                            type="select"
                                            id=""
                                            name="id_type_product"
                                            value={formData.id_type_product}
                                            onChange={handleInputChange}
                                            required
                                            size="sm"
                                            disabled
                                        >
                                            <option value="">{loading.categories ? "Cargando..." : "Seleccionar tipo de producto"}</option>
                                            {selectData.typeProducts.map((typeProduct) => (
                                                <option key={typeProduct._id} value={typeProduct._id}>
                                                    {typeProduct.name}
                                                </option>
                                            ))}
                                        </Input>
                                    </FormGroup>
                                </Col>
                                <Col md={4} sm={12} lg={4}>
                                    <FormGroup className="mb-3">
                                        <Label for="id_category" className="form-label fw-medium small">
                                            Categoría *
                                        </Label>
                                        <Input
                                            type="select"
                                            id="id_category"
                                            name="id_category"
                                            value={formData.id_category}
                                            onChange={handleInputChange}
                                            required
                                            size="sm"
                                            disabled={loading.categories}
                                        >
                                            <option value="">{loading.categories ? "Cargando..." : "Seleccionar categoría"}</option>
                                            {selectData.categories.map((category) => (
                                                <option key={category._id} value={category._id}>
                                                    {category.name}
                                                </option>
                                            ))}
                                        </Input>
                                        {errors.id_category && <span className="text-danger">{errors.id_category}</span>}
                                    </FormGroup>
                                </Col>
                                <Col md={4} sm={12} lg={4}>
                                    <FormGroup className="mb-0">
                                        <Label for="unitOfMeasureId" className="form-label fw-medium small">
                                            Unidad de Medida
                                        </Label>
                                        <Input
                                            type="select"
                                            id="unitOfMeasureId"
                                            name="unitOfMeasureId"
                                            value={formData.unitOfMeasureId}
                                            onChange={handleInputChange}
                                            size="sm"
                                            disabled={loading.unitsOfMeasure}
                                        >
                                            <option value="">{loading.unitsOfMeasure ? "Cargando..." : "Seleccionar unidad"}</option>
                                            {selectData.unitsOfMeasure.map((unit) => (
                                                <option key={unit._id} value={unit._id}>
                                                    {unit.name}
                                                </option>
                                            ))}
                                        </Input>
                                        {errors.unitOfMeasureId && <span className="text-danger">{errors.unitOfMeasureId}</span>}
                                    </FormGroup>
                                </Col>
                            </Row>
                        </CardBody>
                    </Card>

                    {/* Precios e Impuestos */}
                    <Card className="mb-3 shadow-sm">
                        <CardBody className="p-3">
                            <div className="d-flex align-items-center mb-3">
                                <DollarSign size={20} className="text-primary me-2" />
                                <h6 className="mb-0 fw-bold">Precios e Impuestos</h6>
                            </div>

                            <Row>
                                <Col md={6} sm={12} lg={6}>
                                    <FormGroup className="mb-3">
                                        <Label for="salePrice" className="form-label fw-medium small">
                                            Precio de Venta *
                                        </Label>
                                        <InputGroup size="sm">
                                            <InputGroupText>$</InputGroupText>
                                            <Input
                                                type="number"
                                                id="salePrice"
                                                name="salePrice"
                                                value={formData.salePrice}
                                                onChange={handleInputChange}
                                                placeholder="0.00"
                                                min="0"
                                                step="0.01"
                                                required
                                            />
                                        </InputGroup>
                                        {errors.salePrice && <span className="text-danger">{errors.salePrice}</span>}
                                    </FormGroup>
                                </Col>
                                <Col md={6} sm={12} lg={6}>
                                    <FormGroup className="mb-3">
                                        <Label for="costPrice" className="form-label fw-medium small">
                                            Precio de Costo *
                                        </Label>
                                        <InputGroup size="sm">
                                            <InputGroupText>$</InputGroupText>
                                            <Input
                                                type="number"
                                                id="costPrice"
                                                name="costPrice"
                                                value={formData.costPrice}
                                                onChange={handleInputChange}
                                                placeholder="0.00"
                                                min="0"
                                                step="0.01"
                                                required
                                            />
                                        </InputGroup>
                                          {errors.costPrice && <span className="text-danger">{errors.costPrice}</span>}
                                    </FormGroup>
                                </Col>
                            </Row>

                            <Row>
                                <Col md={6} sm={12} lg={6}>
                                    <FormGroup className="mb-3">
                                        <Label for="taxId" className="form-label fw-medium small">
                                            Impuesto *
                                        </Label>
                                        <Input
                                            type="select"
                                            id="taxId"
                                            name="taxId"
                                            value={formData.taxId}
                                            onChange={handleInputChange}
                                            required
                                            size="sm"
                                            disabled={loading.taxes}
                                        >
                                            <option value="">{loading.taxes ? "Cargando..." : "Seleccionar impuesto"}</option>
                                            {selectData.taxes.map((tax) => (
                                                <option key={tax._id} value={tax._id}>
                                                    {tax.name} ({tax.percentage}%)
                                                </option>
                                            ))}
                                        </Input>
                                        {errors.taxId && <span className="text-danger">{errors.taxId}</span>}
                                    </FormGroup>

                                </Col>
                                <Col md={6} sm={12} lg={6}>
                                    <FormGroup className="mb-0">
                                        <div className="form-check">
                                            <Input
                                                type="checkbox"
                                                id="taxIncluded"
                                                name="taxIncluded"
                                                checked={formData.taxIncluded}
                                                onChange={handleInputChange}
                                                className="form-check-input"
                                            />
                                            <Label for="taxIncluded" className="form-check-label small">
                                                Precio incluye impuestos
                                            </Label>
                                        </div>
                                    </FormGroup>
                                </Col>
                            </Row>
                        </CardBody>
                    </Card>

                    {/* Imágenes del Producto */}
                    <Card className="mb-3 shadow-sm">
                        <CardBody className="p-3">
                            <div className="d-flex align-items-center mb-3">
                                <Camera size={20} className="text-primary me-2" />
                                <h6 className="mb-0 fw-bold">Imágenes del Producto</h6>
                                <Badge color="secondary" className="ms-2">
                                    {formData.additionalConfigs.images.length}
                                </Badge>
                            </div>

                            {/* Input oculto para archivos */}
                            <input
                                ref={fileInputRef}
                                type="file"
                                multiple
                                accept="image/*"
                                onChange={handleFileSelect}
                                style={{ display: "none" }}
                            />

                            {/* Botón para agregar imágenes */}
                            <div className="mb-3">
                                <Button
                                    color="outline-primary"
                                    size="sm"
                                    onClick={triggerFileInput}
                                    disabled={imageUploading}
                                    className="w-100 d-flex align-items-center justify-content-center py-2"
                                >
                                    {imageUploading ? (
                                        <>
                                            <Spinner size="sm" className="me-2" />
                                            Subiendo...
                                        </>
                                    ) : (
                                        <>
                                            <Upload size={16} className="me-2" />
                                            Agregar Imágenes
                                        </>
                                    )}
                                </Button>
                                <small className="text-muted d-block mt-1">
                                    Selecciona múltiples imágenes (solo archivos de imagen, máx. 5MB cada una)
                                </small>
                            </div>

                            {/* Progreso de subida */}
                            {Object.keys(uploadProgress).length > 0 && (
                                <div className="mb-3">
                                    {Object.entries(uploadProgress).map(([fileId, progress]) => (
                                        <div key={fileId} className="mb-2">
                                            <div className="d-flex justify-content-between align-items-center mb-1">
                                                <small className="text-muted">{progress === 100 ? "Imagen cargada con éxito ✅" : "Subiendo imagen... ⌛"}</small>
                                                <small className="text-muted">{progress}%</small>
                                            </div>
                                            <Progress value={progress} color="primary" style={{ height: "4px" }} />
                                        </div>
                                    ))}
                                </div>
                            )}

                            {/* Lista de imágenes subidas */}
                            {formData.additionalConfigs.images.length > 0 && (
                                <div className="row g-2">
                                    {formData.additionalConfigs.images.map((imageObj, index) => (
                                        <div key={index} className="col-6 col-sm-4">
                                            <div className="position-relative">
                                                <div
                                                    className="bg-light rounded d-flex align-items-center justify-content-center"
                                                    style={{ height: "80px", border: "1px solid #dee2e6" }}
                                                >
                                                    <img src={imageObj.url} alt="Producto" width="100%" height="100%" />
                                                </div>
                                                <Button
                                                    title={imageObj.hasPublic ? "Marcar como público" : "Marcar como privado"}
                                                    color={imageObj.hasPublic ? "success" : "primary"}
                                                    size="sm"
                                                    className="position-absolute top-0 end-0 p-1"
                                                    style={{ transform: "translate(-90%, -25%)" }}
                                                    onClick={() => handleMarkAsPublicImage(imageObj.url, !imageObj.hasPublic)}
                                                >
                                                    {imageObj.hasPublic ? <CheckCheck size={12} /> : <Check size={12} />}
                                                </Button>
                                                <Button
                                                    color="danger"
                                                    size="sm"
                                                    className="position-absolute top-0 end-0 p-1"
                                                    style={{ transform: "translate(25%, -25%)" }}
                                                    onClick={() => removeImage(index)}
                                                >
                                                    <Trash2 size={12} />
                                                </Button>
                                                <div className="position-absolute bottom-0 start-0 end-0 bg-dark bg-opacity-75 text-white p-1 rounded-bottom">
                                                    <small className="d-block text-truncate" style={{ fontSize: "10px" }}>
                                                        Imagen {index + 1}
                                                    </small>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}

                            {formData.additionalConfigs.images.length === 0 && (
                                <div className="text-center py-3 text-muted">
                                    <ImageIcon size={32} className="mb-2" />
                                    <p className="mb-0 small">No hay imágenes agregadas</p>
                                </div>
                            )}
                        </CardBody>
                    </Card>

                    {/* Botones de acción móvil */}
                    <div className="d-grid gap-2 mb-4">
                        <Button
                            color="primary"
                            type="submit"
                            disabled={loading.form}
                            className="py-3 d-flex align-items-center justify-content-center"
                        >
                            {loading.form ? (
                                <>
                                    <Spinner size="sm" className="me-2" />
                                    Guardando...
                                </>
                            ) : (
                                <>
                                    <Save size={18} className="me-2" />
                                    Guardar Producto
                                </>
                            )}
                        </Button>

                        <Button color="light" type="button" onClick={handleBack} className="py-2">
                            <ArrowLeft size={16} className="me-2" />
                            Cancelar
                        </Button>
                    </div>
                </Form>
            </Container>
        </div >
    )
}
