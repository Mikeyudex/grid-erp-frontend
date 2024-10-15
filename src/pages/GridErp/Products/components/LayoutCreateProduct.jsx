import { Fragment, useEffect, useState } from "react";
import { Col, Container, Input, Row } from "reactstrap";
import BreadCrumb from "./BreadCrumb";
import * as url from "../helper/url_helper";
import { FilePond, registerPlugin } from 'react-filepond';
import 'filepond/dist/filepond.min.css';
import FilePondPluginImageExifOrientation from 'filepond-plugin-image-exif-orientation';
import FilePondPluginImagePreview from 'filepond-plugin-image-preview';
import { useSnackbar } from 'react-simple-snackbar';
import 'filepond-plugin-image-preview/dist/filepond-plugin-image-preview.css';
import CancelIcon from '@mui/icons-material/Cancel';
import SyncOutlinedIcon from '@mui/icons-material/SyncOutlined';
import SaveIcon from '@mui/icons-material/Save';
import { useNavigate } from 'react-router-dom';

import InputSpin from '../components/InputSpin';
import './LayoutCreateProduct.css';
import LayoutTextInputs from "../partials/layouts/createProduct/LayoutTextInputs";
import GlobalInputText from "../partials/inputs/GlobalInputText";
import LayoutProductImages from "../partials/layouts/createProduct/LayoutProductImages";
import { optionsSnackbarDanger, optionsSnackbarSuccess, ProductHelper } from '../helper/product_helper';
import SpeedDialProduct from "./SpeedDial";
import { BackdropGlobal } from "./Backdrop";
import '../pages/form-product.css';
import { DrawerProductSync } from "./DrawerProductSync";

// Register the plugins
registerPlugin(FilePondPluginImageExifOrientation, FilePondPluginImagePreview);

const acceptedFileTypes = ['image/jpeg', 'image/png', 'image/gif'];
const helper = new ProductHelper();
const companyId = '3423f065-bb88-4cc5-b53a-63290b960c1a';


export default function LayoutCreateProduct(props) {

    const navigate = useNavigate();

    const [attributeConfigs, setAttributeConfigs] = useState([]);
    const [categories, setCategories] = useState([]);
    const [subcategories, setSubcategories] = useState([]);
    const [warehouses, setWarehouses] = useState([]);
    const [providers, setProviders] = useState([]);
    const [units, setUnits] = useState([]);
    const [taxes, setTaxes] = useState([]);
    const [typesProduct, setTypesProduct] = useState([]);
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
        quantity: 0,
        unitOfMeasureId: '',
        taxId: '',
        costPrice: '',
        salePrice: '',
        attributes: []
    });
    const [additionalConfigs, setAdditionalConfigs] = useState({
        hasBarcode: false
    });
    const [fileData, setFileData] = useState([]);
    const [errors, setErrors] = useState({});
    const [hasSuccessProductCreate, setHasSuccessProductCreate] = useState(false);
    const [openSnackbarDanger, closeSnackbarDanger] = useSnackbar(optionsSnackbarDanger);
    const [openSnackbarSuccess, closeSnackbarSuccess] = useSnackbar(optionsSnackbarSuccess);
    const [openBackdrop, setOpenBackdrop] = useState(false);
    const [openDrawerSync, setOpenDrawerSync] = useState(false);
    const [marketPlaceToSync, setMarketPlaceToSync] = useState(['woocommerce']);
    const [titleBackdrop, setTitleBackdrop] = useState("");
    const [savedProduct, setSavedProduct] = useState(false);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        // Si el nombre del campo coincide con un campo fijo (name, sku, price)
        if (Object.keys(formData).includes(name)) {
            setFormData((prevFormData) => ({
                ...prevFormData,
                [name]: value,
            }));
            if (name === 'id_category') {
                handleFilterSubcategories(value);
            }
        } else {
            // Si es un campo dinámico
            setFormData((prevFormData) => ({
                ...prevFormData,
                attributes: {
                    ...prevFormData.attributes,
                    [name]: value,
                },
            }));
        }
    };

    const handleInputChangeAdditionalConfigs = (e) => {
        const { name, value, type, checked } = e.target;

        setAdditionalConfigs((prevAdditionalConfigs) => ({
            ...prevAdditionalConfigs,
            [name]: type === 'checkbox' ? checked : value,
        }));
    }

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
                attributes: []
            }
        );
        setAdditionalConfigs({ hasBarcode: false });
        setFileData([]);
        return;
    }

    const handleFilterSubcategories = (categoryId) => {
        let categoryFiltered = categories.filter((category) => category?.uuid === categoryId)[0];
        setSubcategories(categoryFiltered?.subcategories ?? []);
    };

    const handleSetQuantity = (value) => {
        setFormData((prevFormData) => ({
            ...prevFormData,
            quantity: value,
        }));
    }

    const handleProductOperation = async (sync = false) => {
        try {
            // Validación del formulario
            if (!helper.validateForm(setErrors, formData)) {
                return;
            }
            setOpenBackdrop(true);

            if (!savedProduct) {
                setTitleBackdrop("Creando producto...");
                let payload = preparePayload();
                await helper.addProduct(payload);
                openSnackbarSuccess('Producto creado!');
                setSavedProduct(true);
            }

            // Sincronización opcional
            if (sync) {
                try {
                    setTitleBackdrop("Sincronizando producto en woocommerce...");
                    if (marketPlaceToSync.includes("woocommerce")) {
                        return await handleSyncProductWooCommerce(preparePayload());
                    }
                    if (marketPlaceToSync.includes("meli")) {
                        return await helper.syncProductMercadoLibre(preparePayload());
                    }
                    setTitleBackdrop("No hay un marketplace seleccionado");
                    setOpenBackdrop(false);
                    return;
                } catch (error) {
                    console.log('Error al sincronizar producto:', error);
                    setTitleBackdrop("Ocurrió un error al sincronizar el producto");
                    setOpenBackdrop(false);
                    return;
                }
            } else {
                // Navegar en caso de no sincronizar
                handleClearForm();
                setAttributeConfigs([]);
                setAdditionalConfigs({ hasBarcode: false });
                setFileData([]);
                return navigate('/success-product');
            }

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

    const handleSyncProduct = async () => {
        await handleProductOperation(true);
    };

    const handleSyncProductWooCommerce = async (payload) => {
        try {
            await helper.syncProductWooCommerce(payload, companyId);
            handleClearForm();
            setAttributeConfigs([]);
            setAdditionalConfigs({ hasBarcode: false });
            setFileData([]);
            openSnackbarSuccess('Solicitud enviada, se recibirá una notificación cuando se complete el proceso.');
            return navigate('/success-product');
        } catch (error) {
            console.log(error);
            openSnackbarDanger('Ocurrió un error al sincronizar el producto en woocommerce.');
        } finally {
            setOpenBackdrop(false);
            setTitleBackdrop("");
            setOpenDrawerSync(false);
        }
    };

    const preparePayload = () => {
        let payload = formData;
        let payloadModiffied = { ...payload, sku: lastSku };
        payloadModiffied.quantity = Number(formData.quantity);
        payloadModiffied.costPrice = Number(formData.costPrice);
        payloadModiffied.salePrice = Number(formData.salePrice);
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

    const actions = [
        { icon: <SaveIcon />, name: 'Guardar', onClick: handleSubmit },
        { icon: <SyncOutlinedIcon />, name: 'Guardar y sincronizar', onClick: () => setOpenDrawerSync(true) },
        { icon: <CancelIcon />, name: 'Cancelar' },
    ];

    useEffect(() => {
        // Obtener la configuración de los atributos desde el backend
        helper.getAttrProduct(companyId)
            .then(async (response) => {
                let respCategoriesFull = await helper.getCategoriesFullByProduct(companyId);
                let respWarehouses = await helper.getWarehouseByCompany(companyId);
                let respProviders = await helper.getProviderByCompany(companyId);
                let unitOfMeasures = await helper.getAllUnitsMeasure();
                let taxes = await helper.getAllTaxes();
                let typesProduct = await helper.getTypesProduct();

                await handleSetLastSku();
                let categories = respCategoriesFull.data;
                let warehouses = respWarehouses.data;
                let providers = respProviders.data;

                setCategories(categories ?? []);
                setWarehouses(warehouses ?? []);
                setProviders(providers ?? []);
                setUnits(unitOfMeasures ?? []);
                setTaxes(taxes ?? []);
                setTypesProduct(typesProduct?.data ?? []);
                setAttributeConfigs(response.data);

                // Inicializar atributos en formData con valores vacíos
                const initialAttributes = response.data.reduce((acc, attr) => {
                    acc[attr.name] = '';
                    return acc;
                }, {});

                setFormData(prevFormData => ({
                    ...prevFormData,
                    attributes: initialAttributes,
                }));
            })
            .catch(error => {
                console.error('Error fetching attribute configs:', error);
            });
    }, []);

    return (
        <Fragment>
            <SpeedDialProduct actions={actions}> </SpeedDialProduct>
            <BackdropGlobal
                openBackdrop={openBackdrop}
                handleClose={handleCloseBackdrop}
                title={titleBackdrop}
            />

            <div className="page-content">
                <DrawerProductSync
                    openDrawerSync={openDrawerSync}
                    setOpenDrawerSync={setOpenDrawerSync}
                    setMarketPlaceToSync={setMarketPlaceToSync}
                    handleSyncProduct={handleSyncProduct}
                />

                <Container fluid>
                    <BreadCrumb title="Crear Producto" pageTitle="Productos" />

                    <Row md={12}>

                        <Col md={6} style={{}}>
                            <Row>
                                <Col md={12} style={{}}>
                                    <LayoutTextInputs
                                        title={"Descripción"}
                                        item1={
                                            <>
                                                <div className="input-wrapper">
                                                    <label className='form-label' htmlFor="quantity">*Nombre:</label>
                                                    <GlobalInputText
                                                        name={'name'}
                                                        onChange={handleInputChange}
                                                        placeholder={'Nombre del producto'}
                                                        value={formData.name}
                                                        type={"text"}
                                                        className={"input-box"}
                                                        id={'name'}
                                                        required={true}
                                                    />
                                                </div>
                                                {errors.name && (<span className="form-product-input-error">{errors.name}</span>)}
                                            </>
                                        }
                                        item2={
                                            <>
                                                <div className="input-wrapper">
                                                    <label className='form-label' htmlFor="quantity">*Descripción:</label>
                                                    <GlobalInputText
                                                        name={'description'}
                                                        onChange={handleInputChange}
                                                        placeholder={'Descripción del producto'}
                                                        value={formData.description}
                                                        type={"text"}
                                                        className={"input-box"}
                                                        id={'description'}
                                                        required={true}
                                                    />
                                                </div>
                                                {errors.description && (<span className="form-product-input-error">{errors.description}</span>)}
                                            </>
                                        }
                                        item3={
                                            <div className="col-span-4 sm:col-span-4 pr-2 mr-2">
                                                <label className='form-label' htmlFor="id_type_product">*Tipo de producto:</label>
                                                <div>
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
                                                        className="form-control"
                                                    >
                                                        <option value="0">Selecciona una opción</option>
                                                        {
                                                            typesProduct.map((typeProduct) => {
                                                                return (<option key={typeProduct?._id} label={typeProduct?.name} value={typeProduct?._id}></option>)
                                                            })
                                                        }
                                                    </Input>
                                                </div>
                                                {errors.id_type_product && (<span className="form-product-input-error">{errors.id_type_product}</span>)}
                                            </div>
                                        }
                                    />
                                </Col>

                            </Row>

                            <Col md={12} style={{}}>

                                <LayoutTextInputs
                                    title={"Categorías"}
                                    item1={
                                        <div className="col-span-4 sm:col-span-4 pr-2 mr-2">
                                            <label className='form-label' htmlFor="id_category">*Categoría:</label>
                                            <div>
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
                                                    id="id_category"
                                                    name="id_category"
                                                    value={formData.id_category}
                                                    onChange={handleInputChange}
                                                    required
                                                    className="form-control"
                                                >
                                                    <option value="0">Selecciona una opción</option>
                                                    {
                                                        categories.map((category) => {
                                                            return (<option key={category?._id} label={category?.name} value={category?.uuid}></option>)
                                                        })
                                                    }
                                                </Input>
                                            </div>
                                            {errors.id_category && (<span className="form-product-input-error">{errors.id_category}</span>)}
                                        </div>
                                    }
                                    item2={
                                        <div className="col-span-8 sm:col-span-4">
                                            <label className='form-label' htmlFor="id_sub_category">*Subcategoría:</label>
                                            <div>
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
                                                    id="id_sub_category"
                                                    name="id_sub_category"
                                                    value={formData.id_sub_category}
                                                    onChange={handleInputChange}
                                                    required
                                                    className="form-control"
                                                >
                                                    <option value="0">Selecciona una opción</option>
                                                    {
                                                        subcategories.map((subcategory) => {
                                                            return (<option key={subcategory?._id} label={subcategory?.name} value={subcategory?.uuid}></option>)
                                                        })
                                                    }
                                                </Input>
                                            </div>
                                            {errors.id_sub_category && (<span className="form-product-input-error">{errors.id_sub_category}</span>)}
                                        </div>
                                    }
                                />
                            </Col>

                            <Col md={12} style={{}}>

                                <LayoutTextInputs
                                    title={"Inventario"}
                                    item1={
                                        <div className="input-wrapper">
                                            <label className='form-label' htmlFor="externalId">*Código externo:</label>
                                            <GlobalInputText
                                                name={'externalId'}
                                                onChange={handleInputChange}
                                                placeholder={'Ej. 9987621'}
                                                value={formData.externalId}
                                                type={"text"}
                                                className={"input-box"}
                                                id={'externalId'}
                                                disabled={false}
                                            />
                                        </div>

                                    }
                                    md1={6}
                                    md2={6}
                                    group={true}
                                    item2={
                                        <div className="input-wrapper">
                                            <label className='form-label' htmlFor="quantity">*SKU:</label>
                                            <GlobalInputText
                                                name={'sku'}
                                                onChange={handleInputChange}
                                                placeholder={'sku'}
                                                value={lastSku}
                                                type={"text"}
                                                className={"input-box"}
                                                id={'sku'}
                                                disabled={true}
                                            />
                                        </div>
                                    }
                                    md3={6}
                                    item3={
                                        <div className="col-span-4 sm:col-span-4 pr-2 mr-2">
                                            <label className='form-label' htmlFor="quantity">*Cantidad:</label>
                                            <div>
                                                <InputSpin
                                                    setState={handleSetQuantity}
                                                    value={formData.quantity}
                                                    min={"0"}
                                                    max={"5000"}
                                                    inputClassname={'bg-red'}
                                                    containerClass={"input-step full-width"}
                                                />
                                            </div>
                                            {errors.quantity && (<span className="form-product-input-error">{errors.quantity}</span>)}
                                        </div>
                                    }
                                    md3_5={6}
                                    item3_5={
                                        <div className="col-span-4 sm:col-span-4 pr-2 mr-2">
                                            <label className='form-label' htmlFor="unitOfMeasureId">*Unidad de medida:</label>
                                            <div>
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
                                                    className="form-control"
                                                >
                                                    <option value="0">Selecciona una opción</option>
                                                    {
                                                        units.map((unit) => {
                                                            return (<option key={unit._id} label={`${unit.name} (${unit.abbreviation})`} value={unit._id}></option>)
                                                        })
                                                    }
                                                </Input>
                                            </div>
                                            {errors.unitOfMeasureId && (<span className="form-product-input-error">{errors.unitOfMeasureId}</span>)}
                                        </div>
                                    }
                                    md4={12}
                                    item4={
                                        <div className="col-span-4 sm:col-span-4 pr-2 mr-2">
                                            <label className='form-label' htmlFor="id_category">*Bodega:</label>
                                            <div>
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
                                                    id="warehouseId"
                                                    name="warehouseId"
                                                    value={formData.warehouseId}
                                                    onChange={handleInputChange}
                                                    required
                                                    className="form-control"
                                                >
                                                    <option value="0">Selecciona una opción</option>
                                                    {
                                                        warehouses.map((warehouse) => {
                                                            return (<option key={warehouse?._id} label={warehouse?.name} value={warehouse?.uuid}></option>)
                                                        })
                                                    }
                                                </Input>
                                            </div>
                                            {errors.warehouseId && (<span className="form-product-input-error">{errors.warehouseId}</span>)}
                                        </div>
                                    }
                                    md5={12}
                                    item5={
                                        <div className="col-span-4 sm:col-span-4 pr-2 mr-2">
                                            <label className='form-label' htmlFor="providerId">*Proveedor:</label>
                                            <div>
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
                                                    id="providerId"
                                                    name="providerId"
                                                    value={formData.providerId}
                                                    onChange={handleInputChange}
                                                    required
                                                    className="form-control"
                                                >
                                                    <option value="0">Selecciona una opción</option>
                                                    {
                                                        providers.map((provider) => {
                                                            return (<option key={provider?._id} label={provider?.name} value={provider?.uuid}></option>)
                                                        })
                                                    }
                                                </Input>
                                            </div>
                                            {errors.providerId && (<span className="form-product-input-error">{errors.providerId}</span>)}
                                        </div>
                                    }
                                />


                            </Col>

                            <Col md={12} style={{}}>

                                <LayoutTextInputs
                                    title={"Atributos"}
                                    md1={12}
                                    item1={
                                        (attributeConfigs ?? []).map((attr, index) => (
                                            <Col key={attr.name} md={12} className='p-2 mt-3'>

                                                {attr.type !== 'switch' && <label className="pt-2" htmlFor={attr.name}>{attr.label}:</label>}
                                                {attr.type === 'select' ? (

                                                    <div className="col-span-8 sm:col-span-4">
                                                        <div>
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
                                                                id={attr.name}
                                                                name={attr.name}
                                                                value={formData.attributes[attr.name]}
                                                                onChange={handleInputChange}
                                                                required
                                                                className="form-control"
                                                                key={attr.name}
                                                            >
                                                                <option value="0">Selecciona una opción</option>
                                                                {attr.options.map((opt, idx) => {
                                                                    return (<option key={opt} label={opt} value={opt}></option>)
                                                                })}
                                                            </Input>
                                                        </div>
                                                    </div>
                                                ) :
                                                    attr.type === 'switch' ? (
                                                        <div className="checkbox-wrapper-59">
                                                            <label className="switch" key={`${index}-label`}>
                                                                <input
                                                                    type="checkbox"
                                                                    name={attr.name}
                                                                    id={attr.name}
                                                                    key={index}
                                                                    value={formData.attributes[attr.name]}
                                                                />
                                                                <span className="slider"></span></label>
                                                            <span className="p-3" >{attr.label}</span>
                                                        </div>
                                                    )
                                                        :
                                                        (
                                                            <div className="input-wrapper">
                                                                <GlobalInputText
                                                                    key={index}
                                                                    name={attr.name}
                                                                    onChange={handleInputChange}
                                                                    placeholder={attr.label}
                                                                    value={formData.attributes[attr.name]}
                                                                    type={attr.type}
                                                                    className={"input-box"}
                                                                    id={attr.name}
                                                                />
                                                            </div>
                                                        )}
                                            </Col>
                                        ))
                                    }

                                />
                            </Col>

                            <Row>
                            </Row>
                        </Col>


                        <Col md={6} style={{}}>
                            <Row>
                                <Col md={12} style={{}}>

                                    {/* Sección imagenes del producto */}
                                    <LayoutProductImages
                                        item1={
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
                                        }

                                    />
                                </Col >

                            </Row >

                            <Row>
                                <Col md={12} style={{}}>
                                    <LayoutTextInputs
                                        title={"Precios"}
                                        item1={
                                            <>
                                                <div className="input-wrapper">
                                                    <label className='form-label' htmlFor="quantity">*Precio de costo:</label>
                                                    <GlobalInputText
                                                        name={'costPrice'}
                                                        onChange={handleInputChange}
                                                        placeholder={'$600.000'}
                                                        value={formData.costPrice}
                                                        type={"number"}
                                                        className={"input-box"}
                                                        id={'costPrice'}
                                                        required={true}
                                                    />
                                                </div>
                                                {errors.costPrice && (<span className="form-product-input-error">{errors.costPrice}</span>)}
                                            </>

                                        }
                                        item2={
                                            <>
                                                <div className="input-wrapper">
                                                    <label className='form-label' htmlFor="quantity">*Precio de venta:</label>
                                                    <GlobalInputText
                                                        name={'salePrice'}
                                                        onChange={handleInputChange}
                                                        placeholder={'$630.000'}
                                                        value={formData.salePrice}
                                                        type={"number"}
                                                        className={"input-box"}
                                                        id={'salePrice'}
                                                        required={true}
                                                    />
                                                </div>
                                                {errors.salePrice && (<span className="form-product-input-error">{errors.salePrice}</span>)}
                                            </>
                                        }
                                    />
                                </Col>

                            </Row>

                            <Row>
                                <Col md={12} style={{}}>
                                    <LayoutTextInputs
                                        title={"Impuestos"}
                                        item1={
                                            <div className="col-span-4 sm:col-span-4 pr-2 mr-2">
                                                <label className='form-label' htmlFor="id_category">*Impuesto cargo:</label>
                                                <div>
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
                                                        <option value="0">Selecciona una opción</option>
                                                        {
                                                            taxes.map((tax) => {
                                                                return (<option key={tax?._id} label={tax?.name} value={tax?._id}></option>)
                                                            })
                                                        }
                                                    </Input>
                                                </div>
                                                {errors.taxId && (<span className="form-product-input-error">{errors.taxId}</span>)}
                                            </div>
                                        }
                                    />
                                </Col>

                            </Row>

                            <Row>
                                <Col md={12} style={{}}>
                                    <LayoutTextInputs
                                        title={"Configuraciones adicionales"}
                                        item1={
                                            <div className="checkbox-wrapper-59 pt-1" style={{ display: 'flex', justifyContent: 'flex-start' }}>
                                                <label className="switch">
                                                    <input
                                                        type="checkbox"
                                                        name={"hasBarcode"}
                                                        id={"hasBarcode"}
                                                        value={additionalConfigs.hasBarcode}
                                                        onChange={handleInputChangeAdditionalConfigs}
                                                    />
                                                    <span className="slider"></span></label>
                                                <span style={{ padding: '0.5em' }}>Producto con código de barras</span>
                                            </div>
                                        }
                                    />
                                </Col>

                            </Row>

                        </Col >

                    </Row >

                </Container >

            </div >

        </Fragment >
    )

}