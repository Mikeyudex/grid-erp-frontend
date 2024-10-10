import * as React from 'react';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import CloseIcon from '@mui/icons-material/Close';
import Slide from '@mui/material/Slide';
import { Col, Input, Row, Table } from 'reactstrap';
import { Link } from 'react-router-dom';
import { useSnackbar } from 'react-simple-snackbar';
import { Autocomplete, Backdrop, CircularProgress, TextField } from '@mui/material';

import InputSpin from '../../Products/components/InputSpin';
import { numberFormatPrice, optionsSnackbarDanger, optionsSnackbarSuccess, StockHelper, validateInputs, validateInputsCreateTransfer } from '../helper/stock_helper';
import { companyId } from '../helper/url_helper';
import GlobalInputText from '../../Products/partials/inputs/GlobalInputText';
import { APIClient } from '../../../../helpers/api_helper';
import * as url from '../helper/url_helper';
import ResponseModal from '../partials/ResponseModal';


const apiClient = new APIClient();
const stockHelper = new StockHelper();

// Simulamos la respuesta del backend
const response = {
  "message": "Transferencia finalizada",
  "results": [
    {
      "productId": "615b35d5f547af3216c51234",
      "status": "success",
      "message": "Transferencia exitosa"
    },
    {
      "productId": "615b35d5f547af3216c54321",
      "status": "error",
      "message": "Error al transferir producto 615b35d5f547af3216c54321: Stock insuficiente"
    }
  ]
};

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

export function CreateTransferStock({
  openDrawer,
  toggleDrawer,
  dataSelectWarehouses
}) {
  const [transferStock, setTransferStock] = React.useState(
    [{
      productsSelected: [],
      type: 'transfer',
      createdBy: '66d4ed2f825f2d54204555c1',
      companyId: companyId
    }]);
  const [disableInput, setDisableInput] = React.useState(true);
  const [warehouseOriginId, setWarehouseOriginId] = React.useState('');
  const [warehouseDestinationId, setWarehouseDestinationId] = React.useState('');
  const [reason, setReason] = React.useState('');
  const [productList, setProductList] = React.useState([]);
  const [productSelected, setProductSelected] = React.useState([]);
  const [totalQuantity, setTotalQuantity] = React.useState(0);
  const [errors, setErrors] = React.useState({});
  const [openSnackbarSuccess, closeSnackbarSuccess] = useSnackbar(optionsSnackbarSuccess);
  const [openSnackbarDanger, closeSnackbarDanger] = useSnackbar(optionsSnackbarDanger);
  const [responseData, setResponseData] = React.useState(response);
  const [openResponseModal, setOpenResponseModal] = React.useState(false);

  const [page, setPage] = React.useState(1);
  const [limit, setLimit] = React.useState(100);
  const [openBackdrop, setOpenBackdrop] = React.useState(false);

  const handleClose = () => {
    toggleDrawer();
    setWarehouseOriginId('');
    setWarehouseDestinationId('');
    setProductSelected([]);
    setErrors({});
    setProductList([]);
    setTotalQuantity(0);
    setReason('');
    setTransferStock([]);
  };

  const toggleBackdrop = () => {
    setOpenBackdrop(!openBackdrop);
  };

  const calcTotalQuantity = () => {
    let newProductsSelected = [...productSelected];

    let _totalQuantity = newProductsSelected.reduce((acc, currentValue) => {
      let quantity = currentValue?.quantityByProduct;
      return acc + quantity;
    }, 0);
    setTotalQuantity(_totalQuantity);
  }


  const handleWarehouseOriginChange = (e) => {
    const { value } = e.target;
    setWarehouseOriginId(value);
    handleChangeWarehouse(value);
  };

  const handleWarehouseDestinationChange = (e) => {
    const { value } = e.target;
    if (value === warehouseOriginId) {
      setErrors({ destinationWarehouseId: 'El destino no puede ser el mismo que el origen' });
      return;
    }
    setWarehouseDestinationId(value);
  };

  const handleSetQuantity = (value, index) => {
    const newProductsSelected = [...productSelected];
    newProductsSelected[index]['quantityByProduct'] = Number(value);
    if (newProductsSelected[index]['quantityByProduct'] > newProductsSelected[index]['currentQuantity']) {
      setErrors({ quantityByProduct: 'La cantidad a transferir supera a la cantidad actual en stock, solo podrá transferir hasta el stock actual.' });
      newProductsSelected[index]['quantityByProduct'] = newProductsSelected[index]['currentQuantity'];
      return;
    }
    setProductSelected(newProductsSelected);
  }


  const handleProductSelected = (index, newValue) => {
    const { value } = newValue;
    let productFiltered = productList.filter((p) => p.id === value)[0];

    if (productSelected[index]) {
      const newProductsSelected = [...productSelected];
      newProductsSelected[index].id = productFiltered?.id;
      newProductsSelected[index].price = productFiltered?.costPrice;
      newProductsSelected[index].currentQuantity = productFiltered?.stock;
      newProductsSelected[index].quantityByProduct = 1;
      setProductSelected(newProductsSelected);

    } else {
      let newProduct = {
        id: productFiltered?.id,
        price: productFiltered?.costPrice,
        currentQuantity: productFiltered?.stock,
        quantityByProduct: 1,
      };
      setProductSelected([...productSelected, newProduct]);
    };
    setDisableInput(false);
  };


  // Función para agregar una nueva fila
  const addRow = () => {
    setTransferStock([...transferStock, { productsSelected: [], type: 'transfer', reason: '', createdBy: '66d4ed2f825f2d54204555c1' }]);
  };

  // Función para eliminar una fila
  const removeRow = (index) => {
    const newTransferStock = transferStock.filter((_, i) => i !== index);
    let newProductsSelected = [...productSelected];
    newProductsSelected.splice(index, 1);
    setProductSelected(newProductsSelected);
    setTransferStock(newTransferStock);
    setErrors({ quantityByProduct: '' });
  };

  const handleMapProducts = () => {
    let productsSelect = productList.map((p) => {
      return {
        value: p?.id,
        label: p?.name
      }
    });
    return productsSelect;
  };

  const handleSubmit = async () => {
    setOpenResponseModal(false);

    try {
      let products = productSelected.map((p) => {
        return {
          productId: p?.id,
          quantityByProduct: p?.quantityByProduct,
        }
      })
      let payload = {
        companyId: companyId,
        warehouseId: warehouseOriginId,
        destinationWarehouseId: warehouseDestinationId,
        products: products,
        reason: reason,
        createdBy: "66d4ed2f825f2d54204555c1",
        quantity: totalQuantity,
        productId: "1",
        type: "transfer"
      }

      if (!validateInputsCreateTransfer(setErrors, payload)) return;

      toggleBackdrop();

      let response = await apiClient.create(url.CREATE_TRANSFER_STOCK, payload);

      if (response && response.results && Array.isArray(response.results)) {
        setResponseData(response);
        setOpenResponseModal(true);
      } else {
        openSnackbarDanger('Ocurrió un error :(, intenta más tarde.');
        return;
      }
    } catch (error) {
      console.log(error);
      let errorMessage = '';
      if (error.response) {
        // El servidor respondió con un código de error
        errorMessage = error.response.data.message;
      } else if (error.request) {
        // La solicitud fue hecha, pero no hubo respuesta
        errorMessage = 'No se recibió respuesta del servidor.';
      } else {
        // Algo más falló en la configuración de la solicitud
        errorMessage = 'Error: ' + error?.message ?? 'No se pudo completar la operación';
      }
      openSnackbarDanger(error);
      return;
    } finally {
      setOpenBackdrop(false);
    }
  }

  const handleChangeWarehouse = async (warehouseId) => {
    try {
      let products = await stockHelper.getProductsByWarehouse(page, limit, warehouseId);

      if (products && Array.isArray(products) && products.length > 0) {
        let parseProducts = products.map((p) => {
          return {
            id: p?._id,
            image: p?.additionalConfigs?.images?.[0] ?? "",
            name: p?.name,
            category: p?.categoryName,
            subCategory: p?.subCategoryName,
            stock: p?.stock,
            warehouse: p?.warehouseName,
            salePrice: p?.salePrice,
            costPrice: p?.costPrice,
            createdAt: p?.createdAt
          }
        });
        setProductList(parseProducts);
      }
      return;

    } catch (error) {
      console.log(error);
    }
  };

  React.useEffect(() => {
    calcTotalQuantity();
  }, [productSelected]);

  return (
    <React.Fragment>

      <ResponseModal
        responseData={responseData}
        openModal={openResponseModal}
        setOpenModal={setOpenResponseModal}
        setOpenBackdrop={setOpenBackdrop}
        handleClose={handleClose}
        dialogTitle={'Resultados del traslado'}
        alertTitle={'Estado del traslado'}
        alertTitleMessage={responseData?.message}
        cardTitle={'Detalle de Resultados'}
        cardSubheader={'Información de cada producto transferido'}
        cardContentTitleOne={'Producto'}
        cardContentTitleTwo={'Mensaje'}
      />

      <Dialog
        fullScreen
        open={openDrawer}
        onClose={handleClose}
        TransitionComponent={Transition}
      >
        <AppBar sx={{ position: 'relative' }}>
          <Toolbar>
            <IconButton
              edge="start"
              color="inherit"
              onClick={handleClose}
              aria-label="close"
            >
              <CloseIcon />
            </IconButton>

            <Typography sx={{ ml: 2, flex: 1 }} variant="h6" component="div">
              Nuevo traslado de stock
            </Typography>
            <Button autoFocus color="inherit" onClick={handleSubmit}>
              Guardar
            </Button>
          </Toolbar>
        </AppBar>

        <div>
          <Backdrop
            sx={(theme) => ({ color: '#fff', zIndex: theme.zIndex.drawer + 1 })}
            open={openBackdrop}
          /*  onClick={toggleBackdrop} */
          >
            <CircularProgress color="inherit" />
          </Backdrop>

          <Row className='px-4 py-3'>

            <Col md={4}>

              <label className='form-label' htmlFor="warehouseOriginId">*Bodega origen:</label>
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
                id="warehouseOriginId"
                name="warehouseOriginId"
                value={warehouseOriginId}
                onChange={handleWarehouseOriginChange}
                required
                className="form-control"
              >
                <option value="0">Selecciona una opción</option>
                {
                  dataSelectWarehouses.map((warehouse, index) => {
                    return (<option key={index} label={warehouse?.label} value={warehouse?.value}></option>)
                  })
                }
              </Input>
              {errors.warehouseId && (<span className="form-product-input-error">{errors.warehouseId}</span>)}
            </Col>

            <Col md={4}>

              <label className='form-label' htmlFor="warehouseId">*Bodega destino:</label>
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
                id="destinationWarehouseId"
                name="destinationWarehouseId"
                value={warehouseDestinationId}
                onChange={handleWarehouseDestinationChange}
                required
                className="form-control"
              >
                <option value="0">Selecciona una opción</option>
                {
                  dataSelectWarehouses.map((warehouse, index) => {
                    return (<option key={index} label={warehouse?.label} value={warehouse?.value}></option>)
                  })
                }
              </Input>
              {errors.destinationWarehouseId && (<span className="form-product-input-error">{errors.destinationWarehouseId}</span>)}
            </Col>

            <Col md={4}>
              <label className='form-label' htmlFor="note">*Nota:</label>
              <div>
                <GlobalInputText
                  name={'reason'}
                  onChange={(e) => setReason(e.target.value)}
                  placeholder={'Agregar nota'}
                  value={reason}
                  type={"text"}
                  className={"input-box"}
                  id={'reason'}
                  disabled={false}
                />
              </div>
              {errors.reason && (<span className="form-product-input-error">{errors.reason}</span>)}
            </Col>

          </Row>

          <Row className='px-4 py-3'>

            <Col md={12}>

              <div className="table-responsive h-full">
                <Table className="invoice-table table-borderless table-nowrap mb-0 h-full" >
                  <thead className="align-middle">
                    <tr>
                      <th>Producto</th>
                      <th>Cantidad</th>
                      <th>Acciones</th>
                    </tr>
                  </thead>

                  <tbody id="newlink">

                    {transferStock.map((transfer, index) => {
                      return (
                        <tr key={index}>
                          <td width={550} >
                            <Autocomplete
                              disablePortal
                              options={handleMapProducts()}
                              sx={{
                                width: 600,
                                padding: "0.69em",
                              }}
                              renderInput={(params) => <TextField className='input-box' {...params} variant="standard" placeholder={'Buscar producto...'} />}
                              onChange={(e, newValue) => handleProductSelected(index, newValue)}
                              disableClearable
                              noOptionsText={"No hay productos, selecciona una bodega."}
                              freeSolo
                            />
                            {productSelected[index]?.currentQuantity && (<span className='px-2'>Stock actual: {productSelected[index]?.currentQuantity}</span>)}
                          </td>
                          <td>
                            {/* Cantidad para trasladar */}
                            <InputSpin
                              setState={(value) => handleSetQuantity(value, index)}
                              value={productSelected[index]?.quantityByProduct}
                              min={"0"}
                              max={"5000"}
                              inputClassname={'bg-red'}
                              containerClass={"input-step full-width"}
                            />
                            {errors.quantityByProduct && (<span className="form-product-input-error">{errors.quantityByProduct}</span>)}
                          </td>

                          <td>
                            <IconButton
                              edge="end"
                              color="inherit"
                              onClick={() => removeRow(index)}
                              aria-label="close"
                            >
                              <CloseIcon />
                            </IconButton>
                          </td>
                        </tr>
                      )
                    })}

                  </tbody>

                  <tbody>
                    <tr>
                      <td colSpan="5" >
                        <Link
                          onClick={addRow}
                          to="#"
                          className="btn btn-soft-secondary fw-medium"
                          id="add-item"
                        >
                          <i className="ri-add-fill me-1 align-bottom"></i>{" "}
                          Agregar producto
                        </Link>
                      </td>

                      <td colSpan="3" >
                        <h5 className=' mt-3'>Cantidad total: <span>{totalQuantity}</span></h5>
                      </td>
                    </tr>
                  </tbody>
                </Table>
              </div>

            </Col>
          </Row>

        </div>

      </Dialog>
    </React.Fragment>
  );
}
