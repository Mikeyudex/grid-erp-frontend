import React, { useEffect, useState, useMemo } from "react";

import {
  Container,
  UncontrolledDropdown,
  DropdownToggle,
  DropdownItem,
  DropdownMenu,
  Nav,
  NavItem,
  NavLink,
  UncontrolledCollapse,
  Row,
  Card,
  CardHeader,
  Col,
  Input,
} from "reactstrap";


// RangeSlider
import "nouislider/distribute/nouislider.css";

import DeleteModal from "../../../../Components/Common/DeleteModal";

//Import helpers
import { numberFormatPrice, StockHelper } from "../helper/stock_helper";

//redux
import { useSelector, useDispatch } from "react-redux";
import { toast, ToastContainer } from "react-toastify";
import { createSelector } from "reselect";
import { Link } from "react-router-dom";
import { FormatDate } from "../../Products/components/FormatDate";
//import { TableContainerListProducts } from "../partials/TableContainerListProducts";
import BreadCrumb from "../../Products/components/BreadCrumb";
import { ProductHelper } from "../../Products/helper/product_helper";
import {TableAdjustmentStock} from "../partials/TableAdjustmentStock";


const helper = new StockHelper();
const helperProduct = new ProductHelper();
const companyId = '3423f065-bb88-4cc5-b53a-63290b960c1a';

export const AdjustmentStockView = (props) => {
  document.title = "Stock | Innventa-G";
  const dispatch = useDispatch();

  const selectecomproductData = createSelector(
    (state) => state.Ecommerce,
    (products) => products.products
  );
  // Inside your component
  const products = useSelector(selectecomproductData);

  const [productList, setProductList] = useState([]);
  const [adjustmentList, setAdjustmentList] = useState([]);
  const [activeTab, setActiveTab] = useState("1");
  const [product, setProduct] = useState(null);
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(50);
  const [isLoadingTable, setIsLoadingTable] = useState(true);
  const [showProgressBarTable, setShowProgressBarTable] = useState(true);
  const [dataSelectWarehouses, setDataSelectWarehouses] = useState([]);
  const [validationErrors, setValidationErrors] = useState({});


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
        setIsLoadingTable(false);
        setShowProgressBarTable(false);
        return;
      })
      .catch(e => console.log(e))
  }, []);


  useEffect(() => {
    helperProduct.getWarehouseByCompanySelect(companyId)
      .then(async (response) => {
        setDataSelectWarehouses(response ?? []);
      })
  }, []);


  const toggleTab = (tab, type) => {
    if (activeTab !== tab) {
      setActiveTab(tab);
      let filteredProducts = products;
      if (type !== "all") {
        filteredProducts = products.filter((product) => product.status === type);
      }
      setProductList(filteredProducts);
    }
  };

  //delete order
  const [deleteModal, setDeleteModal] = useState(false);
  const [deleteModalMulti, setDeleteModalMulti] = useState(false);



  const handleDeleteProduct = () => {
    if (product) {
      dispatch(onDeleteProducts(product._id));
      setDeleteModal(false);
    }
  };

  // Displat Delete Button
  const [dele, setDele] = useState(0);
  const displayDelete = () => {
    const ele = document.querySelectorAll(".productCheckBox:checked");
    const del = document.getElementById("selection-element");
    setDele(ele.length);
    if (ele.length === 0) {
      del.style.display = 'none';
    } else {
      del.style.display = 'block';
    }
  };

  // Delete Multiple
  const deleteMultiple = () => {
    const ele = document.querySelectorAll(".productCheckBox:checked");
    const del = document.getElementById("selection-element");
    ele.forEach((element) => {
      dispatch(onDeleteProducts(element.value));
      setTimeout(() => { toast.clearWaitingQueue(); }, 3000);
      del.style.display = 'none';
    });
  };


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
      <DeleteModal
        show={deleteModal}
        onDeleteClick={handleDeleteProduct}
        onCloseClick={() => setDeleteModal(false)}
      />
      <DeleteModal
        show={deleteModalMulti}
        onDeleteClick={() => {
          deleteMultiple();
          setDeleteModalMulti(false);
        }}
        onCloseClick={() => setDeleteModalMulti(false)}
      />
      <Container fluid>
        <BreadCrumb title="Ajuste de stock" pageTitle="Stock" />

        <Row>
          <div className="card-body pt-2 mt-1">
            <TableAdjustmentStock
              columns={columns}
              adjustmentList={(adjustmentList || [])}
              isLoadingTable={isLoadingTable}
              showProgressBarTable={showProgressBarTable}
              setAdjustmentList={setAdjustmentList}
              setValidationErrors={setValidationErrors}
              validationErrors={validationErrors}
            />
          </div>
        </Row>
      </Container>
    </div>
  );
};

