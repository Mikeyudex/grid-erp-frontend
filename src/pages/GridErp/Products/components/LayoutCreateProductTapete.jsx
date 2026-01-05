"use client"
import { Fragment, useContext, useEffect, useRef, useState } from "react";
import { Alert, Badge, Button, Card, CardBody, Col, Input, Progress, Row, Spinner } from "reactstrap";
import Select from 'react-select';

import { useSnackbar } from 'react-simple-snackbar';
import CancelIcon from '@mui/icons-material/Cancel';
import { Camera, Check, CheckCheck, ImportIcon, Trash2, Upload } from "lucide-react";
import SaveIcon from '@mui/icons-material/Save';
import { useNavigate } from 'react-router-dom';
import { CircleAlert, WarehouseIcon, ImageIcon } from "lucide-react";

import './LayoutCreateProduct.css';
import { optionsSnackbarDanger, optionsSnackbarSuccess, ProductHelper } from '../helper/product_helper';
import SpeedDialProduct from "./SpeedDial";
import { BackdropGlobal } from "./Backdrop";
import '../pages/form-product.css';
import { DrawerProductsImport } from "./DrawerImportProduct";
import TopLayoutPage from "../../../../Layouts/TopLayoutPage";
import { ImportProductContext } from "../context/imports/importProductContext";
import { CollapsibleSection } from "../../../../Components/Common/CollapsibleSection";
import { FloatingInput } from "../../../../Components/Common/FloatingInput";
import { AdministrationHelper } from "../../Administration/helpers/administration-helper";
import { ZonesHelper } from "../../Zones/helper/zones_helper";
import { StylesLayoutCreateProduct } from "./styles";

const acceptedFileTypes = ['image/jpeg', 'image/png', 'image/gif'];
const helper = new ProductHelper();
const administrationHelper = new AdministrationHelper();
const zonesHelper = new ZonesHelper();
const typeOfPiecesDefault = ['Conductor', 'Copiloto', 'Segunda Fila'];

export default function LayoutCreateProductTapete({
    mode = "create",
    productId = null,
    initialData = null,
    onSubmit,
    onCancel,
}) {

    document.title = "Crear producto | Quality";
    const navigate = useNavigate();
    const fileInputRef = useRef(null);
    const { updateImportData, importData } = useContext(ImportProductContext);
    const [attributeConfigs, setAttributeConfigs] = useState([]);
    const [categories, setCategories] = useState([]);
    const [subcategories, setSubcategories] = useState([]);
    const [units, setUnits] = useState([]);
    const [taxes, setTaxes] = useState([]);
    const [typesProduct, setTypesProduct] = useState([]);
    const [typeOfPieces, setTypeOfPieces] = useState([]);
    const [lastSku, setLastSku] = useState("0");
    const [formData, setFormData] = useState({
        companyId: helper.companyId,
        externalId: '',
        historyActivityUserId: localStorage.getItem("userId"),
        name: '',
        description: '',
        id_type_product: '',
        id_category: '',
        quantity: 1,
        unitOfMeasureId: '',
        taxId: '',
        costPrice: '',
        salePrice: '',
        attributes: [],
        typeOfPieces: [],
        observations: "",
        barCode: "",
        taxIncluded: false,
        takenById: null,
        physicalMoldsId: null,
        additionalConfigs: {
            images: [],
        },
    });
    const [fileData, setFileData] = useState([]);
    const [hasSuccessProductCreate, setHasSuccessProductCreate] = useState(false);
    const [openSnackbarDanger, closeSnackbarDanger] = useSnackbar(optionsSnackbarDanger);
    const [openSnackbarSuccess, closeSnackbarSuccess] = useSnackbar(optionsSnackbarSuccess);
    const [openBackdrop, setOpenBackdrop] = useState(false);
    const [titleBackdrop, setTitleBackdrop] = useState("");
    const [savedProduct, setSavedProduct] = useState(false);
    const [idProduct, setIdProduct] = useState("");
    const [openDrawerImport, setOpenDrawerImport] = useState(false);
    const [openSections, setOpenSections] = useState({
        datosBasicos: true,
        inventario: false,
        multimedia: false,
        otros: false,
    });
    const [validationErrors, setValidationErrors] = useState({});
    const [isInitialLoading, setIsInitialLoading] = useState(true);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");
    const [users, setUsers] = useState([]);
    const [zones, setZones] = useState([]);
    // Estados para manejo de imágenes
    const [imageUploading, setImageUploading] = useState(false)
    const [uploadProgress, setUploadProgress] = useState({})


    useEffect(() => {
        if (mode === "edit" && (productId || initialData)) {
            loadProductData();
        }
    }, [mode, productId, initialData]);

    const loadProductData = async () => {
        setError("");
        setSuccess("");
        try {
            let productData = await helper.getProductById(productId);
            if (!productData) {
                setError("No se ha seleccionado ningun producto");
                return;
            }
            setFormData((prevFormData) => ({
                ...prevFormData,
                sku: productData?.sku,
                id_type_product: productData?.id_type_product?._id,
                id_category: productData?.id_category?._id,
                name: productData?.name,
                quantity: productData?.quantity ?? 1,
                unitOfMeasureId: productData?.unitOfMeasureId,
                taxId: productData?.taxId,
                costPrice: productData?.costPrice,
                salePrice: productData?.salePrice,
                attributes: productData?.attributes,
                typeOfPieces: productData?.typeOfPieces,
                observations: productData?.observations,
                barCode: productData?.barCode,
                taxIncluded: productData?.taxIncluded,
                takenById: productData?.takenById,
                physicalMoldsId: productData?.physicalMoldsId,
                additionalConfigs: {
                    images: productData?.additionalConfigs?.images ?? [],
                    hasBarcode: productData?.additionalConfigs?.hasBarcode ?? false,
                },
            }));


        } catch (error) {
            setError("Error al cargar los datos del cliente")
            console.error("Error loading client data:", err)
        } finally {
            setIsInitialLoading(false);
        }
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;

        setFormData((prevFormData) => ({
            ...prevFormData,
            [name]: value,
        }));
        if (name === 'id_category') {
            handleFilterSubcategories(value);
        }
    };

    const handleClearForm = () => {
        setFormData(
            {
                externalId: '',
                name: '',
                description: '',
                id_type_product: '',
                id_category: '',
                quantity: 0,
                unitOfMeasureId: '',
                taxId: '',
                costPrice: 0,
                salePrice: 0,
                attributes: [],
                observations: '',
                barCode: '',
                taxIncluded: false,
                taxPercent: '',
                takenById: null,
                physicalMoldsId: null,
                additionalConfigs: {
                    images: [],
                    hasBarcode: false,
                },
            }
        );
        setFileData([]);
        return;
    }

    const handleOpenDrawerImport = () => {
        updateImportData({ ...importData, openDrawer: !importData.openDrawer });
    };

    const handleFilterSubcategories = (categoryId) => {
        let categoryFiltered = categories.filter((category) => category?._id === categoryId)[0];
        setSubcategories(categoryFiltered?.subcategories ?? []);
    };

    const handleProductOperation = async (sync = false) => {
        try {
            // Validación del formulario
            if (!helper.validateForm(setValidationErrors, formData)) {
                return;
            }
            setOpenBackdrop(true);

            if (!savedProduct && mode === "create") {
                setTitleBackdrop("Creando producto...");
                let payload = preparePayload();
                let response = await helper.addProduct(payload);
                let idProduct = response?._id;
                setIdProduct(idProduct);
                openSnackbarSuccess('Producto creado!');
                setSavedProduct(true);
            } else if (mode === "edit") {
                setTitleBackdrop("Actualizando producto...");
                let payload = preparePayload();
                await onSubmit(payload);
                openSnackbarSuccess('Producto actualizado!');
                return;
            }

            handleClearForm();
            setAttributeConfigs([]);
            setFileData([]);
            return navigate('/products/success-product');

        } catch (error) {
            console.log(error);
            handleCloseBackdrop();
            openSnackbarDanger(`Error al ${mode === "edit" ? "actualizar" : "crear"} el producto. Inténtalo de nuevo.`);
            setHasSuccessProductCreate(false);
        }
    };

    const handleSubmit = async () => {
        await handleProductOperation(false);
    };

    const preparePayload = () => {
        let payload = formData;
        let payloadModiffied = mode === "create" ? { ...payload, sku: lastSku } : { ...payload };
        payloadModiffied.name = formData.name.toUpperCase();
        payloadModiffied.quantity = formData.quantity ?? 1;
        payloadModiffied.costPrice = Number(formData.costPrice) ?? 0;
        payloadModiffied.salePrice = Number(formData.costPrice) ?? 0;
        payloadModiffied.companyId = helper.companyId;
        return payloadModiffied;
    }

    const handleSetLastSku = async () => {
        let { lastSku } = await helper.getLastSku(helper.companyId);
        setLastSku(lastSku);
    }

    const handleCloseBackdrop = () => {
        setOpenBackdrop(false);
    }

    const toggleSection = (section) => {
        setOpenSections((prev) => ({
            ...prev,
            [section]: !prev[section],
        }))
    };

    const handleSwitchChange = (e) => {
        const { name, value, type, checked } = e.target;

        setFormData((prevFormData) => ({
            ...prevFormData,
            [name]: type === 'checkbox' ? checked : value,
        }));

    }

    const actions = [
        { icon: <SaveIcon />, name: `${mode === "edit" ? "Actualizar" : "Crear"}`, onClick: handleSubmit },
        { icon: <ImportIcon />, name: 'Importar', onClick: () => handleOpenDrawerImport() },
        { icon: <CancelIcon />, name: 'Cancelar' },
    ];

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

            const response = await helper.uploadImage(file)

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

    useEffect(() => {
        helper.getCategoriesFullByProduct(helper.companyId)
            .then(async (respCategoriesFull) => {
                let unitOfMeasures = await helper.getAllUnitsMeasure();
                let taxes = await helper.getAllTaxes(helper.companyId);
                let typesProduct = await helper.getTypesProduct();

                if (mode === "create") {
                    await handleSetLastSku();
                }
                let categories = respCategoriesFull?.data.filter((c) => c.shortCode.toLowerCase() !== "general");
                //ordenar alphabeticamente las categorías
                categories.sort((a, b) => a.name.localeCompare(b.name));
                setCategories(categories ?? []);
                setUnits(unitOfMeasures ?? []);
                setTaxes(taxes ?? []);
                setTypesProduct(typesProduct?.data ?? []);
            })
            .catch(error => {
                console.error('Error fetching categories:', error);
            })
            .finally(() => {
                setIsInitialLoading(false);
            });
    }, []);

    useEffect(() => {
        helper.getTypeOfPieces()
            .then(async (respTypeOfPieces) => {
                setTypeOfPieces(respTypeOfPieces);
                let typeOfPiecesFiltered = respTypeOfPieces
                    .filter((item) => typeOfPiecesDefault.includes(item?.name))
                    .map((p) => p?._id);

                setFormData(prevFormData => ({
                    ...prevFormData,
                    typeOfPieces: typeOfPiecesFiltered,
                }));
            })
            .catch(error => {
                console.error('Error fetching type of pieces:', error);
            });
    }, []);

    useEffect(() => {
        administrationHelper.getUsers()
            .then(response => response.json())
            .then(data => setUsers(data?.data ?? []))
            .catch(error => console.log(error));
    }, []);

    useEffect(() => {
        zonesHelper.getZones()
            .then(data => setZones(data ?? []))
            .catch(error => console.log(error));
    }, []);

    if (isInitialLoading) {
        return (
            <TopLayoutPage
                title={mode === "edit" ? "Actualizar producto" : "Crear producto"}
                pageTitle="Productos"
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
            <StylesLayoutCreateProduct />
            <Fragment>
                <DrawerProductsImport
                    openDrawer={openDrawerImport}
                    setOpenDrawer={setOpenDrawerImport}
                />
                <SpeedDialProduct actions={actions}> </SpeedDialProduct>
                <BackdropGlobal
                    openBackdrop={openBackdrop}
                    handleClose={handleCloseBackdrop}
                    title={titleBackdrop}
                />
            </Fragment >

            <TopLayoutPage
                title={mode === "edit" ? "Actualizar producto" : "Crear producto"}
                pageTitle={"Productos"}
                to={`/products/list-v2`}
                children={
                    <Fragment>

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

                        {/* Datos Básicos */}
                        <CollapsibleSection
                            id="datosBasicos"
                            title="Datos Básicos"
                            icon={CircleAlert}
                            isOpen={openSections.datosBasicos}
                            onToggle={toggleSection}
                        >
                            <Row className="mt-3">
                                <Col md={6}>
                                    <FloatingInput
                                        id="sku"
                                        name="sku"
                                        value={mode === "edit" ? formData.sku : lastSku}
                                        onChange={handleInputChange}
                                        label="Código"
                                        disabled
                                    />
                                    {validationErrors.sku && <span style={{ color: "red" }}>{validationErrors.sku}</span>}
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
                                        bsSize="lg"
                                        type="select"
                                        id="id_category"
                                        name="id_category"
                                        value={formData.id_category}
                                        onChange={handleInputChange}
                                        required
                                        className="form-control mb-3 floating-input"
                                    >
                                        <option value="0">Selecciona una marca <span className="text-danger">*</span></option>
                                        {
                                            categories.map((category) => {
                                                return (<option key={category?._id} label={category?.name} value={category?._id}></option>)
                                            })
                                        }
                                    </Input>
                                    {validationErrors.id_category && <span style={{ color: "red" }}>{validationErrors.id_category}</span>}
                                </Col>
                            </Row>
                            <Row>
                                <Col md={6}>
                                    <FloatingInput
                                        id="name"
                                        name="name"
                                        value={formData.name}
                                        onChange={handleInputChange}
                                        label="Nombre (Línea)"
                                        required
                                    />
                                    {validationErrors.name && <span style={{ color: "red" }}>{validationErrors.name}</span>}
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
                                        id="id_type_product"
                                        name="id_type_product"
                                        value={formData.id_type_product}
                                        onChange={handleInputChange}
                                        required
                                        className="form-control mb-3 floating-input"
                                    >
                                        <option value="0">Selecciona un tipo de vehículo <span className="text-danger">*</span></option>
                                        {
                                            typesProduct.map((typeProduct) => {
                                                return (<option key={typeProduct?._id} label={typeProduct?.name} value={typeProduct?._id}></option>)
                                            })
                                        }
                                    </Input>
                                    {validationErrors.id_type_product && <span style={{ color: "red" }}>{validationErrors.id_type_product}</span>}
                                </Col>


                            </Row>

                            <Row>
                                <Col md={6}>
                                    <Select
                                        id="typeOfPieces"
                                        name="typeOfPieces"
                                        isMulti

                                        options={typeOfPieces.map(piece => ({
                                            value: piece._id,
                                            label: piece.name
                                        }))}
                                        value={typeOfPieces
                                            .filter(piece => formData.typeOfPieces.includes(piece._id))
                                            .map(piece => ({ value: piece._id, label: piece.name }))
                                        }
                                        onChange={(selectedOptions) => {
                                            const values = selectedOptions.map(opt => opt.value);
                                            handleInputChange({ target: { name: "typeOfPieces", value: values } });
                                        }}
                                        classNamePrefix="react-select"
                                        placeholder="Selecciona uno o más tipos de piezas"
                                        className="form-control"
                                        styles={{
                                            control: (provided, state) => ({
                                                ...provided,
                                                backgroundColor: state.isFocused ? '#fff' : '#fff',
                                                borderColor: state.isFocused ? '#0d6efd' : '#ced4da',
                                                boxShadow: state.isFocused ? '0 0 0 0.2rem rgba(13, 110, 253, 0.25)' : '',
                                            }),
                                        }}
                                    />
                                    {validationErrors.typeOfPieces && <span style={{ color: "red" }}>{validationErrors.typeOfPieces}</span>}
                                </Col>

                                <Col md={6}>
                                    <FloatingInput
                                        id="observations"
                                        name="observations"
                                        value={formData.observations}
                                        onChange={handleInputChange}
                                        label="Observaciones"
                                    />
                                    {validationErrors.observations && <span style={{ color: "red" }}>{validationErrors.observations}</span>}
                                </Col>
                            </Row>

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
                                        id="takenById"
                                        name="takenById"
                                        value={formData.takenById}
                                        onChange={handleInputChange}
                                        className="form-control mb-3 floating-input"
                                    >
                                        <option value="0">Selecciona a quien tomó el molde</option>
                                        {
                                            users.map((user) => {
                                                return (<option key={user.id} label={`${user.name} ${user.lastname}`} value={user.id}></option>)
                                            })
                                        }
                                    </Input>
                                    {validationErrors.takenById && <span style={{ color: "red" }}>{validationErrors.takenById}</span>}
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
                                        id="physicalMoldsId"
                                        name="physicalMoldsId"
                                        value={formData.physicalMoldsId}
                                        onChange={handleInputChange}
                                        className="form-control mb-3 floating-input"
                                    >
                                        <option value="0">Sede donde están los moldes físicos </option>
                                        {
                                            zones.map((zone) => {
                                                return (<option key={zone._id} label={`${zone.name}`} value={zone._id}></option>)
                                            })
                                        }
                                    </Input>
                                    {validationErrors.physicalMoldsId && <span style={{ color: "red" }}>{validationErrors.physicalMoldsId}</span>}
                                </Col>
                            </Row>

                        </CollapsibleSection>

                        {/* Datos de inventario */}
                        <CollapsibleSection
                            id="inventario"
                            title="Datos de inventario"
                            icon={WarehouseIcon}
                            isOpen={openSections.inventario}
                            onToggle={toggleSection}
                        >
                            <Row className="mt-3">
                                <Col md={6}>
                                    <FloatingInput
                                        id="costPrice"
                                        name="costPrice"
                                        value={formData.costPrice}
                                        onChange={handleInputChange}
                                        label="Precio base"
                                        type="number"
                                        required
                                    />
                                    {validationErrors.costPrice && <span style={{ color: "red" }}>{validationErrors.costPrice}</span>}
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
                                        id="unitOfMeasureId"
                                        name="unitOfMeasureId"
                                        value={formData.unitOfMeasureId}
                                        onChange={handleInputChange}
                                        required
                                        className="form-control mb-3 floating-input"
                                    >
                                        <option value="0">Selecciona una unidad de medida <span className="text-danger">*</span></option>
                                        {
                                            units.map((unit) => {
                                                return (<option key={unit._id} label={`${unit.name} (${unit.abbreviation})`} value={unit._id}></option>)
                                            })
                                        }
                                    </Input>
                                    {validationErrors.unitOfMeasureId && <span style={{ color: "red" }}>{validationErrors.unitOfMeasureId}</span>}
                                </Col>
                            </Row>
                            <Row>
                                <Col md={6}>
                                    <FloatingInput
                                        name="barCode"
                                        id="barCode"
                                        value={formData.barCode}
                                        onChange={handleInputChange}
                                        label="Código de barras"
                                    />
                                    {validationErrors.barCode && <span style={{ color: "red" }}>{validationErrors.barCode}</span>}
                                </Col>

                                <Col md={6}>
                                    <span>¿El IVA está incluido en el precio de venta?</span>
                                    <div className="checkbox-wrapper-59 pt-1" style={{ display: 'flex', justifyContent: 'flex-start' }}>
                                        <label className="switch">
                                            <input
                                                type="checkbox"
                                                name={"taxIncluded"}
                                                id={"taxIncluded"}
                                                checked={formData.taxIncluded || false}
                                                onChange={handleSwitchChange}
                                            />
                                            <span className="slider"></span></label>
                                        <span style={{ padding: '0.5em' }}>Sí / No</span>
                                    </div>
                                </Col>
                            </Row>

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
                                        id="taxId"
                                        name="taxId"
                                        value={formData.taxId}
                                        onChange={handleInputChange}
                                        required
                                        className="form-control"
                                    >
                                        <option value="0">Selecciona el impuesto</option>
                                        {
                                            taxes.map((tax) => {
                                                return (<option key={tax?._id} label={tax?.name} value={tax?._id}></option>)
                                            })
                                        }
                                    </Input>
                                    {validationErrors.taxId && <span style={{ color: "red" }}>{validationErrors.taxId}</span>}
                                </Col>

                            </Row>
                        </CollapsibleSection>

                        {/* Galería de multimedia */}
                        <CollapsibleSection
                            id="multimedia"
                            title="Galería"
                            icon={ImageIcon}
                            isOpen={openSections.multimedia}
                            onToggle={toggleSection}
                        >
                            <Row className="mt-3">
                                <Col md={12}>

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

                                </Col>
                            </Row>
                        </CollapsibleSection>

                    </Fragment>

                }
            />
        </>
    )

}