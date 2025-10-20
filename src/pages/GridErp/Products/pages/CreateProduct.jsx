import React, { useState, useEffect, Fragment } from 'react';
import { Col, Container, Row, Input, Label } from 'reactstrap';
import BreadCrumb from '../../../../Components/Common/BreadCrumb';
import { StepperFormProduct } from './stepper-form-product';
import { DynamicAttributesForm } from './dynamic-attributes-form';
import { BtnLoader } from '../components/BtnLoader';
import { optionsSnackbarDanger, optionsSnackbarSuccess, ProductHelper } from '../helper/product_helper';
import { LayoutForm } from '../components/LayoutForm';
import { AdditionalConfigs } from './AdditionalConfigs';
import { FeedbackDialog } from '../components/FeedbackDialog';
import './form-product.css';
import { SuccessProductCreateView } from '../components/SuccessProductCreateView';
import { useSnackbar } from 'react-simple-snackbar';
import InputSpin from '../components/InputSpin';


const helper = new ProductHelper();
const companyId = '66becedd790bddbc9b1e2cbc';

const ProductForm = ({ onSuccess }) => {
  const [attributeConfigs, setAttributeConfigs] = useState([]);
  const [categories, setCategories] = useState([]);
  const [subcategories, setSubcategories] = useState([]);
  const [warehouses, setWarehouses] = useState([]);
  const [providers, setProviders] = useState([]);
  const [units, setUnits] = useState([]);
  const [taxes, setTaxes] = useState([]);
  const [lastSku, setLastSku] = useState("0");
  const [steps, setSteps] = useState([]);
  const [stepProgress, setStepProgress] = useState('0%');
  const [openBtnLoaderSubmit, setOpenBtnLoaderSubmit] = useState(false);
  const [current, setCurrent] = useState(1);
  const [formData, setFormData] = useState({
    externalId: '',
    warehouseId: '',
    providerId: '',
    name: '',
    description: '',
    id_category: '',
    id_sub_category: '',
    quantity: 0,
    unitOfMeasureId: '',
    taxId: '',
    costPrice: 0,
    salePrice: 0,
    attributes: []
  });
  const [additionalConfigs, setAdditionalConfigs] = useState({
    hasBarcode: false
  });
  const [fileData, setFileData] = useState([]);
  const [errors, setErrors] = useState({});
  const [showFeedbackDialog, setShowFeedbackDialog] = useState(false);
  const [showButtons, setShowButtons] = useState(true);
  const [hasSuccessProductCreate, setHasSuccessProductCreate] = useState(false);
  const [openSnackbarDanger, closeSnackbarDanger] = useSnackbar(optionsSnackbarDanger);
  const [openSnackbarSuccess, closeSnackbarSuccess] = useSnackbar(optionsSnackbarSuccess);


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

  const handleCurrentView = () => {
    setCurrent(current + 1)
  };

  const handleSetQuantity = (value) => {
    setFormData((prevFormData) => ({
      ...prevFormData,
      quantity: value,
    }));
  }

  const restartProgressStep = () => {
    setCurrent(1);
    setStepProgress('0%');
  }

  const handleClickBtn = () => {
    switch (current) {
      case 1:
        if (!helper.validateForm(setErrors, formData)) {
          return;
        }
        setCurrent(2);
        setStepProgress('50%');
        break;
      case 2:
        setCurrent(3);
        setStepProgress('100%');
        break;
      case 3:
        handleSubmit();
        break;
      default:
        () => { };
        break;
    }
  }

  const handleClickBtnReturn = () => {
    switch (current) {
      case 2:
        setCurrent(1);
        setStepProgress('0%');
        break;
      case 3:
        setCurrent(2);
        setStepProgress('50%');
        break;
      default:
        break;
    }
  }

  const handleSubmit = async () => {
    try {
      setOpenBtnLoaderSubmit(true);
      let payload = formData;
      let payloadModiffied = { ...payload, sku: lastSku };
      payloadModiffied.quantity = Number(formData.quantity);
      payloadModiffied.costPrice = Number(formData.costPrice);
      payloadModiffied.salePrice = Number(formData.salePrice);

      let additionalConfigsModiffied = { ...additionalConfigs, images: fileData.map(({ url }) => url) }
      /* console.log({ ...payloadModiffied, additionalConfigs: additionalConfigsModiffied });
      return; */
      await helper.addProduct({ ...payloadModiffied, additionalConfigs: additionalConfigsModiffied });
      handleToggleShowButtons();
      setShowFeedbackDialog(true);
      setHasSuccessProductCreate(true);
      openSnackbarSuccess('Producto creado!')
      return;
    } catch (error) {
      console.log(error);
      openSnackbarDanger('Ocurrió un error al crear el producto');
      handleToggleShowButtons();
      setShowFeedbackDialog(true);
      setHasSuccessProductCreate(false);
    }
  };

  const handleCreateNewProduct = async () => {
    handleClearForm();
    restartProgressStep();
    setOpenBtnLoaderSubmit(false);
    handleToggleShowButtons();
    await handleSetLastSku();
  }

  const handleToggleShowButtons = async () => {
    setShowButtons(!showButtons);
  }

  const handleSetLastSku = async () => {
    let { lastSku } = await helper.getLastSku(companyId);
    setLastSku(lastSku);
  }

  useEffect(() => {
    // Obtener la configuración de los atributos desde el backend
    helper.getAttrProduct(companyId)
      .then(async (response) => {
        let respCategoriesFull = await helper.getCategoriesFullByProduct(companyId);
        let respWarehouses = await helper.getWarehouseByCompany(companyId);
        let respProviders = await helper.getProviderByCompany(companyId);
        let unitOfMeasures = await helper.getAllUnitsMeasure();
        let taxes = await helper.getAllTaxes();

        await handleSetLastSku();
        let categories = respCategoriesFull.data;
        let warehouses = respWarehouses.data;
        let providers = respProviders.data;

        //ordenar alphabeticamente las categorías
        categories.sort((a, b) => a.name.localeCompare(b.name));
        console.log(categories);
        
        setCategories(categories ?? []);
        setWarehouses(warehouses ?? []);
        setProviders(providers ?? []);
        setUnits(unitOfMeasures ?? []);
        setTaxes(taxes ?? []);
        setAttributeConfigs(response.data);
        setSteps([{ index: 1, title: "Datos básicos" }, { index: 2, title: "Datos adicionales" }, { index: 3, title: "Fin" }]);

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
    <React.Fragment>
      <div className="page-content">
        <Container fluid>
          <BreadCrumb title="Crear Producto" pageTitle="Productos" />
          <Row>

            <Col xs={12}>
              <StepperFormProduct steps={steps} progress={stepProgress}></StepperFormProduct>
              <LayoutForm main={<form className='needs-validation' onSubmit={handleSubmit}>

                <Row>{/* Contenedor de los Inputs */}

                  <Col md={12}>
                    {
                      current === 1 && (
                        <>
                          <Row style={{ paddingTop: '0.4em' }}>

                            <Col md={6} style={{ paddingTop: '0.8em' }}>
                              <div className="col-span-4 sm:col-span-4 pr-2 mr-2">
                                <label className='form-label' htmlFor="name">*Nombre del producto:</label>
                                <div>
                                  <Input
                                    style={{ border: 'none', borderBottom: '1px solid #132649', background: '#f7f7f9c7' }}
                                    bsSize="md"
                                    type="text"
                                    id="name"
                                    name="name"
                                    value={formData.name}
                                    onChange={handleInputChange}
                                    required
                                    className="form-control"
                                  />
                                </div>
                                {errors.name && (<span className="form-product-input-error">{errors.name}</span>)}
                              </div>
                            </Col>

                            <Col md={3} style={{ paddingTop: '0.8em' }}>

                              <label className='form-label' htmlFor="sku">*SKU:</label>
                              <Input
                                style={{ border: 'none', borderBottom: '1px solid #132649', background: '#f7f7f9c7' }}
                                bsSize="md"
                                type="text"
                                id="sku"
                                name="sku"
                                value={lastSku}
                                onChange={handleInputChange}
                                required
                                readOnly={true}
                                disabled={true}
                                className="form-control"
                              />
                            </Col>

                            <Col md={3} style={{ paddingTop: '0.8em' }}>
                              <div className="col-span-4 sm:col-span-4 pr-2 mr-2">
                                <label className='form-label' htmlFor="externalId">Código externo:</label>
                                <div>
                                  <Input
                                    style={{ border: 'none', borderBottom: '1px solid #132649', background: '#f7f7f9c7' }}
                                    bsSize="md"
                                    type="text"
                                    id="externalId"
                                    name="externalId"
                                    value={formData.externalId}
                                    onChange={handleInputChange}
                                    required
                                    className="form-control"
                                  />
                                </div>
                              </div>
                            </Col>

                          </Row>

                          <Row style={{ paddingTop: '0.4em' }}>

                            <Col md={4} style={{ paddingTop: '0.8em' }}>
                              <div className="col-span-4 sm:col-span-4 pr-2 mr-2">
                                <label className='form-label' htmlFor="providerId">*Proveedor:</label>
                                <div>
                                  <Input
                                    style={{ border: 'none', borderBottom: '1px solid #132649', background: '#f7f7f9c7' }}
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
                            </Col>

                            <Col md={4} style={{ paddingTop: '0.8em' }}>
                              <div className="col-span-8 sm:col-span-4">
                                <label className='form-label' htmlFor="warehouseId">*Bodega:</label>
                                <div>
                                  <Input
                                    style={{ border: 'none', borderBottom: '1px solid #132649', background: '#f7f7f9c7' }}
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
                            </Col>

                            <Col md={4} style={{ paddingTop: '0.8em' }}>
                              <div className="col-span-4 sm:col-span-4 pr-2 mr-2">
                                <label className='form-label' htmlFor="id_category">*Categoría:</label>
                                <div>

                                  <Input
                                    style={{ border: 'none', borderBottom: '1px solid #132649', background: '#f7f7f9c7' }}
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
                            </Col>

                          </Row>

                          <Row style={{ paddingTop: '0.8em' }}>

                            <Col lg={3} md={3} style={{ paddingTop: '0.8em' }}>
                              <div className="col-span-8 sm:col-span-4">
                                <label className='form-label' htmlFor="id_sub_category">*Subcategoría:</label>
                                <div>
                                  <Input
                                    style={{ border: 'none', borderBottom: '1px solid #132649', background: '#f7f7f9c7' }}
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
                            </Col>

                            <Col lg={3} md={3} style={{ paddingTop: '0.8em' }}>
                              <div className="col-span-8 sm:col-span-4">
                                <label className='form-label' htmlFor="id_sub_category">*Impuesto:</label>
                                <div>
                                  <Input
                                    style={{ border: 'none', borderBottom: '1px solid #132649', background: '#f7f7f9c7' }}
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
                            </Col>

                            {/* <Col lg={3} md={3}>
                              <div className="mb-3">
                                <label className='form-label' htmlFor="description">*Impuesto:</label>
                                <Select
                                  styles={{
                                    control: (baseStyles, state) => ({
                                      ...baseStyles,
                                      background: '#f7f7f9c7',
                                      borderBottom: '1px solid #132649',
                                    }),
                                    valueContainer
                                  }}
                                  theme={(theme) => ({
                                    ...theme,
                                    borderRadius: 0,
                                    colors: {
                                      ...theme.colors,
                                      primary25: '#4880d2',
                                      primary: 'primary50',
                                    },
                                  })}
                                  value={formData.taxId}
                                  onChange={(e) => { console.log(e) }}
                                  options={taxes}
                                />
                              </div>
                            </Col> */}

                            <Col md={6} style={{ paddingTop: '0.8em' }}>
                              <div className="col-span-8 sm:col-span-4">
                                <label className='form-label' htmlFor="description">Descripción:</label>
                                <div>
                                  <Input
                                    style={{ border: 'none', borderBottom: '1px solid #132649', background: '#f7f7f9c7' }}
                                    bsSize="md"
                                    type="text"
                                    id="description"
                                    name="description"
                                    value={formData.description}
                                    onChange={handleInputChange}
                                    required
                                    className="form-control"
                                  />
                                </div>
                                {errors.description && (<span className="form-product-input-error">{errors.description}</span>)}
                              </div>
                            </Col>

                          </Row>

                          <Row style={{ paddingTop: '0.8em' }}>
                            <Col md={3} style={{ paddingTop: '0.8em' }}>
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
                            </Col>

                            <Col>
                              <div class="input-wrapper">
                                <label className='form-label' htmlFor="quantity">*Descripción:</label>
                                <input name='description' class="input-box" type="text" value={formData.description} onChange={handleInputChange} placeholder="Descripción" />
                                <span class="underline"></span>
                              </div>

                            </Col>

                            <Col md={3} style={{ paddingTop: '0.8em' }}>
                              <div className="col-span-4 sm:col-span-4 pr-2 mr-2">
                                <label className='form-label' htmlFor="quantity">*Unidad de medida:</label>
                                <div>
                                  <Input
                                    style={{ border: 'none', borderBottom: '1px solid #132649', background: '#f7f7f9c7' }}
                                    bsSize="md"
                                    type="select"
                                    id="unitOfMeasureId"
                                    name="unitOfMeasureId"
                                    value={formData.unitOfMeasureId}
                                    onChange={handleInputChange}
                                    required
                                    className="form-control"
                                  >
                                    <option value="0">Selecciona una unidad</option>
                                    {
                                      units.map((unit) => {
                                        return (<option key={unit._id} label={`${unit.name} (${unit.abbreviation})`} value={unit._id}></option>)
                                      })
                                    }
                                  </Input>

                                </div>
                                {errors.unitOfMeasureId && (<span className="form-product-input-error">{errors.unitOfMeasureId}</span>)}
                              </div>
                            </Col>

                            <Col md={3} style={{ paddingTop: '0.8em' }}>
                              <label className='form-label' htmlFor="costPrice">*Precio de costo:</label>
                              <div>
                                <Input
                                  style={{ border: 'none', borderBottom: '1px solid #132649', background: '#f7f7f9c7' }}
                                  bsSize="md"
                                  type="number"
                                  id="costPrice"
                                  name="costPrice"
                                  value={formData.costPrice}
                                  onChange={handleInputChange}
                                  required
                                  className="form-control"
                                />
                              </div>
                              {errors.costPrice && (<span className="form-product-input-error">{errors.costPrice}</span>)}
                            </Col>

                            <Col md={3} style={{ paddingTop: '0.8em' }}>
                              <label className='form-label' htmlFor="salePrice">*Precio de venta:</label>
                              <div>
                                <Input
                                  style={{ border: 'none', borderBottom: '1px solid #132649', background: '#f7f7f9c7' }}
                                  bsSize="md"
                                  type="number"
                                  id="salePrice"
                                  name="salePrice"
                                  value={formData.salePrice}
                                  onChange={handleInputChange}
                                  required
                                  className="form-control"
                                />
                              </div>
                              {errors.salePrice && (<span className="form-product-input-error">{errors.salePrice}</span>)}
                            </Col>

                          </Row>

                        </>
                      )
                    }

                    {
                      current === 2 ?
                        <DynamicAttributesForm
                          attributeConfigs={attributeConfigs}
                          handleInputChange={handleInputChange}
                          formData={formData}
                        ></DynamicAttributesForm>
                        :
                        <></>
                    }

                    {
                      current === 3 && (
                        <>
                          {
                            showFeedbackDialog ? (
                              <FeedbackDialog
                                icon={hasSuccessProductCreate ? <i className="ri-checkbox-circle-fill"></i> : <i className=" ri-close-circle-fill"></i>}
                                body={
                                  hasSuccessProductCreate ?
                                    <SuccessProductCreateView handleCreateNewProduct={handleCreateNewProduct} />
                                    :
                                    <FailedProductCreateView />
                                }
                                hassuccess={hasSuccessProductCreate}
                              ></FeedbackDialog>
                            )
                              :
                              <AdditionalConfigs
                                handleInputChangeAdditionalConfigs={handleInputChangeAdditionalConfigs}
                                additionalConfigs={additionalConfigs}
                                setFileData={setFileData}
                                fileData={fileData}
                              ></AdditionalConfigs>
                          }
                        </>
                      )
                    }
                  </Col>

                </Row>

              </form>} />

              {
                showButtons && (
                  <Row style={{ marginTop: '0.5em', marginBottom: '0.5em' }}>
                    <Col
                      md={12}
                      style={{ marginTop: '1em', display: 'flex', flexDirection: 'row', justifyContent: 'space-between' }}>

                      {
                        current !== 1 && (
                          <BtnLoader
                            isLoader={false}
                            title={'Atrás'}
                            type={'button'}
                            onClick={handleClickBtnReturn}
                            color={'secondary'}
                          />
                        )
                      }

                      <BtnLoader
                        isLoader={openBtnLoaderSubmit}
                        title={current === 1 || current === 2 ? 'Siguiente' : 'Guardar'}
                        type={'button'}
                        onClick={handleClickBtn}
                        color={'primary'}
                      />

                    </Col>
                  </Row>
                )
              }

            </Col>

          </Row>
        </Container>
      </div>
    </React.Fragment>

  );
};

export default ProductForm;
