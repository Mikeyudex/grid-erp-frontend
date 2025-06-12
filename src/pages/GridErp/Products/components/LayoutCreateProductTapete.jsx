"use client"
import { Fragment, useContext, useEffect, useState } from "react";
import { Alert, Col, Input, Row } from "reactstrap";
import Select from 'react-select';
import * as url from "../helper/url_helper";
import { FilePond, registerPlugin } from 'react-filepond';
import 'filepond/dist/filepond.min.css';
import FilePondPluginImageExifOrientation from 'filepond-plugin-image-exif-orientation';
import FilePondPluginImagePreview from 'filepond-plugin-image-preview';
import { useSnackbar } from 'react-simple-snackbar';
import 'filepond-plugin-image-preview/dist/filepond-plugin-image-preview.css';
import CancelIcon from '@mui/icons-material/Cancel';
import { ImportIcon } from "lucide-react";
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

// Register the plugins
registerPlugin(FilePondPluginImageExifOrientation, FilePondPluginImagePreview);

const acceptedFileTypes = ['image/jpeg', 'image/png', 'image/gif'];
const helper = new ProductHelper();
const companyId = '3423f065-bb88-4cc5-b53a-63290b960c1a';
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
        companyId: companyId,
        externalId: '',
        warehouseId: '',
        providerId: '',
        name: '',
        description: '',
        id_type_product: '',
        id_category: '',
        id_sub_category: '',
        quantity: 1,
        unitOfMeasureId: '',
        taxId: '',
        costPrice: '',
        salePrice: '',
        attributes: [],
        typeOfPieces: [],
        observations: "",
        barCode: "",
        taxIncluded: false
    });
    const [additionalConfigs, setAdditionalConfigs] = useState({
        hasBarcode: false
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
                warehouseId: '',
                providerId: '',
                name: '',
                description: '',
                id_type_product: '',
                id_category: '',
                id_sub_category: '',
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
            setAdditionalConfigs({ hasBarcode: false });
            setFileData([]);
            return navigate('/success-product');

        } catch (error) {
            console.log(error);
            handleCloseBackdrop();
            openSnackbarDanger('Ocurrió un error al crear el producto.');
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
        payloadModiffied.companyId = companyId;

        let additionalConfigsModiffied = { ...additionalConfigs, images: fileData.map(({ url }) => url) }
        return { ...payloadModiffied, additionalConfigs: additionalConfigsModiffied };
    }

    const handleSetLastSku = async () => {
        let { lastSku } = await helper.getLastSku(companyId);
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

    useEffect(() => {
        helper.getCategoriesFullByProduct(companyId)
            .then(async (respCategoriesFull) => {
                let unitOfMeasures = await helper.getAllUnitsMeasure();
                let taxes = await helper.getAllTaxes();
                let typesProduct = await helper.getTypesProduct();

                if (mode === "create") {
                    await handleSetLastSku();
                }
                let categories = respCategoriesFull?.data;
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
                to={`/products-list-v2`}
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

                                    <FilePond
                                        acceptedFileTypes={acceptedFileTypes}
                                        fileValidateTypeLabelExpectedTypesMap={{
                                            'image/jpeg': '.jpg',
                                            'image/png': '.png',
                                            'image/gif': '.gif',
                                        }}
                                        labelFileTypeNotAllowed={'Solo se permiten archivos de imagen.'}
                                        beforeAddFile={(file) => {
                                            const fileType = file.fileType;
                                            if (!acceptedFileTypes.includes(fileType)) {
                                                return false;
                                            }
                                            return true;
                                        }}
                                        server={
                                            {
                                                process: {
                                                    url: url.UPLOAD_IMAGES,
                                                    method: 'POST',
                                                    withCredentials: false,
                                                    onload: (response) => {
                                                        const { url, storageId } = JSON.parse(response);
                                                        return JSON.stringify({ url, storageId });
                                                    },
                                                    onerror: (response) => {
                                                        console.error('Error uploading file:', response);
                                                    },
                                                },
                                                revert: async (uniqueFileId, load, error) => {
                                                    try {
                                                        const { storageId } = JSON.parse(uniqueFileId);
                                                        let data = await helper.deleteImageProduct(storageId);
                                                        if (data?.status === 'success') {
                                                            let newFileData = fileData.filter((file) => file.storageId !== storageId)
                                                            setFileData(newFileData);
                                                            load();
                                                        } else {
                                                            error('Could not delete file');
                                                        }
                                                    } catch (e) {
                                                        error('Could not delete file');
                                                    }
                                                }
                                            }
                                        }
                                        onprocessfile={(error, file) => {
                                            if (error) {
                                                console.error('Error processing file:', error);
                                                return;
                                            }
                                            const { file: fileInfo } = file;
                                            const { name } = fileInfo;
                                            // Add the URL and storageId to fileData
                                            setFileData((prevData) => [
                                                ...prevData,
                                                {
                                                    url: JSON.parse(file.serverId).url,  // URL returned by onload
                                                    storageId: JSON.parse(file.serverId).storageId, // Extract storageId from serverId
                                                    name,
                                                },
                                            ]);
                                        }}
                                        allowMultiple={true}
                                        maxFiles={4}
                                        name="files"
                                        className="filepond filepond-input-multiple"
                                        labelIdle='Arrastra tus archivos aquí o <span className="filepond--label-action">Buscar</span>'
                                        labelFileLoadError="Error durante la carga"
                                        labelFileProcessingError="Error al cargar la imagen"
                                        labelTapToCancel="Tap para cancelar"
                                        labelTapToRetry="Tap para reintentar"
                                        labelTapToUndo="Tap para revertir"
                                        labelFileProcessing="Subiendo"
                                        labelFileProcessingComplete="Carga completa"
                                        labelFileProcessingAborted="Carga cancelada"
                                    />

                                </Col>
                            </Row>
                        </CollapsibleSection>

                    </Fragment>

                }
            />
        </>
    )

}