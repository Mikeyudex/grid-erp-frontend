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
import Select from "react-select";
import InputSpin from '../../Products/components/InputSpin';
import { numberFormatPrice, validateInputs } from '../helper/stock_helper';
import { companyId } from '../helper/url_helper';

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

export function CreateAdjustmentStock({
  openDrawer,
  toggleDrawerCreateAdjustment,
  dataSelectWarehouses,
  productList
}) {
  const [adjustments, setAdjustments] = React.useState([
    {
      productId: '',
      adjustmentType: 'increase',
      quantity: 1
    },
  ]);
  const [disableInput, setDisableInput] = React.useState(true);
  const [warehouseSelected, setWarehouseSelected] = React.useState({ warehouseId: '' });
  const [note, setNote] = React.useState("");
  const [productSelected, setProductSelected] = React.useState([]);
  const [totalAdjustedPrice, setTotalAdjustedPrice] = React.useState(0);
  const [errors, setErrors] = React.useState({});

  const handleClose = () => {
    toggleDrawerCreateAdjustment();
    setAdjustments([
      {
        productId: '',
        adjustmentType: 'increase',
        quantity: 1
      },
    ]);
    setWarehouseSelected({ warehouseId: '' });
    setProductSelected([]);
    setNote("");
    setTotalAdjustedPrice(0);
  };

  // Función para manejar los cambios en cada input
  const handleInputChange = (index, event) => {
    const { name, value } = event.target;
    const newAdjustments = [...adjustments];
    newAdjustments[index][name] = value;
    setAdjustments(newAdjustments);
  };

  const handleWarehouseChange = (e) => {
    const { name, value } = e.target;
    setWarehouseSelected((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleProductSelected = (index, event) => {

    const { value } = event;
    let productFiltered = productList.filter((p) => p.id === value)[0];
    let currentStock = productFiltered?.stock ?? 0;
    let productCost = productFiltered?.costPrice;

    if (productSelected[index]) {
      const newProductsSelected = [...productSelected];
      newProductsSelected[index].id = productFiltered?.id;
      newProductsSelected[index].price = productFiltered?.costPrice;
      newProductsSelected[index].currentQuantity = productFiltered?.stock;
      newProductsSelected[index].amountToAdjust = currentStock + 1;
      newProductsSelected[index].adjustedPrice = (currentStock + 1) * productCost;
      setProductSelected(newProductsSelected);

    } else {
      let newProduct = {
        id: productFiltered?.id,
        price: productFiltered?.costPrice,
        currentQuantity: productFiltered?.stock,
        amountToAdjust: currentStock + 1,
        adjustedPrice: (currentStock + 1) * productCost
      };
      setProductSelected([...productSelected, newProduct]);
    };

    let newAdjustment = [...adjustments];
    newAdjustment[index]['quantity'] = 1;
    newAdjustment[index]['productId'] = productFiltered?.id;
    newAdjustment[index]['adjustmentType'] = 'increase';

    setAdjustments(newAdjustment);
    setDisableInput(false);
  };

  const handleSetQuantity = (value, index) => {
    const newProductsSelected = [...productSelected];

    let newAdjustment = [...adjustments];
    let productFiltered = productList.filter((p) => p.id === newProductsSelected[index]['id'])[0];
    newAdjustment[index]['quantity'] = Number(value);

    if (newAdjustment[index].adjustmentType === 'increase') {
      newProductsSelected[index]['amountToAdjust'] = productFiltered?.stock + Number(value);
      newProductsSelected[index]['adjustedPrice'] = newProductsSelected[index]['amountToAdjust'] * productFiltered?.costPrice;

    } else if (newAdjustment[index].adjustmentType === 'decrease') {
      newProductsSelected[index]['amountToAdjust'] = productFiltered?.stock - Number(value);
      newProductsSelected[index]['adjustedPrice'] = newProductsSelected[index]['amountToAdjust'] * productFiltered?.costPrice;
    }
    setProductSelected(newProductsSelected);
    setAdjustments(newAdjustment);
  }

  // Función para agregar una nueva fila
  const addRow = () => {
    setAdjustments([...adjustments, { productId: '', adjustmentType: '', quantity: '', totalAdjustedPrice: '' }]);
  };

  // Función para eliminar una fila
  const removeRow = (index) => {
    const newAdjustments = adjustments.filter((_, i) => i !== index);
    let newProductsSelected = [...productSelected];
    newProductsSelected.splice(index, 1);
    setProductSelected(newProductsSelected);
    setAdjustments(newAdjustments);
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

  const calcTotalAdjustedPrice = () => {
    let newProductsSelected = [...productSelected];

    let _totalAdjustedPrice = newProductsSelected.reduce((acc, currentValue) => {
      let adjustedPrice = currentValue?.adjustedPrice;
      return acc + adjustedPrice;
    }, 0);
    setTotalAdjustedPrice(_totalAdjustedPrice);
  }

  const handleSubmit = async () => {
    try {
      let products = productSelected.map((p) => {
        return {
          productId: p?.id,
          oldQuantity: p?.currentQuantity,
          newQuantity: p?.amountToAdjust,
          costPrice: p?.price
        }
      })
      let payload = {
        companyId: companyId,
        warehouseId: warehouseSelected.warehouseId,
        products: products,
        totalAdjustedPrice: totalAdjustedPrice,
        note: note,
        createdBy: "66d4ed2f825f2d54204555c1"
      }

      if (!validateInputs(setErrors, payload)) return;


    } catch (error) {
      console.log(error);
    }
  }

  React.useEffect(() => {
    calcTotalAdjustedPrice();
  }, [productSelected]);

  return (
    <React.Fragment>

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
              Nuevo ajuste de stock
            </Typography>
            <Button autoFocus color="inherit" onClick={handleSubmit}>
              Guardar
            </Button>
          </Toolbar>
        </AppBar>

        <div>
          <Row className='px-4 py-3'>

            <Col md={6}>

              <label className='form-label' htmlFor="warehouseId">*Bodega:</label>
              <Input
                style={{ border: 'none', borderBottom: '1px solid #132649', background: '#f7f7f9c7' }}
                bsSize="md"
                type="select"
                id="warehouseId"
                name="warehouseId"
                value={warehouseSelected.warehouseId}
                onChange={handleWarehouseChange}
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

            <Col md={6}>

              <label className='form-label' htmlFor="note">*Nota:</label>
              <div>
                <Input
                  type="text"
                  name="note"
                  value={note}
                  onChange={(e) => setNote(e.target.value)}
                  placeholder="Agregar nota"
                />
              </div>
              {errors.note && (<span className="form-product-input-error">{errors.note}</span>)}
            </Col>

          </Row>

          <Row className='px-4 py-3'>

            <Col md={12}>

              <div className="table-responsive h-full">
                <Table className="invoice-table table-borderless table-nowrap mb-0 h-full" >
                  <thead className="align-middle">
                    <tr>
                      <th>Producto</th>
                      <th>Precio</th>
                      <th>Acción</th>
                      <th>Cantidad</th>
                      <th>Cantidad Ajustada</th>
                      <th>Precio ajustado</th>
                      <th>Acciones</th>
                    </tr>
                  </thead>

                  <tbody id="newlink">

                    {adjustments.map((adjustment, index) => {
                      return (
                        <tr key={index}>
                          <td width={550} >
                            <Select
                              isSearchable={true}
                              onChange={(e) => handleProductSelected(index, e)}
                              options={handleMapProducts()}
                              placeholder={'Buscar producto...'}
                            />
                          </td>
                          <td width={120} >
                            <Input
                              type="number"
                              name="price"
                              value={productSelected[index]?.price}
                              placeholder="-"
                              disabled={true}
                            />
                          </td>
                          <td width={220}>
                            <Input
                              style={{ border: 'none', borderBottom: '1px solid #132649', background: '#f7f7f9c7' }}
                              bsSize="md"
                              type="select"
                              id="adjustmentType"
                              name="adjustmentType"
                              value={adjustment.adjustmentType}
                              onChange={(e) => handleInputChange(index, e)}
                              required
                              className="form-control"
                              disabled={disableInput}
                            >
                              <option value="increase">Aumentar</option>
                              <option value="decrease">Disminuir</option>
                            </Input>
                          </td>
                          <td>
                            {/* Cantidad para ajustar */}
                            <InputSpin
                              setState={(value) => handleSetQuantity(value, index)}
                              value={adjustment.quantity}
                              min={"0"}
                              max={"5000"}
                              inputClassname={'bg-red'}
                              containerClass={"input-step full-width"}
                            />
                          </td>
                          <td width={100}>
                            {/* Cantidad del producto ajustada */}
                            <Input
                              type="number"
                              name="amountToAdjust"
                              value={productSelected[index]?.amountToAdjust ?? 1}
                              onChange={(e) => handleInputChange(index, e)}
                              placeholder="-"
                              disabled={true}
                            />
                          </td>
                          <td width={150}>
                            <Input
                              type="string"
                              name="adjustedPrice"
                              value={numberFormatPrice(productSelected[index]?.adjustedPrice ?? 0)}
                              onChange={(e) => handleInputChange(index, e)}
                              placeholder="0,00"
                              disabled={true}
                            />
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
                        <h5 className=' mt-3'>Total: <span>{numberFormatPrice(totalAdjustedPrice)}</span></h5>
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
