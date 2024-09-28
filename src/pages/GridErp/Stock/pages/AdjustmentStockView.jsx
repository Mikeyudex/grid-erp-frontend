import React, { useEffect, useState, useMemo } from "react";
import {
  Container,
  Row,
} from "reactstrap";
import { useSnackbar } from 'react-simple-snackbar';
import { toast, ToastContainer } from "react-toastify";
import { Link } from "react-router-dom";

import "nouislider/distribute/nouislider.css";
import { numberFormatPrice, optionsSnackbarDanger, optionsSnackbarSuccess, StockHelper } from "../helper/stock_helper";
import { FormatDate } from "../../Products/components/FormatDate";
import BreadCrumb from "../../Products/components/BreadCrumb";
import { ProductHelper } from "../../Products/helper/product_helper";
import { TableAdjustmentStock } from "../partials/TableAdjustmentStock";
import { CreateAdjustmentStock } from "../components/CreateAdjustmentStock";

const helper = new StockHelper();
const helperProduct = new ProductHelper();
const companyId = '3423f065-bb88-4cc5-b53a-63290b960c1a';

export const AdjustmentStockView = (props) => {
  document.title = "Stock | Innventa-G";

  const [adjustmentList, setAdjustmentList] = useState([]);
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(50);
  const [isLoadingTable, setIsLoadingTable] = useState(true);
  const [showProgressBarTable, setShowProgressBarTable] = useState(true);
  const [dataSelectWarehouses, setDataSelectWarehouses] = useState([]);
  const [validationErrors, setValidationErrors] = useState({});
  const [showCreateAdjustment, setShowCreateAdjustment] = useState(false);
  const [openSnackbarSuccess, closeSnackbarSuccess] = useSnackbar(optionsSnackbarSuccess);
  const [openSnackbarDanger, closeSnackbarDanger] = useSnackbar(optionsSnackbarDanger);

  const toggleDrawerCreateAdjustment = () => {
    setShowCreateAdjustment(!showCreateAdjustment);
  }

  useEffect(() => {
    helper.getRecentAdjustmentStock(page, limit)
      .then(async (adjustments) => {
        if (adjustments && Array.isArray(adjustments) && adjustments.length > 0) {
          let parseAdjustments = adjustments.map((a) => {
            return {
              adjustmentId: a?._id,
              warehouse: a?.warehouseId?.name,
              totalAdjustedPrice: a?.totalAdjustedPrice,
              note: a?.note,
              adjustmentDate: a?.adjustmentDate,
            }
          });
          setAdjustmentList(parseAdjustments);
        }
        return;
      })
      .catch(e => {
        openSnackbarDanger('Ocurrió un error :(, intenta más tarde.');
        console.log(e);
      })
      .finally(() => {
        setIsLoadingTable(false);
        setShowProgressBarTable(false);
      });
  }, [showCreateAdjustment]);


  useEffect(() => {
    helperProduct.getWarehouseByCompanySelect(companyId)
      .then(async (response) => {
        setDataSelectWarehouses(response ?? []);
      }).catch(e => {
        openSnackbarDanger('Ocurrió un error :(, intenta más tarde.');
        console.log(e);
      })
  }, []);


  const columns = useMemo(() =>
    [
      {
        header: "Número",
        accessorKey: "adjustmentId",
        enableColumnFilter: true,
        enableEditing: false,
        grow: true,
        size: 100,
        Cell: ({ cell }) => (
          <>
            <div className="d-flex align-items-center">
              <div className="flex-grow-1">
                <h5 className="fs-14 mb-1">
                  <Link
                    to="/apps-ecommerce-product-details"
                    className="text-body"
                  >
                    {" "}
                    {cell.getValue()}
                  </Link>
                </h5>
              </div>
            </div>
          </>
        ),
      },
      {
        header: "Bodega",
        accessorKey: "warehouse",
        enableColumnFilter: true,
        enableEditing: true,
        editSelectOptions: dataSelectWarehouses.map((wa) => wa?.label),
        editVariant: 'select',
        muiEditTextFieldProps: {
          select: true,
          required: true,
          error: !!validationErrors?.warehouse,
          helperText: validationErrors?.warehouse,
          onFocus: () =>
            setValidationErrors({
              ...validationErrors,
              warehouse: undefined,
            }),
        },
        Cell: ({ cell }) => {
          return (<h6>{cell.row.original.warehouse}</h6>)
        },
      },
      {
        header: "Fecha",
        accessorKey: "adjustmentDate",
        enableColumnFilter: true,
        enableEditing: false,
        Cell: ({ cell }) => {
          return <FormatDate {...cell} />;
        },
      },
      {
        header: "Total ajustado",
        accessorKey: "totalAdjustedPrice",
        enableColumnFilter: true,
        enableEditing: false,
        muiEditTextFieldProps: {
          required: true,
          error: !!validationErrors?.totalAdjustedPrice,
          helperText: validationErrors?.totalAdjustedPrice,
          onFocus: () =>
            setValidationErrors({
              ...validationErrors,
              totalAdjustedPrice: undefined,
            }),
        },
        Cell: ({ cell }) => {
          return (<h6>{numberFormatPrice(cell.row.original.totalAdjustedPrice)}</h6>)
        },
      },
      {
        header: "Nota",
        accessorKey: "note",
        enableColumnFilter: false,
        enableEditing: true,
        Cell: ({ cell }) => {
          return (<h6>{cell.row.original.note}</h6>)
        },
      },
    ],
    [dataSelectWarehouses, validationErrors]
  );

  return (
    <div className="page-content">
      <ToastContainer closeButton={false} limit={1} />
      <Container fluid>
        <BreadCrumb title="Ajuste de stock" pageTitle="Stock" />

        <Row>
          <div className="card-body pt-2 mt-1">
            <CreateAdjustmentStock
              openDrawer={showCreateAdjustment}
              toggleDrawerCreateAdjustment={toggleDrawerCreateAdjustment}
              dataSelectWarehouses={dataSelectWarehouses}
            />
            <TableAdjustmentStock
              columns={columns}
              adjustmentList={(adjustmentList || [])}
              isLoadingTable={isLoadingTable}
              showProgressBarTable={showProgressBarTable}
              setAdjustmentList={setAdjustmentList}
              setValidationErrors={setValidationErrors}
              validationErrors={validationErrors}
              toggleDrawerCreateAdjustment={toggleDrawerCreateAdjustment}
            />
          </div>
        </Row>
      </Container>
    </div>
  );
};

