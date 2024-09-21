import * as React from 'react';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import CloseIcon from '@mui/icons-material/Close';
import Slide from '@mui/material/Slide';
import { Col, Form, Input, Label, Row, Table } from 'reactstrap';
import { Link } from 'react-router-dom';
import Select from "react-select";
import InputSpin from '../../Products/components/InputSpin';
import { numberFormatPrice } from '../helper/stock_helper';

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
      quantity: 1,
      totalAdjustedPrice: 0
    },
  ]);
  const [disableInput, setDisableInput] = React.useState(true);
  const [warehouseSelected, setWarehouseSelected] = React.useState({
    warehouseId: ''
  });
  const [note, setNote] = React.useState("");
  const [productSelected, setProductSelected] = React.useState([]);

  const handleClose = () => {
    toggleDrawerCreateAdjustment();
    setAdjustments([
      {
        productId: '',
        adjustmentType: 'increase',
        quantity: 1,
        totalAdjustedPrice: 0
      },
    ]);
    setWarehouseSelected({warehouseId: ''});
    setProductSelected([]);
    setNote("");
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

    if (productSelected[index]) {

      const newProductsSelected = [...productSelected];
      newProductsSelected[index].price = productFiltered?.id;
      newProductsSelected[index].price = productFiltered?.costPrice;
      newProductsSelected[index].currentQuantity = productFiltered?.stock;
      newProductsSelected[index].amountToAdjust = 1;
      setProductSelected(newProductsSelected);

    } else {

      let newProduct = {
        id: productFiltered?.id,
        price: productFiltered?.costPrice,
        currentQuantity: productFiltered?.stock,
        amountToAdjust: 1
      };
      setProductSelected([...productSelected, newProduct]);

    };

    let newAdjustment = [...adjustments];
    let currentStock = productFiltered?.stock ?? 0;
    let productCost = productFiltered?.costPrice;
    newAdjustment[index]['totalAdjustedPrice'] = (currentStock + 1) * productCost;
    newAdjustment[index]['quantity'] = currentStock + 1;
    setAdjustments(newAdjustment);
    setDisableInput(false);

  };

  const handleSetQuantity = (value, index) => {
    const newProductsSelected = [...productSelected];
    newProductsSelected[index]['amountToAdjust'] = Number(value);
    let newAdjustment = [...adjustments];
    let productFiltered = productList.filter((p) => p.id === newProductsSelected[index]['id'])[0];

    if (newAdjustment[index].adjustmentType === 'increase') {

      newAdjustment[index]['quantity'] = productFiltered?.stock + Number(value);
      newAdjustment[index]['totalAdjustedPrice'] = newAdjustment[index]['quantity'] * productFiltered?.costPrice;

    } else if (newAdjustment[index].adjustmentType === 'decrease') {
      newAdjustment[index]['quantity'] = productFiltered?.stock - Number(value);
      newAdjustment[index]['totalAdjustedPrice'] = newAdjustment[index]['quantity'] * productFiltered?.costPrice;
    }
    setAdjustments(newAdjustment);
    setProductSelected(newProductsSelected);
  }

  // Función para agregar una nueva fila
  const addRow = () => {
    setAdjustments([...adjustments, { productId: '', adjustmentType: '', quantity: '', totalAdjustedPrice: '' }]);
  };

  // Función para eliminar una fila
  const removeRow = (index) => {
    const newAdjustments = adjustments.filter((_, i) => i !== index);
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
            <Button autoFocus color="inherit" onClick={handleClose}>
              save
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

            </Col>

            <Col md={6}>

              <label className='form-label' htmlFor="providerId">*Nota:</label>
              <div>
                <Input
                  type="text"
                  name="note"
                  value={note}
                  onChange={setNote}
                  placeholder="Agregar nota"
                />
              </div>

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
                      <th>Precio Total</th>
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
                              value={productSelected[index]?.amountToAdjust ?? 1}
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
                              name="quantity"
                              value={adjustment.quantity}
                              onChange={(e) => handleInputChange(index, e)}
                              placeholder="-"
                              disabled={true}
                            />
                          </td>
                          <td width={150}>
                            <Input
                              type="string"
                              name="totalAdjustedPrice"
                              value={numberFormatPrice(adjustment.totalAdjustedPrice)}
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
