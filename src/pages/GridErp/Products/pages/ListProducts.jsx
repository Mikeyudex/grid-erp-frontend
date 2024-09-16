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

import BreadCrumb from "../components/BreadCrumb";


//Import actions
import { getProducts as onGetProducts, deleteProducts as onDeleteProducts } from "../../../../slices/thunks";

//Import helpers
import { numberFormatPrice, optionsSnackbarDanger, optionsSnackbarSuccess, ProductHelper } from '../helper/product_helper';

//redux
import { useSelector, useDispatch } from "react-redux";
import { toast, ToastContainer } from "react-toastify";
import { createSelector } from "reselect";
import { Link } from "react-router-dom";
import { FormatDate } from "../components/FormatDate";
import { TableContainerListProducts } from "../partials/TableContainerListProducts";

const helper = new ProductHelper();
const companyId = '3423f065-bb88-4cc5-b53a-63290b960c1a';

export const ListProducts = (props) => {
  document.title = "Productos | Innventa-G";
  const dispatch = useDispatch();

  const selectecomproductData = createSelector(
    (state) => state.Ecommerce,
    (products) => products.products
  );
  // Inside your component
  const products = useSelector(selectecomproductData);

  const [productList, setProductList] = useState([]);
  const [activeTab, setActiveTab] = useState("1");
  const [product, setProduct] = useState(null);
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(50);
  const [isLoadingTable, setIsLoadingTable] = useState(true);
  const [showProgressBarTable, setShowProgressBarTable] = useState(true);
  const [dataSelectCategories, setDataSelectCategories] = useState([]);
  const [dataSelectSubCategories, setDataSelectSubCategories] = useState([]);
  const [dataSelectWarehouses, setDataSelectWarehouses] = useState([]);
  const [validationErrors, setValidationErrors] = useState({});


  useEffect(() => {
    helper.getProducts(page, limit)
      .then(async (products) => {
        if (products && Array.isArray(products) && products.length > 0) {
          let parseProducts = products.map((p) => {
            return {
              id: p?._id,
              image: p?.additionalConfigs?.images?.[0] ?? "",
              name: `${p?.sku} - ${p?.name}`,
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
        setIsLoadingTable(false);
        setShowProgressBarTable(false);
        return;
      })
      .catch(e => console.log(e))
  }, []);

  /* useEffect(() => {
    helper.getCategoriesFullByCompanySelect(companyId)
      .then(async (response) => {
        setDataSelectCategories(response?.data ?? []);
      })
  }, []); */

  useEffect(() => {
    helper.getWarehouseByCompanySelect(companyId)
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
        header: "SKU - Producto",
        accessorKey: "name",
        enableColumnFilter: false,
        grow: true,
        size: 500, //large column
        Cell: ({ cell }) => (
          <>
            <div className="d-flex align-items-center">
              <div className="flex-shrink-0 me-3">
                <div className="avatar-sm bg-light rounded p-1">
                  <img
                    src={cell.row.original.image}
                    alt=""
                    className="img-fluid d-block"
                  />
                </div>
              </div>
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
        header: "Stock",
        accessorKey: "stock",
        enableColumnFilter: false,
        enableEditing: false,
        muiEditTextFieldProps: {
          required: true,
          error: !!validationErrors?.stock,
          helperText: validationErrors?.stock,
          onFocus: () =>
            setValidationErrors({
              ...validationErrors,
              stock: undefined,
            }),
        },
        Cell: ({ cell }) => {
          return (<h6>{cell.row.original.stock}</h6>)
        },
      },
      {
        header: "Precio de costo",
        accessorKey: "costPrice",
        enableColumnFilter: false,
        enableEditing: true,
        muiEditTextFieldProps: {
          required: true,
          error: !!validationErrors?.costPrice,
          helperText: validationErrors?.costPrice,
          onFocus: () =>
            setValidationErrors({
              ...validationErrors,
              costPrice: undefined,
            }),
        },
        Cell: ({ cell }) => {
          return (<h6>{numberFormatPrice(cell.row.original.costPrice)}</h6>)
        },
      },
      {
        header: "Precio de venta",
        accessorKey: "salePrice",
        enableColumnFilter: false,
        enableEditing: true,
        muiEditTextFieldProps: {
          required: true,
          error: !!validationErrors?.salePrice,
          helperText: validationErrors?.salePrice,
          onFocus: () =>
            setValidationErrors({
              ...validationErrors,
              salePrice: undefined,
            }),
        },
        Cell: ({ cell }) => {
          return (<h6>{numberFormatPrice(cell.row.original.salePrice)}</h6>)
        },
      },
      {
        header: "Categoría",
        accessorKey: "category",
        enableColumnFilter: true,
        enableEditing: false,
        editSelectOptions: dataSelectCategories.map((cat) => cat?.label),
        editVariant: 'select',
        muiEditTextFieldProps: {
          select: true,
          required: true,
          error: !!validationErrors?.category,
          helperText: validationErrors?.category,
          onFocus: () =>
            setValidationErrors({
              ...validationErrors,
              category: undefined,
            }),
        },
        Cell: ({ cell }) => {
          return (<h6>{cell.row.original.category}</h6>)
        },
      },
      {
        header: "SubCategoría",
        accessorKey: "subCategory",
        enableColumnFilter: true,
        enableEditing: false,
        Cell: ({ cell }) => {
          return (<h6>{cell.row.original.subCategory}</h6>)
        },
      },
      {
        header: "Creado",
        accessorKey: "createdAt",
        enableColumnFilter: false,
        enableEditing: false,
        Cell: ({ cell }) => {
          return <FormatDate {...cell} />;
        },
      },
    ],
    [dataSelectCategories, dataSelectWarehouses, validationErrors]
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
        <BreadCrumb title="Ver productos" pageTitle="Productos" />

        <Row>
          <div className="card-body pt-2 mt-1">
            <TableContainerListProducts
              columns={columns}
              productList={(productList || [])}
              isLoadingTable={isLoadingTable}
              showProgressBarTable={showProgressBarTable}
              setProductList={setProductList}
              setValidationErrors={setValidationErrors}
              validationErrors={validationErrors}
            />
          </div>
        </Row>
      </Container>
    </div>
  );
};

